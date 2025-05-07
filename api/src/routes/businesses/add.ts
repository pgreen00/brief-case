import { ParameterizedContext } from 'koa';
import db from '../../infrastructure/database.js';
import { Route } from '../router.js';
import typia from 'typia';
import bodyValidator from '../../middleware/body-validator.js';

interface Dto {
  name: string,
  displayName: string
}

async function handler(ctx: ParameterizedContext<{dto: Dto}>) {
  ctx.body = await db.one<{id:number}>(
    'INSERT INTO businesses (business_name, display_name) VALUES (${name}, ${displayName}) RETURNING id',
    ctx.state.dto
  )
}

const route: Route = {
  method: 'post',
  path: '/businesses',
  middleware: [
    bodyValidator(body => typia.assert<Dto>(body)),
    handler
  ]
}

export default route
