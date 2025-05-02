import { Context, Next, ParameterizedContext } from 'koa';
import db from '../../infrastructure/database.js';
import { Route } from '../../infrastructure/routes.js';

function guard(ctx: Context, next: Next) {
  ctx.assert(ctx.cookies.get('business_user_id', { signed: true }), 401, 'Unauthorized')
  return next()
}

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
  middleware: [guard, handler]
}

export default route
