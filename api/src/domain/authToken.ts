export type AuthToken = {
  id: number;
  value: Buffer;
  salt: Buffer;
  user_id: number;
  expiration: Date;
}
