import { service } from '@onedoc/shared';
import { type Context, Hono } from 'hono';

const listSwaggers = async (c: Context) => {
  const links = await service('swaggerService').list();
  return c.json(links);
};

export const registerRoutes = (app: Hono) => {
  const v1 = new Hono();
  v1.get('/', (c) => c.json({ message: 'ok', timestamp: new Date() }));
  v1.get('/swaggers', listSwaggers);

  app.route('/api/v1', v1);
};
