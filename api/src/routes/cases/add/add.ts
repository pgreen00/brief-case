import { ParameterizedContext } from 'koa';
import db from '../../../infrastructure/database.js';
import { Route } from '../../router.js';
import typia from 'typia';
import bodyValidator from '../../../middleware/body-validator.js';
import authorized from '../../../middleware/authorized.js';
import sql from '../../../infrastructure/sql.js';
import { getSecret } from '../../../infrastructure/configuration.js';
import { decryptDek, generateDek } from '../../../infrastructure/kms.js';
import Encryptor from '../../../infrastructure/encryptor/encryptor.js';
import Hasher from '../../../infrastructure/hasher/hasher.js';
import { ITask } from 'pg-promise';

const hmacKey = await getSecret('SEARCH_HMAC_KEY');

interface Dto {
  intake: Schema.Intake
  client: string | {
    firstName: string
    lastName: string
    middleName: string | null
    dob: string
    gender: string | null
    phone: string
    altPhone: string | null
    email: string
    altContact: string
    altContactPhone: string
    ssn: string
  }
  caseGroup: number
};

async function createUser(tx: ITask<{}>, info: Dto['client'], businessId: number) {
  if (typeof info === 'string') {
    const res = await tx.one('select dek, iv from users u join business_users bu on bu.user_id = u.id where bu.id = $1', info)
    return { id: info, dek: await decryptDek(res.dek), iv: res.iv }
  } else {
    const { firstName, lastName, middleName, dob, gender, phone, email, altContact, altContactPhone, ssn, altPhone } = info
    await using hasher = new Hasher();
    const searchToken = await hasher.createHmac(email.toLowerCase().trim(), hmacKey!)
    const { plaintext, ciphertext } = await generateDek();
    await using encryptor = new Encryptor(plaintext);
    const [encryptedEmail, iv] = await encryptor.encrypt(email)
    const [encryptedPhone] = await encryptor.encrypt(phone, iv)
    const [encryptedAltContact] = await encryptor.encrypt(altContact, iv)
    const [encryptedAltContactPhone] = await encryptor.encrypt(altContactPhone, iv)
    const [encryptedSsn] = await encryptor.encrypt(ssn, iv)
    const [encryptedFirstName] = await encryptor.encrypt(firstName, iv)
    const [encryptedLastName] = await encryptor.encrypt(lastName, iv)
    const [encryptedMiddleName] = middleName ? await encryptor.encrypt(middleName, iv) : [null]
    const [encryptedDob] = await encryptor.encrypt(dob, iv)
    const [encryptedGender] = gender ? await encryptor.encrypt(gender, iv) : [null]
    const [encryptedAltPhone] = altPhone ? await encryptor.encrypt(altPhone, iv) : [null]
    const userId = await tx.one<{id:number}>(sql(import.meta.url, `./insert-client.sql`), {
      encryptedEmail,
      searchToken,
      encryptedPhone,
      encryptedAltContact,
      encryptedAltContactPhone,
      encryptedSsn,
      encryptedFirstName,
      encryptedLastName,
      encryptedMiddleName,
      encryptedDob,
      encryptedGender,
      encryptedAltPhone,
      iv,
      ciphertext
    })
    const businessUser = await tx.one<{id: string}>({
      text: 'INSERT INTO business_users (user_id, business_id, user_role) VALUES ($1, $2, $3) RETURNING id',
      values: [userId.id, businessId, 'client']
    })
    return { id: businessUser.id, dek: plaintext, iv }
  }
}

async function handler(ctx: ParameterizedContext<{dto: Dto, user: Schema.BusinessUser}>) {
  const { intake, client, caseGroup } = ctx.state.dto
  const { business_id, user_id } = ctx.state.user
  await db.tx(async tx => {
    const { id, dek, iv } = await createUser(tx, client, business_id)
    await using encryptor = new Encryptor(dek);
    const [encryptedIntake] = await encryptor.encrypt(JSON.stringify(intake), iv)
    const res = await tx.one<{id: number}>(sql(import.meta.url, `./insert-case.sql`), {
      intake: encryptedIntake,
      caseGroup,
      clientId: id,
      userId: user_id
    })
    ctx.status = 201
    ctx.body = res
  })
}

const route: Route = {
  method: 'post',
  path: '/cases',
  middleware: [
    authorized('cases:write'),
    bodyValidator(body => typia.assert<Dto>(body)),
    handler
  ]
}

export default route
