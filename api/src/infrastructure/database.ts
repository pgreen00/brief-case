import { BehaviorSubject, filter, lastValueFrom } from 'rxjs';
import pg, { PoolClient, QueryConfig, QueryResultRow } from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: 'psg',
  host: 'localhost',
  database: 'grind_session',
  password: '',
  port: 5432
});

type TransactionCallback = (client: PoolClient) => Promise<void>;

export default class Database {
  private start = Date.now();
  private connected$ = new BehaviorSubject<PoolClient | false | null>(null);
  private onConnected = async () => {
    const result = await lastValueFrom(this.connected$.pipe(
      filter(value => value !== null)
    ));
    if (result) {
      return Promise.resolve(result);
    } else {
      return Promise.reject('Failed to connect to the database');
    }
  }

  constructor() {
    pool.connect()
      .then(client => {
        this.connected$.next(client);
        console.log('Connected to the database');
      })
      .catch(err => {
        this.connected$.next(false);
        console.error('Error connecting to the database', err)
      })
      .finally(() => {
        this.connected$.complete()
      });
  }

  public async transaction(callback: TransactionCallback) {
    const client = await this.onConnected();
    try {
      await client.query('BEGIN');
      await callback(client);
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Error executing transaction', err);
      throw err;
    }
  }

  public async query<T extends QueryResultRow = any>(query: QueryConfig) {
    try {
      const client = await this.onConnected();
      const res = await client.query<T>(query);
      return res.rows;
    } catch (err) {
      console.error('Error executing query', err);
      throw err;
    }
  }

  public async execute(query: QueryConfig) {
    const client = await this.onConnected();
    try {
      await client.query('BEGIN');
      const res = await client.query(query);
      await client.query('COMMIT');
      return res.rowCount;
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Error executing query', err);
      throw err;
    }
  }

  public [Symbol.dispose]() {
    const client = this.connected$.value;
    if (client) {
      client.release();
      console.log('Disconnected from the database -', `${Date.now() - this.start}ms`);
    }
  }
}
