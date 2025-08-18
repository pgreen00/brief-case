import Router from '@koa/router';
import { glob } from 'glob';
import { Middleware } from 'koa';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

export type Route = Middleware | Middleware[];

function parseMethod(path: string) {
  if (path.includes('.get.')) {
    return 'get';
  } else if (path.includes('.post.')) {
    return 'post';
  } else if (path.includes('.put.')) {
    return 'put';
  } else if (path.includes('.delete.')) {
    return 'delete';
  } else if (path.includes('.patch.')) {
    return 'patch';
  } else {
    throw new Error(`Invalid route method in ${path}`);
  }
}

function parsePath(path: string) {
  return path.split('/routes')[1].replace(new RegExp('/index\\.(get|post|put|delete|patch)\\.(js|ts)$'), '')
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = new Router();

const files = glob.sync(`${__dirname}/routes/**/index.{get,post,put,delete,patch}.{js,ts}`);
for (const file of files) {
  const method = parseMethod(file)
  const path = parsePath(file)
  const module = (await import(file)).default;
  if (Array.isArray(module)) {
    router[method](path, ...module);
  } else {
    router[method](path, module);
  }
}

export default router;
