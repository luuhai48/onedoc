import { logger, MongoService } from '@onedoc/shared';
import { crawlSwaggerEndpoints } from './worker';

const bootstrap = async () => {
  await MongoService.connect();
  logger.info('MongoDB connected');
};

bootstrap().then(async () => {
  const shutdown = async () => {
    await MongoService.disconnect();

    logger.info('MongoDB disconnected');
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  await crawlSwaggerEndpoints();
});
