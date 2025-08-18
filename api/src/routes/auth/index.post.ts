import { ParameterizedContext } from 'koa';
import db from '~/infrastructure/database.js';
import { getSecret } from '~/infrastructure/configuration.js';
import { hoursToMilliseconds } from 'date-fns';
import * as z from 'zod';
import bodyValidator from '~/middleware/body-validator.js';
import { generateHmac } from '~/infrastructure/crypto.js';
import { compare } from 'bcrypt';

const dto = z.object({
  email: z.email(),
  password: z.string().min(8).max(64),
  businessId: z.number().gt(0)
})

type Dto = ReturnType<typeof dto['parse']>

async function handler(ctx: ParameterizedContext<{ dto: Dto }>) {
  const { email, password, businessId } = ctx.state.dto

  const hmacKey = await getSecret('SEARCH_HMAC_KEY');
  const searchToken = generateHmac(email.toLowerCase().trim(), hmacKey!)

  const user = await db.oneOrNone<{ id: number, pw: string }>('SELECT id, pw FROM users WHERE search_token = $1', searchToken)
  ctx.assert(user, 404, 'User not found')
  ctx.assert(await compare(password, user.pw), 401, 'Invalid password')

  const businessUser = await db.oneOrNone<{ id: string }>('SELECT id FROM business_users WHERE user_id = $1 AND business_id = $2', [user.id, businessId])
  ctx.assert(businessUser, 404, 'Business user not found')
  ctx.cookies.set('business_user_id', businessUser.id, { sameSite: 'strict', maxAge: hoursToMilliseconds(48), signed: true })
  ctx.status = 204
}

export default [
  bodyValidator(body => dto.parse(body)),
  handler
]
