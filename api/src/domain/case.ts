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
  number: string;
  userId: number;
  caseTypeId: number;
  caseStatusId: number;
  intake: Intake; //encrypted
  tags: string[] | null;
  timeEntries: {
    userId: number;
    start: Date;
    end: Date;
    note: string | null;
  }[] | null;
}
