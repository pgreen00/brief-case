import { hoursToMilliseconds } from 'date-fns'
import { Context, Next } from 'koa'

async function authenticated(ctx: Context, next: Next) {
  const id = ctx.cookies.get('business_user_id', { signed: true })
  ctx.assert(id, 401)
  await next()
  ctx.cookies.set('business_user_id', id, { sameSite: 'strict', maxAge: hoursToMilliseconds(48), signed: true })
}

export default authenticated
