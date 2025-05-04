import { Context, Middleware, Next } from 'koa'
import database from '../infrastructure/database.js'

function authenticated(setUser = false): Middleware {
  return async (ctx: Context, next: Next) => {
    const id = ctx.cookies.get('business_user_id', { signed: true })
    ctx.assert(id, 401, 'Unauthenticated')
    if (setUser) {
      const user = await database.one<Schema.BusinessUser>('SELECT * FROM business_users WHERE id = $1', id)
      ctx.assert(user, 401, 'Unauthenticated')
      ctx.state['user'] = user;
    }
    return next()
  }
}

export default authenticated
