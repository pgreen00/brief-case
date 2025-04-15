import Router from 'koa-router';
import { Middleware } from 'koa';
import { glob } from 'glob';
import { resolve } from 'path';

export type Route = {
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  path: string;
  middleware: Middleware[]
}

export const mapRoutes = async (directory: string) => {
  const router = new Router();
  const files = glob.sync(`${directory}/**/*.js`);
  for (const file of files) {
    const absolutePath = resolve(file);
    const module = await import(absolutePath);
    const route = module.default as Route;
    if (route) {
      const { path, method, middleware } = route;
      if (path && method && middleware.length) {
        router[method](path, ...middleware);
      }
    }
  }
  return router;
}
