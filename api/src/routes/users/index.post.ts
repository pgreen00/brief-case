import { ParameterizedContext } from 'koa';
import db from '~/infrastructure/database.js';
import { decryptDek } from '~/infrastructure/kms.js';
import { getSecret } from '~/infrastructure/configuration.js';
import * as z from 'zod';
import bodyValidator from '~/middleware/body-validator.js';
import { hash } from 'bcrypt';
import { encrypt, generateHmac } from '~/infrastructure/crypto.js';

const bcryptSaltRounds = 12;

const dto = z.object({
  email: z.email(),
  password: z.string().min(8).max(64),
  businessId: z.number().gt(0),
  role: z.string().optional()
})

type Dto = ReturnType<typeof dto['parse']>

async function handler(ctx: ParameterizedContext<{ dto: Dto }>) {
  const { email, password, businessId, role } = ctx.state.dto

  const hmacKey = await getSecret('SEARCH_HMAC_KEY');
  const searchToken = generateHmac(email.toLowerCase().trim(), hmacKey!)

  const h = await hash(password, bcryptSaltRounds);
  const { dek } = await db.one<{ dek: Buffer }>('SELECT dek FROM businesses WHERE id = $1', [businessId])
  const plaintext = await decryptDek(dek);
  const encryptedEmail = await encrypt(plaintext, email)

  await db.tx(async (tx) => {
    const user = await tx.one<{ id: number }>({
      text: 'INSERT INTO users (email, pw, search_token) VALUES ($1, $2, $3) RETURNING id',
      values: [encryptedEmail, h, searchToken]
    })
    const businessUser = await tx.one<{ id: string }>({
      text: 'INSERT INTO business_users (user_id, business_id, user_role) VALUES ($1, $2, $3) RETURNING id',
      values: [user.id, businessId, role || 'superuser']
    })
    ctx.body = { userId: user.id, businessUserId: businessUser.id }
  })
}

export default [
  bodyValidator(body => dto.parse(body)),
  handler
]
