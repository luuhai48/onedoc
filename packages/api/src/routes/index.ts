import { zValidator } from '@hono/zod-validator';
import { IdParamSchema, IdParamSchemaWithPatchId, PaginationFilterSchema, service } from '@onedoc/shared';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';

export const registerRoutes = (app: Hono) => {
  const v1 = new Hono();
  v1.get('/', (c) => c.json({ message: 'ok', timestamp: new Date() }));

  v1.get('/swaggers', zValidator('query', PaginationFilterSchema), async (c) => {
    const { sort, order } = c.req.valid('query');

    const links = await service('swaggerService').listEndpoints({
      sort,
      order,
    });

    return c.json(links);
  });

  v1.get(
    '/swaggers/:id/versions',
    zValidator('param', IdParamSchema),
    zValidator('query', PaginationFilterSchema),
    async (c) => {
      const { id } = c.req.param();
      const { sort, order, limit, page } = c.req.valid('query');

      const { data, total } = await service('swaggerService').listPatches(id, {
        sort,
        order,
        limit,
        page,
      });

      return c.json({
        data,
        total,
      });
    },
  );

  v1.get('/swaggers/:id/versions/:patchId', zValidator('param', IdParamSchemaWithPatchId), async (c) => {
    const { id, patchId } = c.req.param();

    const version = await service('swaggerService').getSwaggerVersionByPatchId(id, patchId);
    if (!version) {
      throw new HTTPException(400, { message: 'Version not found' });
    }
    if (version instanceof Error) {
      throw new HTTPException(400, { message: 'Error undoing patch', cause: version });
    }

    return c.json(version);
  });

  // Proxy endpoint to fetch Swagger JSON from external URLs
  v1.get('/proxy/swagger', async (c) => {
    const url = c.req.query('url');

    if (!url) {
      throw new HTTPException(400, { message: 'URL parameter is required' });
    }

    // Validate URL format for security
    try {
      const urlObj = new URL(url);
      // Only allow HTTP and HTTPS protocols
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        throw new HTTPException(400, { message: 'Only HTTP and HTTPS URLs are allowed' });
      }
    } catch {
      throw new HTTPException(400, { message: 'Invalid URL format' });
    }

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new HTTPException(400, {
          message: `Failed to fetch from ${url}: ${response.statusText}`,
        });
      }

      const contentType = response.headers.get('content-type');
      const swaggerData = (await response.json()) as Record<string, unknown>;

      // Set appropriate headers for the response
      c.header('Content-Type', contentType || 'application/json');

      return c.json(swaggerData);
    } catch (error) {
      if (error instanceof HTTPException) {
        throw error;
      }

      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new HTTPException(500, {
        message: `Failed to proxy request to ${url}`,
        cause: errorMessage,
      });
    }
  });

  // Comprehensive proxy endpoint for API calls from SwaggerUI
  v1.all('/proxy/api/*', async (c) => {
    const targetUrl = c.req.query('url');

    if (!targetUrl) {
      throw new HTTPException(400, { message: 'URL parameter is required' });
    }

    // Validate URL format for security
    try {
      const urlObj = new URL(targetUrl);
      // Only allow HTTP and HTTPS protocols
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        throw new HTTPException(400, { message: 'Only HTTP and HTTPS URLs are allowed' });
      }
    } catch {
      throw new HTTPException(400, { message: 'Invalid URL format' });
    }

    try {
      // Get the request method
      const method = c.req.method;

      // Get all headers from the original request
      const headers: Record<string, string> = {};
      const requestHeaders = c.req.header();
      Object.entries(requestHeaders).forEach(([key, value]) => {
        // Skip certain headers that shouldn't be forwarded
        if (!['host', 'origin', 'referer'].includes(key.toLowerCase())) {
          headers[key] = value;
        }
      });

      // Get request body for non-GET requests
      let body: string | undefined;
      if (method !== 'GET' && method !== 'HEAD') {
        body = await c.req.text();
      }

      // Prepare fetch options
      const fetchOptions: RequestInit = {
        method,
        headers,
      };

      if (body) {
        fetchOptions.body = body;
      }

      // Make the request to the target URL
      const response = await fetch(targetUrl, fetchOptions);

      // Get response headers
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        // Skip certain headers that might cause issues
        if (!['content-encoding', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
          responseHeaders[key] = value;
        }
      });

      // Add CORS headers to allow the response
      responseHeaders['Access-Control-Allow-Origin'] = c.req.header('origin') || '*';
      responseHeaders['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, PATCH, OPTIONS';
      responseHeaders['Access-Control-Allow-Headers'] = '*';
      responseHeaders['Access-Control-Allow-Credentials'] = 'true';

      // Set all response headers
      Object.entries(responseHeaders).forEach(([key, value]) => {
        c.header(key, value);
      });

      // Handle different response types
      const contentType = response.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        const data = (await response.json()) as Record<string, unknown>;
        return c.json(data, response.status as any);
      } else if (contentType?.includes('text/')) {
        const text = await response.text();
        return c.text(text, response.status as any);
      } else {
        // For binary data or other content types
        const buffer = await response.arrayBuffer();
        return new Response(buffer, {
          status: response.status,
          headers: responseHeaders,
        });
      }
    } catch (error) {
      if (error instanceof HTTPException) {
        throw error;
      }

      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new HTTPException(500, {
        message: `Failed to proxy request to ${targetUrl}`,
        cause: errorMessage,
      });
    }
  });

  app.route('/api/v1', v1);
};
