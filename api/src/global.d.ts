declare namespace Schema {
  declare type Appointment = {
    id: number;
    scheduled_date: Date;
    business_user_id: number;
    last_modified: Date;
    confirmed: boolean;
    description: string | null;
  }

  declare type BusinessNote = {
    id: number;
    title: string;
    description: string | null;
    business_id: number;
    created_at: Date;
    tags: string[] | null;
    show_in_calendar: boolean;
    start_date: Date | null;
    end_date: Date | null;
    user_id: number;
    duration: number | null; //interval
    last_modified: Date;
    alerts: Record<string, string> | null;
    repeats: number | null; //interval
  }

  declare type Role = 'client' | 'employee' | 'superuser';

  declare type Right =
    'case_groups:write' |
    'case_groups:read' |
    'cases:write' |
    'cases:read' |
    'users:write' |
    'users:read' |
    'businesses:write' |
    'businesses:read' |
    'appointments:write' |
    'appointments:read' |
    'business_notes:write' |
    'business_notes:read' |
    'messages:write' |
    'messages:read';

  declare type BusinessUser = {
    business_id: number;
    user_id: number;
    user_role: Role;
    rights: Right[];
    id: string;
    last_modified: Date;
  }

  declare type Business = {
    id: number,
    business_name: string,
    display_name: string,
    last_modified: Date;
  }

  declare type CaseComment = {
    id: number;
    content: string; //encrypted
    case_id: number;
    parent_id: number | null;
    user_id: number;
    created_at: Date;
    last_modified: Date;
  }

  declare type CaseFile = {
    id: number;
    case_id: number;
    file_name: string;
    s3_path: string | null;
    parent_id: number | null;
    file_size: string | null;
    last_modified: Date;
  }

  declare type CaseGroup = {
    id: number;
    title: string;
    business_id: number;
    description: string | null;
    parent_id: number | null;
    group_rank: number | null;
    automations: Record<string, string> | null;
    last_modified: Date;
  }

  declare type Intake = {
    address: string | null;
    maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
    spouseOrEx: string | null;
    maidenName: string | null;
    mothersLastName: string | null;
    children: {
      name: string | null;
      age: number | null;
    }[];
    hs: string | null;
    college: string | null;
    priorFiling: boolean;
    dateLastWorked: string;
    workHistory: string;
    impairments: string;
    medical: string;
    pharmacy: string;
    notes: string;
    referral: string | null;
    isFeeAgreement: boolean;
  };

  declare type Case = {
    id: number;
    business_user_id: number;
    case_group_id: number;
    intake: Buffer;
    tags: string[] | null
    code: string;
    last_modified: Date;
    modified_by_user_id: number | null;
  }

  declare type Message = {
    id: number;
    value: string; //encrypted
    sent_at: Date;
    sender_id: number;
    read_messages: Record<string, any> | null;
    recipient_id: number | null;
    business_id: number | null;
    last_modified: Date;
  }

  declare type Task = {
    id: number;
    assigned_user_id: number | null;
    title: string;
    description: string | null;
    due_date: Date | null;
    completed: boolean;
    case_id: number | null;
    tags: string[] | null;
    business_id: number;
    last_modified: Date;
  }

  declare type TimeEntry = {
    id: number;
    note: string | null;
    business_user_id: number;
    start_date: Date;
    end_date: Date;
    duration: number; //interval
    task_id: number | null;
    case_id: number | null;
    last_modified: Date;
  }

  declare type User = {
    id: number;
    email: string; //encrypted
    search_token: string;
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
    email_verification_code: string | null;
    email_verification_code_expiration: Date | null;
    last_login: Date | null;
    locked_out: boolean;
    locked_out_until: Date | null;
    settings: Record<string, string> | null;
    is_deleted: boolean;
    dek_expiration: Date | null;
    last_modified: Date;
  }
}
