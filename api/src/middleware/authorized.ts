import { Middleware, Next, ParameterizedContext } from 'koa'
import database from '../infrastructure/database.js'

function authorized(...rights: Schema.Right[]): Middleware {
  return async (ctx: ParameterizedContext<{ user: Schema.BusinessUser | undefined }>, next: Next) => {
    const id = ctx.cookies.get('business_user_id', { signed: true })
    ctx.assert(id, 401, 'Unauthenticated')
    ctx.state.user ??= await database.one<Schema.BusinessUser>('SELECT * FROM business_users WHERE id = $1', id);
    ctx.assert(
      ctx.state.user.user_role == 'superuser'
      ||
      rights.every(right => ctx.state.user?.rights.includes(right)
    ), 403, 'Unauthorized')
    return next()
  }
}

export default authorized
