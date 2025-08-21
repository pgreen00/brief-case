import pgPromise from 'pg-promise';
import { getSecret } from './configuration.js';

const pgp = pgPromise();

export default pgp({
  user: await getSecret('DB_USER'),
  host: await getSecret('DB_HOST'),
  database: await getSecret('DB_NAME'),
  password: (await getSecret('DB_PASSWORD')) || '',
  port: Number(await getSecret('DB_PORT'))
});
