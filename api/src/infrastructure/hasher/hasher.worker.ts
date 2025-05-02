import { randomBytes, pbkdf2Sync, randomInt, createHmac } from 'crypto';
import { expose } from 'threads/worker';
import { hashSync, compareSync } from 'bcrypt'

const shaSaltSize = 32;
const shaHashSize = 64;
const shaIterations = 100000;
const tokenSize = 64;
const bcryptSaltRounds = 12;

const hasherThread = {
  /** Generates a token, salt and returns raw token, hashed token, and salt using sha512 */
  generateToken: () => {
    const token = randomBytes(tokenSize).toString('base64');
    const salt = randomBytes(shaSaltSize);
    const hash = pbkdf2Sync(token, salt, shaIterations, shaHashSize, 'sha512');
    return { token, hash, salt };
  },
  /** Compares raw input with hash using sha512 */
  compareToken: (raw: string, hash: Buffer, salt: Buffer) => {
    const inputHash = pbkdf2Sync(raw, salt, shaIterations, shaHashSize, 'sha512');
    return hash.equals(inputHash);
  },
  /** Generates hash+salt using bcrypt */
  hashPassword: (input: string) => {
    return hashSync(input, bcryptSaltRounds)
  },
  /** Compares raw input with hash using bcrypt */
  comparePassword: (raw: string, hash: string) => {
    return compareSync(raw, hash)
  },
  /** Generates cryptographically strong numerical code */
  generateNumericalCode: (length = 6) => {
    let result = '';
    while (result.length < length) {
      result += randomInt(0, 10)
    }
    return result;
  },
  createHmac: (input: string, secret: string) => {
    const hmac = createHmac('sha256', secret);
    return hmac.update(input).digest('base64');
  }
}

export type HasherThread = typeof hasherThread;

expose(hasherThread);
