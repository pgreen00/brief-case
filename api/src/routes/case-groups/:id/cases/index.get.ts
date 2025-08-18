import { ParameterizedContext } from 'koa';
import { decrypt } from '~/infrastructure/crypto.js';
import db from '~/infrastructure/database.js';
import { decryptDek } from '~/infrastructure/kms.js';
import sql from '~/infrastructure/sql.js';
import authorized from '~/middleware/authorized.js';

type QueryResult = {
  id: number
  business_user_id: number
  case_group_id: number
  case_group_title: string
  case_group_description: string | null
  case_group_parent_id: number | null
  tags: string[]
  code: string
  dek: Buffer
  first_name: string | null
  last_name: string | null
  middle_name: string | null
  email: string
  phone: string | null
}

const queryFile = sql(import.meta.url, `./get-cases-by-group.sql`)

async function handler(ctx: ParameterizedContext<{ user: Schema.BusinessUser }>) {
  const caseGroupId = Number(ctx['params'].id)
  const businessId = ctx.state.user.business_id
  const query = await db.many<QueryResult>(queryFile, [caseGroupId, businessId])

  const decryptionPromises = query.map(async q => {
    const dek = await decryptDek(q.dek);
    return {
      case_group: {
        id: q.case_group_id,
        title: q.case_group_title,
        description: q.case_group_description
      },
      id: q.id,
      code: q.code,
      tags: q.tags,
      business_user: {
        id: q.business_user_id,
        email: await decrypt(dek, q.email),
        first_name: q.first_name ? await decrypt(dek, q.first_name) : null,
        last_name: q.last_name ? await decrypt(dek, q.last_name) : null,
        middle_name: q.middle_name ? await decrypt(dek, q.middle_name) : null,
        phone: q.phone ? await decrypt(dek, q.phone) : null,
      }
    };
  });

  ctx.body = await Promise.all(decryptionPromises);
}

export default [
  authorized(),
  handler
]
