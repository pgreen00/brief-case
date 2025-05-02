import pgPromise from 'pg-promise';

const pgp = pgPromise();

export default pgp({
  user: 'psg',
  host: 'localhost',
  database: 'brief_case',
  password: '',
  port: 5432
});
