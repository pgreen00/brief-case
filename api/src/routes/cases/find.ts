import { ParameterizedContext } from 'koa';
import db from '../../infrastructure/database.js';
import { Route } from '../router.js';
import authenticated from '../../middleware/authenticated.js';
import Encryptor from '../../infrastructure/encryptor/encryptor.js';
import { decryptDek } from '../../infrastructure/kms.js';
import lastModifiedCache from '../../middleware/last-modified-cache.js';

type ClientQueryResult = {
  dek: Buffer
  iv: Buffer
  first_name: Buffer | null
  last_name: Buffer | null
  middle_name: Buffer | null
  email: Buffer
  phone: Buffer | null
  gender: Buffer | null
  dob: Buffer | null
  alt_phone: Buffer | null
  alt_contact: Buffer | null
  alt_contact_phone: Buffer | null
}

async function handler(ctx: ParameterizedContext) {
  const caseId = Number(ctx['params'].id)
  const caseQuery = `
    select id, business_user_id, case_group_id, tags, code, last_modified, intake
    from cases where id = $1
  `
  const res = await db.oneOrNone<Schema.Case>(caseQuery, caseId)
  ctx.assert(res, 404, 'Case not found')

  const clientQuery = `
    select dek, iv, first_name, last_name, middle_name, email, phone, gender, dob, alt_phone, alt_contact, alt_contact_phone
    from users u join business_users bu on bu.user_id = u.id
    where bu.id = $1
  `
  const client = await db.one<ClientQueryResult>(clientQuery, res.business_user_id)
  await using encryptor = new Encryptor(await decryptDek(client.dek));
  ctx.body = {
    ...res,
    intake: JSON.parse(await encryptor.decrypt(res.intake, client.iv)),
    userInfo: {
      email: await encryptor.decrypt(client.email, client.iv),
      first_name: client.first_name ? await encryptor.decrypt(client.first_name, client.iv) : null,
      last_name: client.last_name ? await encryptor.decrypt(client.last_name, client.iv) : null,
      middle_name: client.middle_name ? await encryptor.decrypt(client.middle_name, client.iv) : null,
      phone: client.phone ? await encryptor.decrypt(client.phone, client.iv) : null,
      dob: client.dob ? await encryptor.decrypt(client.dob, client.iv) : null,
      alt_phone: client.alt_phone ? await encryptor.decrypt(client.alt_phone, client.iv) : null,
      alt_contact: client.alt_contact ? await encryptor.decrypt(client.alt_contact, client.iv) : null,
      alt_contact_phone: client.alt_contact_phone ? await encryptor.decrypt(client.alt_contact_phone, client.iv) : null
    }
  }
  ctx.state['lastModified'] = res.last_modified
}

const route: Route = {
  method: 'get',
  path: '/cases/:id',
  middleware: [
    authenticated,
    handler,
    lastModifiedCache
  ]
}

export default route
