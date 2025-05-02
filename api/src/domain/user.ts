export type User = {
  id: number;
  email: string; //encrypted
  email_hint: string;
  phone: string | null; //encrypted
  alt_phone: string | null; //encrypted
  first_name: string | null;
  middle_name: string | null; //encrypted
  last_name: string | null; //encrypted
  dob: Date | null; //encrypted
  gender: string | null; //encrypted
  ssn: string | null; //encrypted
  alt_contact: string | null; //encrypted
  alt_contact_phone: string | null; //encrypted
  pw: string | null; //bcrypt
  dek: Buffer | null;
  iv: Buffer | null;
  registration_code: string | null;
  registration_code_expiration: Date | null;
  last_login: Date | null;
  locked_out: boolean;
  locked_out_until: Date | null;
  settings: Record<string, string> | null;
  is_deleted: boolean;
  dek_expiration: Date | null;
  last_modified: Date;
}
