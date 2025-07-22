import type { Context, Next } from 'hono';
import { serveStatic } from 'hono/bun';
import type { ServeStaticOptions } from 'hono/serve-static';

export const staticMiddleware = (options: ServeStaticOptions) => {
  const serve = serveStatic({
    precompressed: true,
    ...options,
  });

  return async (c: Context, next: Next) => {
    const path = options.path ?? c.req.path;
    try {
      decodeURI(path);
    } catch {
      return c.redirect('/');
    }

    return serve(c, next);
  };
};
