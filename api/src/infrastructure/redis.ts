import { createClient } from 'redis';

export class RedisClient implements Disposable {
  public client: ReturnType<typeof createClient>

  constructor() {
    this.client = createClient({
      url: 'redis://localhost:6379',
      database: 1,
    })
    this.client.connect()
  }

  [Symbol.dispose](): void {
    this.client.destroy()
  }
}
