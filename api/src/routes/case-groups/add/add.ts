import { ParameterizedContext } from 'koa';
import db from '../../../infrastructure/database.js';
import { Route } from '../../router.js';
import typia from 'typia';
import bodyValidator from '../../../middleware/body-validator.js';
import authorized from '../../../middleware/authorized.js';
import sql from '../../../infrastructure/sql.js';

interface Dto {
	title: string
	businessId: number
	description: string | null
	groupRank: number | null
	parentId: number | null
}

async function handler(ctx: ParameterizedContext<{dto: Dto | Dto[]}>) {
  if (Array.isArray(ctx.state.dto)) {
    for (const dto of ctx.state.dto) {
      await db.one<{id:number}>(sql(import.meta.url, `./insert-case-group.sql`), dto)
    }
    ctx.body = 'Bulk insert successful'
  } else {
    ctx.body = await db.one<{id:number}>(sql(import.meta.url, `./insert-case-group.sql`), ctx.state.dto)
  }
}

const route: Route = {
  method: 'post',
  path: '/case_groups',
  middleware: [
    authorized('case_groups:write'),
    bodyValidator(body => typia.assert<Dto | Dto[]>(body)),
    handler
  ],
  openapi: {
    summary: 'Add a case group',
    tags: ['case_groups'],
    requestBody: {
      content: {
        'application/json': {
          schema: {}
        }
      }
    }
  }
}

export default route
