import Router from 'koa-router';
import { Middleware } from 'koa';
import { glob } from 'glob';
import { resolve } from 'path';
import { OpenAPIObject, OperationObject } from 'openapi3-ts/oas31';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { koaSwagger } from 'koa2-swagger-ui';

export type Route = {
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  path: string;
  middleware: Middleware[];
  openapi?: Partial<OperationObject>;
}

export const mapRoutes = async (modulePath: string, directory: string) => {
  const __filename = fileURLToPath(modulePath);
  const __dirname = dirname(__filename);
  const router = new Router();
  const spec: OpenAPIObject = {
    openapi: '3.1.0',
    info: { title: 'Brief-Case API', version: '0.1.0' },
    paths: {}
  };
  const files = glob.sync(`${join(__dirname, directory)}/**/*.js`);
  for (const file of files) {
    const absolutePath = resolve(file);
    const module = await import(absolutePath);
    const route = module.default as Route;
    if (route) {
      const { path, method, middleware, openapi } = route;
      if (path && method && middleware.length) {
        router[method](path, ...middleware);
        spec.paths![path] ??= {};
        spec.paths![path][method] = {
          summary: `${method.toUpperCase()} ${path}`,
          ...openapi
        };
      }
    }
  }
  router.get('/openapi.json', ctx => (ctx.body = spec));
  router.get('/docs', koaSwagger({ routePrefix: false, swaggerOptions: { spec: spec as any } }));
  return router;
}
