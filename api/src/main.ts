import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import ratelimit from 'koa-ratelimit';
import compress from 'koa-compress';
import zlib from 'zlib';
import logger from 'koa-logger';
import cors from './middleware/cors.js';
import { mapRoutes } from './routes/router.js';
import { getSecret, isproduction } from './infrastructure/configuration.js';
import { createServer } from 'http';
import KeyGrip from 'keygrip';
//import open from 'open';

const app = new Koa();
const router = await mapRoutes(import.meta.url, `./routes`);
app.keys = new KeyGrip([(await getSecret('COOKIE_KEY'))!], 'sha256');

if (!isproduction) {
  app.use(logger());
}

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

const server = createServer(app.callback());
const port = await getSecret('API_PORT') || 3000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  if (!isproduction) {
    //open(`http://localhost:${port}/docs`);
  }
});
