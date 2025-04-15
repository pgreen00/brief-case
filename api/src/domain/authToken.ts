export type AuthToken = {
  id: number;
  value: Buffer;
  salt: Buffer;
  userId: number;
  expiration: Date;
}
