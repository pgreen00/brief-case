import Koa from 'koa';
import ratelimit from 'koa-ratelimit';
import compress from 'koa-compress';
import zlib from 'zlib';
import cors from './middleware/cors.js';
import { getSecret } from './infrastructure/configuration.js';
import { createSecureServer } from 'http2';
import bodyParser from '@koa/bodyparser';
import router from './router.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = createSecureServer({
  key: readFileSync(join(__dirname, 'localhost.key.pem')),
  cert: readFileSync(join(__dirname, 'localhost.crt.pem')),
  passphrase: '032800'
}, app.callback());
server.listen(443, () => {
  console.log(`Server running at https://localhost`);
});
