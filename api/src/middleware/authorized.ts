import { Middleware, Next, Context } from 'koa'
import database from '../infrastructure/database.js'
import { hoursToMilliseconds } from 'date-fns'

function authorized(...rights: Schema.Right[]): Middleware {
  return async (ctx: Context, next: Next) => {
    const id = ctx.cookies.get('business_user_id', { signed: true })
    ctx.assert(id, 401)
    const user = await database.one<Schema.BusinessUser>('SELECT * FROM business_users WHERE id = $1', id)
    ctx.assert(user.user_role == 'superuser' || rights.every(right => user.rights.includes(right)), 403)
    ctx.state['user'] = user
    await next()
    ctx.cookies.set('business_user_id', id, { sameSite: 'strict', maxAge: hoursToMilliseconds(48), signed: true })
  }
}

export default authorized
