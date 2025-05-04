import { ParameterizedContext } from 'koa';
import db from '../../infrastructure/database.js';
import { Route } from '../router.js';
import typia, { tags } from 'typia';
import Encryptor from '../../infrastructure/encryptor/encryptor.js';
import Hasher from '../../infrastructure/hasher/hasher.js';
import { generateDek } from '../../infrastructure/kms.js';
import { getSecret } from '../../infrastructure/configuration.js';
import bodyValidator from '../../middleware/body-validator.js';

const hmacKey = await getSecret('SEARCH_HMAC_KEY');

interface Dto {
  email: string & tags.Format<'email'>
  password: string & tags.MinLength<8> & tags.MaxLength<64>
  businessId: number
  role?: Schema.Role
}

async function handler(ctx: ParameterizedContext<{dto: Dto}>) {
  const { email, password, businessId, role } = ctx.state.dto

  await using hasher = new Hasher();
  const hash = await hasher.hashPassword(password);
  const searchToken = await hasher.createHmac(email.toLowerCase().trim(), hmacKey!)

  const { plaintext, ciphertext } = await generateDek();
  await using encryptor = new Encryptor(plaintext);
  const [encryptedEmail, iv] = await encryptor.encrypt(email)

  await db.tx(async (tx) => {
    ctx.assert(await tx.any('SELECT 1 FROM businesses WHERE id = $1', [businessId]), 404, 'Business not found')
    const user = await tx.one<{id:number}>({
      text: 'INSERT INTO users (email, pw, dek, iv, search_token) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      values: [encryptedEmail, hash, ciphertext, iv, searchToken]
    })
    const businessUser = await tx.one<{id: string}>({
      text: 'INSERT INTO business_users (user_id, business_id, user_role) VALUES ($1, $2, $3) RETURNING id',
      values: [user.id, businessId, role || 'superuser']
    })
    ctx.body = { userId: user.id, businessUserId: businessUser.id }
  })
}

const route: Route = {
  method: 'post',
  path: '/users',
  middleware: [
    bodyValidator(body => typia.assert<Dto>(body)),
    handler
  ]
}

export default route
