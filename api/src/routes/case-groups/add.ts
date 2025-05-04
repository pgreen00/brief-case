import { ParameterizedContext } from 'koa';
import db from '../../infrastructure/database.js';
import { Route } from '../router.js';
import authenticated from '../../middleware/authenticated.js';
import typia from 'typia';
import bodyValidator from '../../middleware/body-validator.js';

interface Dto {
	title: string
	businessId: number
	description: string | null
	groupRank: number | null
	parentId: number | null
}

async function handler (ctx: ParameterizedContext<{dto: Dto}>) {
  await db.tx(async (tx) => {
    ctx.body = await tx.one<{id:number}>(
      'INSERT INTO case_groups (title, business_id, description, group_rank, parent_id) VALUES (${title}, ${businessId}, ${description}, ${groupRank}, ${parentId}) RETURNING id',
      ctx.state.dto
    )
  })
}

const route: Route = {
  method: 'post',
  path: '/case_groups',
  middleware: [
    authenticated(),
    bodyValidator(body => typia.assert<Dto>(body)),
    handler
  ]
}

export default route
