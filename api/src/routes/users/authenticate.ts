import { Context, Next, ParameterizedContext } from 'koa';
import db from '../../infrastructure/database.js';
import { Route } from '../../infrastructure/routes.js';
import typia, { tags } from 'typia';
import Encryptor from '../../infrastructure/encryptor/encryptor.js';
import Hasher from '../../infrastructure/hasher/hasher.js';
import { getSecret } from '../../infrastructure/configuration.js';
import { decryptDek } from '../../infrastructure/kms.js';
import { hoursToMilliseconds } from 'date-fns';

const hmacKey = await getSecret('SEARCH_HMAC_KEY');

interface Dto {
  email: string & tags.Format<'email'>,
  password: string & tags.MinLength<8> & tags.MaxLength<64>
  businessId: number
}

function bodyValidator (ctx: Context, next: Next) {
  try {
    const body = ctx.request.body
    const dto = typia.assert<Dto>(body)
    ctx.state['dto'] = dto
  } catch (error) {
    ctx.throw(400, error as Error)
  }
  return next();
}

async function handler (ctx: ParameterizedContext<{dto: Dto}>) {
  const { email, password, businessId } = ctx.state.dto

  await using hasher = new Hasher();
  const searchToken = await hasher.createHmac(email.toLowerCase().trim(), hmacKey!)
  const user = await db.oneOrNone<{id:number,pw:string,dek:Buffer,iv:Buffer,email:Buffer}>('SELECT id, pw, dek, iv, email FROM users WHERE search_token = $1', searchToken)
  ctx.assert(user, 404, 'User not found')
  ctx.assert(await hasher.comparePassword(password, user.pw), 401, 'Invalid password')
  const key = await decryptDek(user.dek)
  await using encryptor = new Encryptor(key);
  const decryptedEmail = await encryptor.decrypt(user.email, user.iv)
  const businessUser = await db.oneOrNone<{id:string}>('SELECT id FROM business_users WHERE user_id = $1 AND business_id = $2', [user.id, businessId])
  ctx.assert(businessUser, 404, 'Business user not found')
  ctx.cookies.set('business_user_id', businessUser.id, { sameSite: 'strict', maxAge: hoursToMilliseconds(48), signed: true })
  ctx.body = { id: user.id, email: decryptedEmail }
}

const route: Route = {
  method: 'post',
  path: '/users/authenticate',
  middleware: [bodyValidator, handler]
}

export default route
