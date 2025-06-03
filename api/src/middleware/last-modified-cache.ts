import { Context, Middleware, Next } from 'koa'
import { RedisClient } from '../infrastructure/redis.js'

function lastModifiedCache(entity: string): Middleware {
  return async (ctx: Context, next: Next) => {
    using redis = new RedisClient()
    const ifModifiedSince = ctx.headers['if-modified-since']
    if (ifModifiedSince) {
      const lastModified = await redis.client.get(`last_modified:${entity}:${ctx['params'].id}`)
      if (lastModified === ifModifiedSince) {
        ctx.status = 304
        return
      }
    }
    await next()
    const lastModified = ctx.state['lastModified'] as Date | undefined
    if (lastModified) {
      ctx.set('Last-Modified', lastModified.toUTCString())
      ctx.set('Cache-Control', 'no-cache')
      await redis.client.set(`last_modified:${entity}:${ctx['params'].id}`, lastModified.toUTCString())
    }
  }
}

export default lastModifiedCache
