import { Hono } from 'hono';

export const registerRoutes = (app: Hono) => {
  const v1 = new Hono();
  v1.get('/', (c) => c.json({ message: 'ok', timestamp: new Date() }));

  app.route('/api/v1', v1);
};
