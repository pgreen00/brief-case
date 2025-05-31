import { ParameterizedContext } from 'koa';
import db from '../../infrastructure/database.js';
import { Route } from '../router.js';
import authenticated from '../../middleware/authenticated.js';

async function handler(ctx: ParameterizedContext) {
  const select = ctx.query['select']
  const res = await db.oneOrNone(
    'select ${columns~} from businesses where id=${id}',
    { columns: Array.isArray(select) ? select : select?.split(',') || '*', id: ctx['params'].id }
  )
  ctx.assert(res, 404, 'Business not found')
  ctx.body = res
}

const route: Route = {
  method: 'get',
  path: '/businesses/:id',
  middleware: [
    authenticated,
    handler
  ],
  openapi: {
    summary: 'Find a business',
    tags: ['businesses'],
    responses: {
      200: { description: 'The business' }
    }
  }
}

export default route
