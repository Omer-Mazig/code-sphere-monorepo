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

async function getAllUsers() {
  try {
    const response = await axios.get(`${CLERK_API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    // Check if response.data exists and has the expected structure
    if (!response.data || !Array.isArray(response.data)) {
      console.log('No users found or unexpected response structure');
      return [];
    }

    return response.data;
  } catch (error) {
    console.error(
      'Error fetching users:',
      error.response?.data || error.message,
    );
    // Return empty array on error instead of throwing
    return [];
  }
}

async function deleteUser(userId: string) {
  try {
    await axios.delete(`${CLERK_API_URL}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    console.log(`Successfully deleted user: ${userId}`);
  } catch (error) {
    console.error(
      `Error deleting user ${userId}:`,
      error.response?.data || error.message,
    );
    throw error;
  }
}

async function deleteAllUsers() {
  console.log('Fetching all users...');
  const users = await getAllUsers();

  if (users.length === 0) {
    console.log('No users found to delete');
    return;
  }

  console.log(`Found ${users.length} users to delete`);

  for (const user of users) {
    try {
      await deleteUser(user.id);
    } catch (error) {
      console.error(`Failed to delete user ${user.id}:`, error);
    }
  }
  console.log('Finished deleting all users');
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
  {
    emailAddress: ['test21@example.com'],
    password: 'StrongP@ssw0rd21',
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe',
  },
  {
    emailAddress: ['test22@example.com'],
    password: 'StrongP@ssw0rd22',
    firstName: 'Jane',
    lastName: 'Smith',
    username: 'janesmith',
  },
  {
    emailAddress: ['test23@example.com'],
    password: 'StrongP@ssw0rd23',
    firstName: 'Alice',
    lastName: 'Johnson',
    username: 'alicejohnson',
  },
  {
    emailAddress: ['test24@example.com'],
    password: 'StrongP@ssw0rd24',
    firstName: 'Bob',
    lastName: 'Brown',
    username: 'bobbrown',
  },
  {
    emailAddress: ['test25@example.com'],
    password: 'StrongP@ssw0rd25',
    firstName: 'Charlie',
    lastName: 'Davis',
    username: 'charliedavis',
  },
  {
    emailAddress: ['test26@example.com'],
    password: 'StrongP@ssw0rd26',
    firstName: 'Diana',
    lastName: 'Evans',
    username: 'dianae',
  },
  {
    emailAddress: ['test27@example.com'],
    password: 'StrongP@ssw0rd27',
    firstName: 'Ethan',
    lastName: 'Fowler',
    username: 'ethanfowler',
  },
  {
    emailAddress: ['test28@example.com'],
    password: 'StrongP@ssw0rd28',
    firstName: 'Fiona',
    lastName: 'Garcia',
    username: 'fionagarcia',
  },
  {
    emailAddress: ['test29@example.com'],
    password: 'StrongP@ssw0rd29',
    firstName: 'George',
    lastName: 'Harris',
    username: 'georgeharris',
  },
  {
    emailAddress: ['test30@example.com'],
    password: 'StrongP@ssw0rd30',
    firstName: 'Hannah',
    lastName: 'Irwin',
    username: 'hannahirwin',
  },
];

// Run the script
async function main() {
  try {
    console.log('Starting user management process...');

    // First, delete all existing users
    await deleteAllUsers();

    // Then create new users
    console.log('Creating new users...');
    await createMultipleUsers(sampleUsers);

    console.log('Finished all operations');
  } catch (error) {
    console.error('Script failed:', error);
  }
}

main();
