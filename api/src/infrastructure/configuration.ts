import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { config } from 'dotenv';

config();

export const isproduction = process.env['NODE_ENV'] === 'production';

const client = new SecretsManagerClient({
  region: 'us-east-1',
  profile: process.env['AWS_PROFILE']
});

export const getSecret = async (name: string): Promise<string | undefined> => {
  if (isproduction) {
    try {
      const response = await client.send(new GetSecretValueCommand({
        SecretId: name,
      }));
      if ('SecretString' in response) {
        return response.SecretString;
      } else if (response.SecretBinary) {
        const buff = Buffer.from(response.SecretBinary.toString(), 'base64');
        return buff.toString('ascii'); //utf8 ?
      }
    } catch (err) {
      console.error(`Error fetching secret ${name} from AWS:`, err);
    }
    return undefined;
  } else {
    return Promise.resolve(process.env[name]);
  }
}
