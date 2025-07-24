import { zValidator } from '@hono/zod-validator';
import { PaginationFilterSchema, service } from '@onedoc/shared';
import { Hono } from 'hono';

export const registerRoutes = (app: Hono) => {
  const v1 = new Hono();
  v1.get('/', (c) => c.json({ message: 'ok', timestamp: new Date() }));

  v1.get('/swaggers', zValidator('query', PaginationFilterSchema), async (c) => {
    const { page, limit, sort, order } = c.req.valid('query');

    const links = await service('swaggerService').listEndpoints({
      page,
      limit,
      sort,
      order,
    });

    return c.json(links);
  });

  app.route('/api/v1', v1);
};
