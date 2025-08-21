import Koa from 'koa';
import ratelimit from 'koa-ratelimit';
import compress from 'koa-compress';
import zlib from 'zlib';
import cors from './middleware/cors.js';
import { getSecret } from './infrastructure/configuration.js';
import bodyParser from '@koa/bodyparser';
import createRouter from './router.js';

async function app() {
  const router = await createRouter();
  const cookieKey = await getSecret('COOKIE_KEY');
  const app = new Koa({
    keys: [cookieKey!]
  });

  app
    .use(cors)
    .use(ratelimit({ //needs to use redis
      driver: 'memory',
      db: new Map(),
      duration: 54000, //15 minutes
      max: 100,
      id: (ctx) => ctx.ip,
    }))
    .use(compress({
      threshold: 2048,
      gzip: {
        flush: zlib.constants.Z_SYNC_FLUSH
      },
      deflate: false,
      br: false
    }))
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods());

  return app
}

export default app
