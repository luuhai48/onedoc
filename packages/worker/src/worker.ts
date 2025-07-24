import { generateContentHash, generatePatch, logger, service } from '@onedoc/shared';

const fetchSwaggerContent = async (url: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch swagger: ${response.status} ${response.statusText}`);
    }
    const json = await response.json();
    if (!json || typeof json !== 'object') {
      throw new Error('Invalid swagger response');
    }
    return json;
  } catch (error) {
    logger.error(`Error fetching swagger from ${url}:`, error);
    throw error;
  }
};

const processSwaggerEndpoint = async (endpoint: { _id: string; url: string; name: string }) => {
  try {
    console.log(
      '-------------------------------------------------------------------------------------------------------',
    );
    logger.info(`Processing swagger endpoint: ${endpoint.name} (${endpoint.url})`);

    const json = await fetchSwaggerContent(endpoint.url);

    const hash = generateContentHash(json);

    const latestVersion = await service('swaggerService').getSwaggerVersion(endpoint._id);
    if (!latestVersion) {
      logger.info(`Swagger endpoint ${endpoint.name} has no version yet. Creating a new one`);
      await service('swaggerService').upsertSwaggerVersion(endpoint._id, hash, json);
      return;
    }

    if (latestVersion.latestHash === hash) {
      logger.info(`Swagger endpoint ${endpoint.name} has not changed`);
      return;
    }

    logger.info(`Swagger endpoint ${endpoint.name} has changed. Updating the latest version and creating a new patch`);
    const patch = generatePatch(latestVersion.content, json);

    if (!patch) {
      logger.info(
        `Swagger endpoint ${endpoint.name} has not changed when comparing ${latestVersion.latestHash} and ${hash}`,
      );
      return;
    }

    await service('swaggerService').upsertSwaggerVersion(endpoint._id, hash, json);
    await service('swaggerService').upsertSwaggerPatch(endpoint._id, hash, patch);
  } catch (error) {
    logger.error(`Error processing swagger endpoint ${endpoint.name}:`, error);
  } finally {
    console.log(
      '-------------------------------------------------------------------------------------------------------',
    );
  }
};

export const crawlSwaggerEndpoints = async () => {
  logger.info('Crawling swagger endpoints');

  const endpoints = await service('swaggerService').listEndpoints({
    sort: '_id',
    order: 'asc',
  });

  logger.info(`Found ${endpoints.length} swagger endpoints`);

  for (const endpoint of endpoints) {
    await processSwaggerEndpoint(endpoint);
  }
};
