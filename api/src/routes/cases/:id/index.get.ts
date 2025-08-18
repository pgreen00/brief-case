import { ParameterizedContext } from 'koa';
import db from '~/infrastructure/database.js';
import authenticated from '~/middleware/authenticated.js';
import { decryptDek } from '~/infrastructure/kms.js';
import lastModifiedCache from '~/middleware/last-modified-cache.js';
import { decrypt } from '~/infrastructure/crypto.js';

type ClientQueryResult = {
  first_name: string | null
  last_name: string | null
  middle_name: string | null
  email: string
  phone: string | null
  gender: string | null
  dob: string | null
  alt_phone: string | null
  alt_contact: string | null
  alt_contact_phone: string | null
}

async function handler(ctx: ParameterizedContext) {
  const caseId = Number(ctx['params'].id)
  const caseQuery = `
    select c.*, b.dek
    from cases c
    join business_users bu on bu.id = c.business_user_id
    join businesses b on b.id = bu.business_id
    where c.id = $1
  `
  const res = await db.oneOrNone<Schema.Case & {dek: Buffer}>(caseQuery, caseId)
  ctx.assert(res, 404, 'Case not found')
  const clientQuery = `
    select u.first_name, u.last_name, u.middle_name, u.email, u.phone, u.gender, u.dob, u.alt_phone, u.alt_contact, u.alt_contact_phone
    from users u join business_users bu on bu.user_id = u.id
    where bu.id = $1
  `
  const client = await db.one<ClientQueryResult>(clientQuery, res.business_user_id)
  const key = await decryptDek(res.dek)
  ctx.body = {
    ...res,
    intake: JSON.parse(await decrypt(key, res.intake)),
    userInfo: {
      email: await decrypt(key, client.email),
      first_name: client.first_name ? await decrypt(key, client.first_name) : null,
      last_name: client.last_name ? await decrypt(key, client.last_name) : null,
      middle_name: client.middle_name ? await decrypt(key, client.middle_name) : null,
      phone: client.phone ? await decrypt(key, client.phone) : null,
      dob: client.dob ? await decrypt(key, client.dob) : null,
      alt_phone: client.alt_phone ? await decrypt(key, client.alt_phone) : null,
      alt_contact: client.alt_contact ? await decrypt(key, client.alt_contact) : null,
      alt_contact_phone: client.alt_contact_phone ? await decrypt(key, client.alt_contact_phone) : null
    }
  }
  ctx.state['lastModified'] = res.last_modified
}

export default [
  authenticated,
  lastModifiedCache('cases'),
  handler
]
