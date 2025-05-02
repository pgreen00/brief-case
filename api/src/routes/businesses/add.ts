import { Context, Next, ParameterizedContext } from 'koa';
import db from '../../infrastructure/database.js';
import { Route } from '../../infrastructure/routes.js';
import typia from 'typia';

interface Dto {
  name: string,
  displayName: string
}

function bodyValidator (ctx: Context, next: Next) {
  try {
    const body = ctx.request.body
    const dto = typia.assert<Dto>(body)
    ctx.state['dto'] = dto
  } catch (error) {
    ctx.throw(400, error as Error)
  }
  return next();
}

async function handler (ctx: ParameterizedContext<{dto: Dto}>) {
  await db.tx(async (tx) => {
    ctx.body = await tx.one<{id:number}>(
      'INSERT INTO businesses (business_name, display_name) VALUES (${name}, ${displayName}) RETURNING id',
      ctx.state.dto
    )
  })
}

const route: Route = {
  method: 'post',
  path: '/businesses',
  middleware: [bodyValidator, handler]
}

export default route
