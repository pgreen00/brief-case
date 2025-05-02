export type Intake = {
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
  dateLastWorked: Date;
  workHistory: string;
  impairments: string;
  medical: string;
  pharmacy: string;
  notes: string;
  referral: string | null;
  isFeeAgreement: boolean;
};

export type Case = {
  id: number;
  business_user_id: number;
  case_group_id: number;
  intake: Intake; //encrypted
  tags: string[] | null
  code: string;
  last_modified: Date;
}
