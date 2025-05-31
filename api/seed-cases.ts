import { faker } from '@faker-js/faker';

// Define the Intake and Dto interfaces
interface Intake {
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
}

interface Client {
  firstName: string;
  lastName: string;
  middleName: string | null;
  dob: string;
  gender: string | null;
  phone: string;
  altPhone: string | null;
  email: string;
  altContact: string;
  altContactPhone: string;
  ssn: string;
}

interface Dto {
  intake: Intake;
  client: Client | string;
  caseGroup: number;
}

// List of existing case group IDs from the database
const caseGroupIds = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24
];

// Helper to pick a random element from an array
function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Helper to generate a random SSN-like string
function generateSSN(): string {
  return faker.string.numeric({ length: 9, allowLeadingZeros: true });
}

// Helper to generate a random phone number (US format)
function generatePhoneNumber(): string {
  return faker.phone.number({ style: 'national' });
}

// Generate a single Intake object
function generateRandomIntake(): Intake {
  // Random marital status
  const maritalStatuses: Intake['maritalStatus'][] = ['single', 'married', 'divorced', 'widowed'];
  const maritalStatus = randomElement(maritalStatuses);

  // spouseOrEx only if married/divorced/widowed
  const spouseOrEx = ['married', 'divorced', 'widowed'].includes(maritalStatus)
    ? `${faker.name.firstName()} ${faker.name.lastName()}`
    : null;

  // maidenName: 50% chance if married/divorced/widowed, else null
  const maidenName = (maritalStatus === 'married' || maritalStatus === 'divorced')
    && faker.datatype.boolean()
    ? faker.name.lastName()
    : null;

  // mothersLastName: 70% chance to have
  const mothersLastName = faker.datatype.boolean() ? faker.name.lastName() : null;

  // Children: random number between 0 and 3
  const numChildren = faker.number.int({ min: 0, max: 3 });
  const children = Array.from({ length: numChildren }).map(() => ({
    name: faker.datatype.boolean() ? faker.name.firstName() + ' ' + faker.name.lastName() : null,
    age: faker.datatype.boolean() ? faker.number.int({ min: 0, max: 25 }) : null
  }));

  // High school and college fields (nullable)
  const hs = faker.datatype.boolean() ? `${faker.address.city()} High School` : null;
  const college = faker.datatype.boolean() ? `${faker.address.city()} University` : null;

  // prior filing
  const priorFiling = faker.datatype.boolean();

  // dateLastWorked: random date within the last 2 years, formatted as ISO string
  const dateLastWorked = faker.date
    .past({ years: 2 })
    .toISOString();

  // workHistory: some lorem text
  const workHistory = faker.lorem.sentences(faker.number.int({ min: 1, max: 3 }));

  // impairments, medical, pharmacy, notes: random lorem
  const impairments = faker.lorem.sentences(faker.number.int({ min: 1, max: 2 }));
  const medical = faker.lorem.sentences(faker.number.int({ min: 1, max: 2 }));
  const pharmacy = faker.lorem.words(faker.number.int({ min: 1, max: 4 }));
  const notes = faker.lorem.sentences(faker.number.int({ min: 1, max: 3 }));

  // referral: 50% chance null, else random company name or person
  const referral = faker.datatype.boolean()
    ? `${faker.name.firstName()} ${faker.name.lastName()}`
    : null;

  // isFeeAgreement
  const isFeeAgreement = faker.datatype.boolean();

  return {
    address: faker.datatype.boolean() ? faker.address.streetAddress(true) : null,
    maritalStatus,
    spouseOrEx,
    maidenName,
    mothersLastName,
    children,
    hs,
    college,
    priorFiling,
    dateLastWorked,
    workHistory,
    impairments,
    medical,
    pharmacy,
    notes,
    referral,
    isFeeAgreement
  };
}

// Generate a single Client object
function generateRandomClient(): Client {
  const genderOptions = ['male', 'female', null];
  const gender = randomElement(genderOptions);
  const firstName = faker.name.firstName(gender === 'male' ? 'male' : gender === 'female' ? 'female' : undefined);
  const lastName = faker.name.lastName();
  const middleName = faker.datatype.boolean() ? faker.name.firstName() : null;

  // Date of birth: between 18 and 90 years ago
  const dob = faker.date
    .between({
      from: faker.date.past({ years: 90 }),
      to: new Date()
    })
    .toISOString()
    .split('T')[0]; // only the date portion

  return {
    firstName,
    lastName,
    middleName,
    dob,
    gender,
    phone: generatePhoneNumber(),
    altPhone: faker.datatype.boolean() ? generatePhoneNumber() : null,
    email: faker.internet.email({ firstName, lastName }),
    altContact: `${faker.name.firstName()} ${faker.name.lastName()}`,
    altContactPhone: generatePhoneNumber(),
    ssn: generateSSN()
  };
}

export default function seedCases(): Dto[] {
  // Generate 500 DTOs
  const dtos: Dto[] = [];

  for (let i = 0; i < 500; i++) {
    const intake = generateRandomIntake();
    const client = generateRandomClient();
    const caseGroup = randomElement(caseGroupIds);

    dtos.push({
      intake,
      client,
      caseGroup
    });
  }

  return dtos;
}

const dtos = seedCases()

for (const dto of dtos) {
  await fetch('http://localhost:27132/cases', {
    method: 'POST',
    body: JSON.stringify(dto),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}