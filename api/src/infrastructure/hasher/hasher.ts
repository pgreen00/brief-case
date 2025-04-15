import { ModuleThread, spawn, Thread, Worker } from 'threads';
import { AsyncSubject, lastValueFrom } from 'rxjs';
import { HasherThread } from './hasher.worker.js';

export default class Hasher {
  private worker$ = new AsyncSubject<ModuleThread<HasherThread> | null>();
  private onReady = async () => await lastValueFrom(this.worker$) ?? Promise.reject('Failed to spawn a worker');

  constructor() {
    spawn<HasherThread>(new Worker('./hasher.worker.js'))
      .then(worker => {
        this.worker$.next(worker);
        console.log('Hashing worker spawned');
      })
      .catch(err => {
        this.worker$.next(null);
        console.error('Error spawning hashing worker', err)
      })
      .finally(() => {
        this.worker$.complete();
      });
  }

  public async hashPassword(input: string) {
    const worker = await this.onReady();
    return await worker.hashPassword(input);
  }

  public async compareHash(input: string, realPw: Buffer, salt: Buffer) {
    const worker = await this.onReady();
    return await worker.compareHash(input, realPw, salt);
  }

  public async generateToken() {
    const worker = await this.onReady();
    return await worker.generateToken();
  }

  public async generateResetCode(length?: number) {
    const worker = await this.onReady();
    return await worker.generateResetCode(length);
  }

  public async [Symbol.asyncDispose]() {
    try {
      const worker = await this.onReady();
      await Thread.terminate(worker);
      console.log('Hashing worker terminated');
    } catch (error) {
      console.error('Error terminating hashing worker', error);
    }
  }
}
