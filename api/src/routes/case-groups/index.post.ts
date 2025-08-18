import { ParameterizedContext } from 'koa';
import db from '~/infrastructure/database.js';
import authorized from '~/middleware/authorized.js';
import sql from '~/infrastructure/sql.js';
import bodyValidator from '~/middleware/body-validator.js';
import z from 'zod';

const dto = z.object({
  title: z.string(),
  businessId: z.number().gt(0),
  description: z.string().nullable(),
  groupRank: z.number().nullable(),
  parentId: z.number().nullable()
}).or(z.array(z.object({
  title: z.string(),
  businessId: z.number().gt(0),
  description: z.string().nullable(),
  groupRank: z.number().nullable(),
  parentId: z.number().nullable()
})))

type Dto = ReturnType<typeof dto['parse']>

async function handler(ctx: ParameterizedContext<{ dto: Dto | Dto[] }>) {
  if (Array.isArray(ctx.state.dto)) {
    for (const dto of ctx.state.dto) {
      await db.one<{ id: number }>(sql(import.meta.url, `./insert-case-group.sql`), dto)
    }
    ctx.body = 'Bulk insert successful'
  } else {
    ctx.body = await db.one<{ id: number }>(sql(import.meta.url, `./insert-case-group.sql`), ctx.state.dto)
  }
}

export default [
  bodyValidator(body => dto.parse(body)),
  authorized('case_groups:write'),
  handler
]
