import { ParameterizedContext } from 'koa';
import { generateDek } from '~/infrastructure/kms.js';
import db from '~/infrastructure/database.js';
import bodyValidator from '~/middleware/body-validator.js';
import z from 'zod';

const dto = z.object({
  name: z.string(),
  displayName: z.string()
})

type Dto = ReturnType<typeof dto['parse']>

async function handler(ctx: ParameterizedContext<{dto: Dto}>) {
  const { ciphertext } = await generateDek();
  ctx.body = await db.one<{id:number}>(
    'INSERT INTO businesses (business_name, display_name, dek) VALUES (${name}, ${displayName}, ${dek}) RETURNING id',
    { ...ctx.state.dto, dek: ciphertext }
  )
}

export default [
  bodyValidator(body => dto.parse(body)),
  handler
]
