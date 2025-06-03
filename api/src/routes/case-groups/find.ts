import { ParameterizedContext } from 'koa';
import db from '../../infrastructure/database.js';
import { Route } from '../router.js';
import authenticated from '../../middleware/authenticated.js';
import lastModifiedCache from '../../middleware/last-modified-cache.js';

async function handler(ctx: ParameterizedContext) {
  const select = ctx.query['select']
  const text = 'select ${columns~} from case_groups where id=${id}'
  const values = {
    columns: Array.isArray(select) ? select : select?.split(',') || '*',
    id: ctx['params'].id
  }
  const res = await db.oneOrNone(text, values)
  ctx.assert(res, 404, 'Case group not found')
  if ('last_modified' in res) {
    ctx.state['lastModified'] = res.last_modified
  }
  ctx.body = res
}

const route: Route = {
  method: 'get',
  path: '/case_groups/:id',
  middleware: [
    authenticated,
    lastModifiedCache('case_groups'),
    handler
  ],
  openapi: {
    summary: 'Find a Case Group',
    tags: ['case_groups'],
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'number' }
      }
    ],
    responses: {
      200: { description: 'The case group' }
    }
  }
}

export default route
