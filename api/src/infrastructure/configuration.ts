import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

export const production = process.env['NODE_ENV'] === 'production';

const client = new SecretsManagerClient({
  region: 'us-east-1',
  profile: process.env['AWS_PROFILE']
});

export async function getSecret(name: string) {
  if (production) {
    try {
      const response = await client.send(new GetSecretValueCommand({ SecretId: name }));
      if ('SecretString' in response) {
        return response.SecretString;
      } else if (response.SecretBinary) {
        const buff = Buffer.from(response.SecretBinary.toString(), 'base64');
        return buff.toString('ascii'); //utf8 ?
      } else {
        throw new Error('Secret is not a string or binary');
      }
    } catch (err) {
      console.error(`Error fetching secret ${name} from AWS:`, err);
      return undefined;
    }
  } else {
    return process.env[name];
  }
}
