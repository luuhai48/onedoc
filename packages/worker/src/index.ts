import { getEnv, logger, MongoService } from '@onedoc/shared';
import cron from 'node-cron';
import { crawlSwaggerEndpoints } from './worker';

const bootstrap = async () => {
  await MongoService.connect();
  logger.info('MongoDB connected');
};

bootstrap().then(async () => {
  logger.info('Running initial swagger endpoints crawl');
  await crawlSwaggerEndpoints();

  const crawlSchedule = getEnv('WORKER_SCHEDULE', '0 * * * *');
  logger.info(`Scheduling swagger endpoints crawl (cron: ${crawlSchedule})`);

  const task = cron.schedule(crawlSchedule, async () => {
    try {
      await crawlSwaggerEndpoints();
    } catch (error) {
      logger.error('Error during scheduled crawl:', error);
    }
  });

  logger.info('Worker service started with cron scheduling');

  const shutdown = async () => {
    await task.destroy();
    logger.info('Cron task stopped');

    await MongoService.disconnect();
    logger.info('MongoDB disconnected');

    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
});
