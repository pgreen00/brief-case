import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { expose } from 'threads/worker';

let encryptionKey: Buffer;

const encryptorThread = {
  init: (key: Buffer) => {
    encryptionKey = key
  },
  encrypt: (raw: string, iv: Buffer) => {
    const cipher = createCipheriv('aes-256-cbc', encryptionKey, iv);
    let encrypted = cipher.update(raw, 'utf-8');
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted;
  },
  decrypt: (cipherText: Buffer, iv: Buffer) => {
    const decipher = createDecipheriv('aes-256-cbc', encryptionKey, iv);
    let decrypted = decipher.update(cipherText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString('utf8');
  },
  generateKeyAndIv: () => {
    return [
      randomBytes(32), // key
      randomBytes(16) // iv
    ] as const;
  }
}

export type EncryptorThread = typeof encryptorThread;

expose(encryptorThread);
