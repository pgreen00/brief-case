import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { expose } from 'threads/worker';

let encryptionKey: Buffer;

const encryptorThread = {
  init: (key: Buffer) => {
    encryptionKey = key
  },
  encrypt: (raw: string, iv?: Buffer) => {
    iv ??= randomBytes(16);
    const cipher = createCipheriv('aes-256-cbc', encryptionKey, iv);
    let encrypted = cipher.update(raw, 'utf-8');
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return [ encrypted, iv ] as const;
  },
  decrypt: (cipherText: Buffer, iv: Buffer) => {
    const decipher = createDecipheriv('aes-256-cbc', encryptionKey, iv);
    let decrypted = decipher.update(cipherText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString('utf8');
  }
}

export type EncryptorThread = typeof encryptorThread;

expose(encryptorThread);
