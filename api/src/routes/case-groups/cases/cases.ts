import { ParameterizedContext } from 'koa';
import db from '../../../infrastructure/database.js';
import { Route } from '../../router.js';
import { Pool, spawn, Worker } from 'threads';
import { decryptDek } from '../../../infrastructure/kms.js';
import sql from '../../../infrastructure/sql.js';
import authorized from '../../../middleware/authorized.js';
import type { DecryptWorker } from './decrypt.worker.js';

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

const queryFile = sql(import.meta.url, `./get-cases-by-group.sql`)

const pool = Pool(
  () => spawn<DecryptWorker>(new Worker('./decrypt.worker.js')),
  { size: 4, maxQueuedJobs: 1000 }
);

async function handler(ctx: ParameterizedContext<{user: Schema.BusinessUser}>) {
  const caseGroupId = Number(ctx['params'].id)
  const businessId = ctx.state.user.business_id
  const query = await db.many<QueryResult>(queryFile, [caseGroupId, businessId])

  const decryptionPromises = query.map(async q => {
    const dek = await decryptDek(q.dek);
    const unencrypted = {
      email: q.email,
      first_name: q.first_name,
      last_name: q.last_name,
      middle_name: q.middle_name,
      phone: q.phone,
      iv: q.iv
    }
    return {
      case_group: {
        id: q.case_group_id,
        title: q.case_group_title,
        description: q.case_group_description
      },
      id: q.id,
      code: q.code,
      tags: q.tags,
      business_user: {
        id: q.business_user_id,
        ...await pool.queue(worker => worker.decryptUserInfo(unencrypted, dek))
      }
    };
  });

  ctx.body = await Promise.all(decryptionPromises);
}

const route: Route = {
  method: 'get',
  path: '/case_groups/:id/cases',
  middleware: [
    authorized(),
    handler
  ],
  openapi: {
    summary: 'Get cases by case group',
    tags: ['case_groups', 'cases'],
    responses: {
      200: { description: 'The cases' }
    },
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'number' },
      }
    ]
  }
}

export default route
