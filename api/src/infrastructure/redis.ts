import { createClient } from 'redis';

export class RedisClient implements Disposable {
  public client = createClient({
    url: 'redis://localhost:6379',
    database: 1,
  })

  constructor() {
    this.client.connect()
  }

  [Symbol.dispose](): void {
    this.client.destroy()
  }
}