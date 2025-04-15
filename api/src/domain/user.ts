export type Role = 'client' | 'employee' | 'superuser';

export const rights = [
  'user:delete',
  'user:edit',
  'user:read',
  'user:create',
  'case:updateTags',
  'case:updateStatus',
  'task:create',
  'task:update',
  'task:delete',
  'task:getAll'
] as const;

export type Right = typeof rights[number];

export type User = {
  id: number;
  guid: string;
  email: string; //encrypted
  emailHint: string;
  phone: string | null; //encrypted
  altPhone: string | null; //encrypted
  firstName: string | null;
  middleName: string | null; //encrypted
  lastName: string | null; //encrypted
  dob: Date | null; //encrypted
  gender: string | null; //encrypted
  ssn: string | null; //encrypted
  altContact: string | null; //encrypted
  altContactPhone: string | null; //encrypted
  pw: string | null; //bcrypt
  dek: Buffer | null;
  iv: Buffer | null;
  registrationCode: string | null;
  registrationCodeExpiration: Date | null;
  lastLogin: Date | null;
  lockedOut: boolean;
  lockedOutUntil: Date | null;
  role: Role;
  rights: Right[];
  settings: {
    [key: string]: string;
  } | null;
}
