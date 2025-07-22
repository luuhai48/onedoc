import { getEnv, logger } from '@onedoc/shared';
import { Hono } from 'hono';

import { corsMiddleware } from './middlewares/cors.middleware';
import { loggerMiddleware } from './middlewares/logger.middleware';
import { registerRoutes } from './routes';

const env = getEnv('NODE_ENV');
const port = getEnv('PORT', '3000');

const app = new Hono();

app.use(loggerMiddleware);
app.use('*', corsMiddleware);

registerRoutes(app);

const server = Bun.serve({
  port: parseInt(port),
  fetch: app.fetch,
  hostname: '0.0.0.0',
  development: env !== 'production',
});

const shutdown = async () => {
  await new Promise<void>((resolve) => setTimeout(resolve, 100));
  await server.stop();
  logger.info('Shutdown complete');
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

logger.info(`Running on http://localhost:${port}`);
