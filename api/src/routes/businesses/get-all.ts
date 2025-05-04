import { ParameterizedContext } from 'koa';
import db from '../../infrastructure/database.js';
import { Route } from '../router.js';

async function handler(ctx: ParameterizedContext) {
  const select = ctx.query['select']
  ctx.body = await db.many(
    'select ${columns~} from businesses',
    { columns: Array.isArray(select) ? select : select?.split(',') || '*' }
  )
}

const route: Route = {
  method: 'get',
  path: '/businesses',
  middleware: [handler]
}

export default route
