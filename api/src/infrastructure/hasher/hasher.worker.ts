import { randomBytes, pbkdf2Sync, randomInt } from 'crypto';
import { expose } from 'threads/worker';

const pwSaltSize = 32;
const pwHashSize = 64;
const tokenHashSize = 64;
const iterations = 100000;

const hasherThread = {
  hashPassword: (input: string) => {
    const salt = randomBytes(pwSaltSize);
    const hash = pbkdf2Sync(input, salt, iterations, pwHashSize, 'sha512');
    return { hash, salt };
  },
  compareHash: (input: string, realPw: Buffer, salt: Buffer) => {
    const inputHash = pbkdf2Sync(input, salt, iterations, pwHashSize, 'sha512');
    return realPw.equals(inputHash);
  },
  generateToken: () => {
    return randomBytes(tokenHashSize).toString('base64');
  },
  generateResetCode: (length = 6) => {
    let result = '';
    while (result.length < length) {
      result += randomInt(0, 10)
    }
    return result;
  }
}

export type HasherThread = typeof hasherThread;

expose(hasherThread);
