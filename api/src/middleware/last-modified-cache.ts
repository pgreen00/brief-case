import { Context, Next } from 'koa'

async function lastModifiedCache(ctx: Context, next: Next) {
  const lastModified = ctx.state['lastModified'] as Date | undefined
  if (lastModified) {
    ctx.set('Last-Modified', lastModified.toUTCString())
    ctx.set('Cache-Control', 'no-cache')
  }
}

export default lastModifiedCache
