import { logger } from '@onedoc/shared';
import { logger as honoLogger } from 'hono/logger';

export const loggerMiddleware = honoLogger((message, ...rest) => logger.http(message, ...rest));
