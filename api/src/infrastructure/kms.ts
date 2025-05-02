import { KMSClient, GenerateDataKeyCommand, DecryptCommand } from '@aws-sdk/client-kms';
import { getSecret } from './configuration.js';

const kms = new KMSClient({
  region: 'us-east-1',
  profile: await getSecret('AWS_PROFILE')
});

export async function generateDek() {
  const { Plaintext, CiphertextBlob } = await kms.send(new GenerateDataKeyCommand({
    KeyId: await getSecret('KMS_KEY_ID'),
    KeySpec: 'AES_256'
  }));
  return {
    plaintext: Buffer.from(Plaintext!),
    ciphertext: Buffer.from(CiphertextBlob!)
  };
}

export async function decryptDek(ciphertext: Buffer) {
  const { Plaintext } = await kms.send(new DecryptCommand({
    CiphertextBlob: ciphertext
  }));
  return Buffer.from(Plaintext!);
}
