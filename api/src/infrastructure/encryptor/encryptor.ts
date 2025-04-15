import { ModuleThread, spawn, Thread, Worker } from 'threads';
import { AsyncSubject, lastValueFrom } from 'rxjs';
import { EncryptorThread } from './encryptor.worker.js';

export default class Encryptor {
  private worker$ = new AsyncSubject<ModuleThread<EncryptorThread> | null>();
  private onReady = async () => await lastValueFrom(this.worker$) ?? Promise.reject('Failed to spawn a worker');

  constructor(encryptionKey: Buffer) {
    spawn<EncryptorThread>(new Worker('./encryptor.worker.js'))
      .then(async worker => {
        await worker.init(encryptionKey);
        this.worker$.next(worker);
        console.log('Encryption worker spawned');
      })
      .catch(err => {
        this.worker$.next(null);
        console.error('Error spawning encryption worker', err)
      })
      .finally(() => {
        this.worker$.complete();
      });
  }

  public async encrypt(raw: string, iv: Buffer) {
    const worker = await this.onReady();
    return await worker.encrypt(raw, iv);
  }

  public async decrypt(cipherText: Buffer, iv: Buffer) {
    const worker = await this.onReady();
    return await worker.decrypt(cipherText, iv);
  }

  public async generateKeyAndIv() {
    const worker = await this.onReady();
    return await worker.generateKeyAndIv();
  }

  public async [Symbol.asyncDispose]() {
    try {
      const worker = await this.onReady();
      await Thread.terminate(worker);
      console.log('Encryption worker terminated');
    } catch (error) {
      console.error('Error terminating encryption worker', error);
    }
  }
}
