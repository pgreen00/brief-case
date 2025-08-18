import { ParameterizedContext } from 'koa';
import db from '~/infrastructure/database.js';
import authenticated from '~/middleware/authenticated.js';

async function handler(ctx: ParameterizedContext) {
  const caseId = Number(ctx['params'].id)
  const caseQuery = `
    select * from case_files where case_id = $1
  `
  const res = await db.manyOrNone<Schema.CaseFile>(caseQuery, caseId)
  ctx.body = res
}

export default [
  authenticated,
  handler
]
