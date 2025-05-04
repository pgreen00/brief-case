import { Middleware } from 'koa'

function bodyValidator<T>(callback: (body: any) => T): Middleware {
  return (ctx, next) => {
    try {
      const body = ctx.request.body
      const dto = callback(body)
      ctx.state['dto'] = dto
    } catch (error) {
      ctx.throw(400, error as Error)
    }
    return next();
  }
}

export default bodyValidator
