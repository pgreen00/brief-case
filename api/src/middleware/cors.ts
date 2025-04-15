import { Middleware } from "koa";

const middleware: Middleware = (ctx, next) => {
  ctx.response.set('Access-Control-Allow-Origin', ctx.headers['origin'] ?? ctx.origin);
  ctx.response.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  ctx.response.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, If-None-Match, If-Modified-Since, If-Match, If-Unmodified-Since');
  ctx.response.set('Access-Control-Allow-Credentials', 'true');
  ctx.response.set('Access-Control-Max-Age', '600');
  ctx.response.set('Access-Control-Expose-Headers', 'ETag, Last-Modified')
  return next()
}

export default middleware;
