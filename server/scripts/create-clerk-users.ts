import { config } from 'dotenv';
import axios from 'axios';

// Load environment variables
config();

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
const CLERK_API_URL = 'https://api.clerk.com/v1';

if (!CLERK_SECRET_KEY) {
  throw new Error('CLERK_SECRET_KEY is not defined in environment variables');
}

interface CreateUserParams {
  emailAddress: string[];
  password: string;
  firstName?: string;
  lastName?: string;
  username?: string;
}

async function createClerkUser(params: CreateUserParams) {
  try {
    const response = await axios.post(
      `${CLERK_API_URL}/users`,
      {
        email_address: params.emailAddress,
        password: params.password,
        first_name: params.firstName,
        last_name: params.lastName,
        username: params.username,
      },
      {
        headers: {
          Authorization: `Bearer ${CLERK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    console.log('User created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'Error creating user:',
      error.response?.data || error.message,
    );
    throw error;
  }
}

async function createMultipleUsers(users: CreateUserParams[]) {
  for (const user of users) {
    try {
      await createClerkUser(user);
    } catch (error) {
      console.error(`Failed to create user ${user.emailAddress[0]}:`, error);
    }
  }
}

// Example usage
const sampleUsers = [
  {
    emailAddress: ['test1@example.com'],
    password: 'StrongP@ssw0rd1',
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe',
  },
  {
    emailAddress: ['test2@example.com'],
    password: 'StrongP@ssw0rd2',
    firstName: 'Jane',
    lastName: 'Smith',
    username: 'janesmith',
  },
  {
    emailAddress: ['test3@example.com'],
    password: 'StrongP@ssw0rd3',
    firstName: 'Alice',
    lastName: 'Johnson',
    username: 'alicejohnson',
  },
  {
    emailAddress: ['test4@example.com'],
    password: 'StrongP@ssw0rd4',
    firstName: 'Bob',
    lastName: 'Brown',
    username: 'bobbrown',
  },
  {
    emailAddress: ['test5@example.com'],
    password: 'StrongP@ssw0rd5',
    firstName: 'Charlie',
    lastName: 'Davis',
    username: 'charliedavis',
  },
  {
    emailAddress: ['test6@example.com'],
    password: 'StrongP@ssw0rd6',
    firstName: 'Diana',
    lastName: 'Evans',
    username: 'dianae',
  },
  {
    emailAddress: ['test7@example.com'],
    password: 'StrongP@ssw0rd7',
    firstName: 'Ethan',
    lastName: 'Fowler',
    username: 'ethanfowler',
  },
  {
    emailAddress: ['test8@example.com'],
    password: 'StrongP@ssw0rd8',
    firstName: 'Fiona',
    lastName: 'Garcia',
    username: 'fionagarcia',
  },
  {
    emailAddress: ['test9@example.com'],
    password: 'StrongP@ssw0rd9',
    firstName: 'George',
    lastName: 'Harris',
    username: 'georgeharris',
  },
  {
    emailAddress: ['test10@example.com'],
    password: 'StrongP@ssw0rd10',
    firstName: 'Hannah',
    lastName: 'Irwin',
    username: 'hannahirwin',
  },
  {
    emailAddress: ['test11@example.com'],
    password: 'StrongP@ssw0rd11',
    firstName: 'Ivy',
    lastName: 'Jackson',
    username: 'ivyjackson',
  },
  {
    emailAddress: ['test12@example.com'],
    password: 'StrongP@ssw0rd12',
    firstName: 'Jack',
    lastName: 'Knight',
    username: 'jackknight',
  },
  {
    emailAddress: ['test13@example.com'],
    password: 'StrongP@ssw0rd13',
    firstName: 'Liam',
    lastName: 'Martin',
    username: 'liammartin',
  },
  {
    emailAddress: ['test14@example.com'],
    password: 'StrongP@ssw0rd14',
    firstName: 'Mia',
    lastName: 'Nguyen',
    username: 'mianguyen',
  },
  {
    emailAddress: ['test15@example.com'],
    password: 'StrongP@ssw0rd15',
    firstName: 'Noah',
    lastName: 'Owen',
    username: 'noahowen',
  },
  {
    emailAddress: ['test16@example.com'],
    password: 'StrongP@ssw0rd16',
    firstName: 'Olivia',
    lastName: 'Parker',
    username: 'oliviarparker',
  },
  {
    emailAddress: ['test17@example.com'],
    password: 'StrongP@ssw0rd17',
    firstName: 'William',
    lastName: 'Quinn',
    username: 'williamquinn',
  },
  {
    emailAddress: ['test18@example.com'],
    password: 'StrongP@ssw0rd18',
    firstName: 'Xavier',
    lastName: 'Rogers',
    username: 'xavierrogers',
  },
  {
    emailAddress: ['test19@example.com'],
    password: 'StrongP@ssw0rd19',
    firstName: 'Yara',
    lastName: 'Smith',
    username: 'yarasmith',
  },
  {
    emailAddress: ['test20@example.com'],
    password: 'StrongP@ssw0rd20',
    firstName: 'Zara',
    lastName: 'Taylor',
    username: 'zarataylor',
  },
];

// Run the script
createMultipleUsers(sampleUsers)
  .then(() => console.log('Finished creating users'))
  .catch((error) => console.error('Script failed:', error));
