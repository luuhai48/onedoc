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
      const { sort, order, afterId, beforeId } = c.req.valid('query');

      const patches = await service('swaggerService').listPatches(id, {
        sort,
        order,
        afterId,
        beforeId,
      });

      return c.json(patches);
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

  app.route('/api/v1', v1);
};
