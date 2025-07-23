import { getEnv, logger, MongoService } from '@onedoc/shared';
import { Hono } from 'hono';
import { corsMiddleware } from './middlewares/cors.middleware';
import { loggerMiddleware } from './middlewares/logger.middleware';
import { staticMiddleware } from './middlewares/static.middleware';
import { registerRoutes } from './routes';

const env = getEnv('NODE_ENV');
const port = getEnv('PORT', '3000');

const app = new Hono();

app.use(loggerMiddleware);
app.use('*', corsMiddleware);

registerRoutes(app);

app.get('*', staticMiddleware({ root: './web/dist' }));
app.get('*', staticMiddleware({ path: './web/dist/index.html' }));

const bootstrap = async () => {
  await MongoService.connect();

  logger.info('MongoDB connected');
};

bootstrap().then(async () => {
  const server = Bun.serve({
    port: parseInt(port),
    fetch: app.fetch,
    hostname: '0.0.0.0',
    development: env !== 'production',
  });

  const shutdown = async () => {
    await MongoService.disconnect();

    await server.stop();
    logger.info('Shutdown complete');
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  logger.info(`Running on http://localhost:${port}`);
});
