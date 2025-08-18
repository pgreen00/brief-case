import { ParameterizedContext } from 'koa';
import db from '~/infrastructure/database.js';
import authorized from '~/middleware/authorized.js';
import sql from '~/infrastructure/sql.js';
import { getSecret } from '~/infrastructure/configuration.js';
import { decryptDek } from '~/infrastructure/kms.js';
import { ITask } from 'pg-promise';
import { encrypt, generateHmac } from '~/infrastructure/crypto.js';

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
  const {dek: ciphertext} = await db.one<{dek: Buffer}>('select dek from businesses where id = $1', businessId)
  if (typeof info === 'string') {
    return { id: info, dek: ciphertext }
  } else {
    const hmacKey = await getSecret('SEARCH_HMAC_KEY');
    const { firstName, lastName, middleName, dob, gender, phone, email, altContact, altContactPhone, ssn, altPhone } = info
    const searchToken = generateHmac(email.toLowerCase().trim(), hmacKey!)
    const plaintext = await decryptDek(ciphertext)
    const encryptedEmail = await encrypt(plaintext, email)
    const encryptedPhone = await encrypt(plaintext, phone)
    const encryptedAltContact = await encrypt(plaintext, altContact)
    const encryptedAltContactPhone = await encrypt(plaintext, altContactPhone)
    const encryptedSsn = await encrypt(plaintext, ssn)
    const encryptedFirstName = await encrypt(plaintext, firstName)
    const encryptedLastName = await encrypt(plaintext, lastName)
    const encryptedMiddleName = middleName ? await encrypt(plaintext, middleName) : [null]
    const encryptedDob = await encrypt(plaintext, dob)
    const encryptedGender = gender ? await encrypt(plaintext, gender) : [null]
    const encryptedAltPhone = altPhone ? await encrypt(plaintext, altPhone) : [null]
    const userId = await tx.one<{ id: number }>({
      text: sql(import.meta.url, `./insert-client.sql`),
      values: [
        encryptedEmail,
        searchToken,
        encryptedPhone,
        encryptedAltPhone,
        encryptedAltContact,
        encryptedAltContactPhone,
        encryptedFirstName,
        encryptedLastName,
        encryptedMiddleName,
        encryptedDob,
        encryptedSsn,
        encryptedGender,
      ]
    })
    const businessUser = await tx.one<{ id: string }>({
      text: 'INSERT INTO business_users (user_id, business_id, user_role) VALUES ($1, $2, $3) RETURNING id',
      values: [userId.id, businessId, 'client']
    })
    return { id: businessUser.id, dek: plaintext }
  }
}

async function handler(ctx: ParameterizedContext<{ user: Schema.BusinessUser }>) {
  const { intake, client, caseGroup } = ctx.body as Dto
  const { business_id, user_id } = ctx.state.user
  await db.tx(async tx => {
    const { id, dek } = await createUser(tx, client, business_id)
    const encryptedIntake = await encrypt(dek, JSON.stringify(intake))
    const res = await tx.one<{ id: number }>(sql(import.meta.url, `./insert-case.sql`), {
      intake: encryptedIntake,
      caseGroup,
      clientId: id,
      userId: user_id
    })
    ctx.status = 201
    ctx.body = res
  })
}

export default [
  authorized('cases:write'),
  handler
]
