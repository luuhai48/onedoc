import { getEnv } from '@onedoc/shared';
import { cors } from 'hono/cors';
import { minimatch } from 'minimatch';

const allowedOrigins = getEnv('ALLOWED_ORIGINS', '')
  .split(',')
  .map((origin) => origin.trim());

export const corsMiddleware = cors({
  origin: (origin) => {
    if (!allowedOrigins.length || !allowedOrigins.some((allowed) => minimatch(origin, allowed))) return null;

    return origin;
  },
});
