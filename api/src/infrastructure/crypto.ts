import { randomBytes, createCipheriv, createDecipheriv, pbkdf2Sync, randomInt, createHmac } from 'crypto'

export function encrypt(key: Buffer, plaintext: string) {
  return new Promise<string>(resolve => {
    const iv = randomBytes(16);
    const cipher = createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    resolve(iv.toString('hex') + ':' + encrypted);
  })
}

export function decrypt(key: Buffer, ciphertext: string) {
  return new Promise<string>(resolve => {
    const [ivHex, encryptedHex] = ciphertext.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encryptedBuffer = Buffer.from(encryptedHex, 'hex');
    const decipher = createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedBuffer);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    resolve(decrypted.toString('utf8'));
  })
}

const shaSaltSize = 32;
const shaHashSize = 64;
const shaIterations = 100000;
const tokenSize = 64;

export function generateToken() {
  const token = randomBytes(tokenSize).toString('base64');
  const salt = randomBytes(shaSaltSize);
  const hash = pbkdf2Sync(token, salt, shaIterations, shaHashSize, 'sha512');
  return { token, hash, salt };
}

export function compareToken(raw: string, hash: Buffer, salt: Buffer) {
  const inputHash = pbkdf2Sync(raw, salt, shaIterations, shaHashSize, 'sha512');
  return hash.equals(inputHash);
}

export function generateNumericalCode(length = 6) {
  let result = '';
  while (result.length < length) {
    result += randomInt(0, 10)
  }
  return result;
}

export function generateHmac(input: string, secret: string) {
  const hmac = createHmac('sha256', secret);
  return hmac.update(input).digest('base64');
}
