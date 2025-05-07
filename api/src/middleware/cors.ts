import { Middleware } from "koa";

const middleware: Middleware = async (ctx, next) => {
  try {
    ctx.set('Access-Control-Allow-Origin', ctx.origin);
    ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, If-None-Match, If-Modified-Since, If-Match, If-Unmodified-Since');
    ctx.set('Access-Control-Allow-Credentials', 'true');
    ctx.set('Access-Control-Max-Age', '600');
    ctx.set('Access-Control-Expose-Headers', 'ETag, Last-Modified')
    if (ctx.method === 'OPTIONS') {
      ctx.status = 204;
    } else {
      await next();
    }
  } catch(err: any) {
    err.headers = {
      ...err.headers,
      'Access-Control-Allow-Origin': ctx.origin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, If-None-Match, If-Modified-Since, If-Match, If-Unmodified-Since',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '600',
      'Access-Control-Expose-Headers': 'ETag, Last-Modified'
    }
    throw err
  }
}

export default middleware;
