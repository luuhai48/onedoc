import type { SwaggerEndpointResponse, SwaggerPatchResponse } from '@onedoc/shared';

export const getListSwaggerEndpoints = async (): Promise<SwaggerEndpointResponse[]> => {
  const response = await fetch('/api/v1/swaggers?sort=order=desc');
  if (!response.ok) {
    throw new Error('Failed to fetch swagger endpoints');
  }
  return response.json();
};

export const getSwaggerVersions = async (
  endpointId: string,
  {
    limit = 10,
    page = 1,
  }: {
    limit?: number;
    page?: number;
  },
): Promise<{
  data: SwaggerPatchResponse[];
  total: number;
}> => {
  const queryParams = new URLSearchParams();
  queryParams.set('limit', limit.toString());
  queryParams.set('page', page.toString());
  const response = await fetch(`/api/v1/swaggers/${endpointId}/versions?${queryParams.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch swagger versions');
  }
  return response.json();
};

export const getProxiedSwaggerUrl = (originalUrl: string): string => {
  const encodedUrl = encodeURIComponent(originalUrl);
  return `/api/v1/proxy/swagger?url=${encodedUrl}`;
};

export const createSwaggerUIConfig = (swaggerUrl: string) => {
  // Extract the base URL from the Swagger URL for API calls
  const swaggerUrlObj = new URL(swaggerUrl);
  const baseUrl = `${swaggerUrlObj.protocol}//${swaggerUrlObj.host}`;

  return {
    url: swaggerUrl,
    displayRequestDuration: true,
    persistAuthorization: true,
    showMutatedRequest: false,
    requestInterceptor: (request: any) => {
      // Intercept API calls and route them through our proxy
      const originalUrl = request.url;

      // Handle relative URLs by converting them to absolute URLs
      let targetUrl = originalUrl;
      if (originalUrl.startsWith('/') || originalUrl.startsWith('./') || originalUrl.startsWith('../')) {
        // Convert relative URL to absolute URL using the Swagger base URL
        targetUrl = new URL(originalUrl, baseUrl).href;
      }

      // Proxy all requests that are either:
      // 1. Absolute URLs matching the Swagger base URL
      // 2. Relative URLs (which we just converted to absolute)
      if (targetUrl.startsWith(baseUrl) || originalUrl.startsWith('/')) {
        const encodedUrl = encodeURIComponent(targetUrl);
        request.url = `/api/v1/proxy/api?url=${encodedUrl}`;
      }

      return request;
    },
  };
};
