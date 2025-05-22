import { ParameterizedContext } from 'koa';
import db from '../../../infrastructure/database.js';
import { Route } from '../../router.js';
import Encryptor from '../../../infrastructure/encryptor/encryptor.js';
import { decryptDek } from '../../../infrastructure/kms.js';
import sql from '../../../infrastructure/sql.js';
import authorized from '../../../middleware/authorized.js';

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
  iv: Buffer
  first_name: Buffer | null
  last_name: Buffer | null
  middle_name: Buffer | null
  email: Buffer
  phone: Buffer | null
}

async function handler(ctx: ParameterizedContext<{user: Schema.BusinessUser}>) {
  const caseGroupId = Number(ctx['params'].id)
  const businessId = ctx.state.user.business_id
  const query = await db.many<QueryResult>(sql(import.meta.url, `./get-cases-by-group.sql`), [caseGroupId, businessId])

  await using encryptor = new Encryptor();
  const res = []
  for (const q of query) {
    console.log(q.iv)
    await encryptor.setKey(await decryptDek(q.dek))
    res.push({
      id: q.id,
      business_user_id: q.business_user_id,
      case_group_id: q.case_group_id,
      case_group_title: q.case_group_title,
      case_group_description: q.case_group_description,
      case_group_parent_id: q.case_group_parent_id,
      tags: q.tags,
      code: q.code,
      userInfo: {
        email: await encryptor.decrypt(q.email, q.iv),
        first_name: q.first_name ? await encryptor.decrypt(q.first_name, q.iv) : null,
        last_name: q.last_name ? await encryptor.decrypt(q.last_name, q.iv) : null,
        middle_name: q.middle_name ? await encryptor.decrypt(q.middle_name, q.iv) : null,
        phone: q.phone ? await encryptor.decrypt(q.phone, q.iv) : null,
      }
    })
  }
  ctx.body = res
}

const route: Route = {
  method: 'get',
  path: '/cases/by_group/:id',
  middleware: [
    authorized(),
    handler
  ]
}

export default route
