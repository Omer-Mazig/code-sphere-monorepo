import { config } from 'dotenv';
import axios from 'axios';

// Load environment variables
config();

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
const CLERK_API_URL = 'https://api.clerk.com/v1';

if (!CLERK_SECRET_KEY) {
  throw new Error('CLERK_SECRET_KEY is not defined in environment variables');
}

// Configuration for rate limiting and retries
const DELAY_BETWEEN_REQUESTS_MS = 1000; // 1 second delay between requests
const MAX_RETRIES = 3; // Number of retries if a request fails
const RETRY_DELAY_MS = 2000; // Delay before retry

interface CreateUserParams {
  emailAddress: string[];
  password: string;
  firstName?: string;
  lastName?: string;
  username?: string;
}

// Helper function to delay execution
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function createClerkUser(
  params: CreateUserParams,
  retryCount = 0,
): Promise<any> {
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

    console.log('User created successfully:', response.data.id);
    return response.data;
  } catch (error) {
    // Check if it's a rate limit error (usually status code 429)
    if (error.response?.status === 429 && retryCount < MAX_RETRIES) {
      console.log(
        `Rate limit hit for ${params.emailAddress[0]}, retrying in ${RETRY_DELAY_MS / 1000} seconds... (Attempt ${retryCount + 1}/${MAX_RETRIES})`,
      );
      await sleep(RETRY_DELAY_MS);
      return createClerkUser(params, retryCount + 1);
    }

    console.error(
      'Error creating user:',
      error.response?.data || error.message,
    );
    throw error;
  }
}

async function createMultipleUsers(users: CreateUserParams[]) {
  for (const [index, user] of users.entries()) {
    try {
      console.log(
        `Creating user ${index + 1}/${users.length}: ${user.emailAddress[0]}`,
      );
      await createClerkUser(user);

      // Add delay between requests to avoid rate limits
      if (index < users.length - 1) {
        console.log(
          `Waiting ${DELAY_BETWEEN_REQUESTS_MS / 1000} seconds before next request...`,
        );
        await sleep(DELAY_BETWEEN_REQUESTS_MS);
      }
    } catch (error) {
      console.error(
        `Failed to create user ${user.emailAddress[0]}:`,
        error.message || error,
      );
      // Continue with the next user even if this one failed
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
    username: 'johndoe1',
  },
  {
    emailAddress: ['test2@example.com'],
    password: 'StrongP@ssw0rd2',
    firstName: 'Jane',
    lastName: 'Smith',
    username: 'janesmith2',
  },
  {
    emailAddress: ['test3@example.com'],
    password: 'StrongP@ssw0rd3',
    firstName: 'Alice',
    lastName: 'Johnson',
    username: 'alicejohnson3',
  },
  {
    emailAddress: ['test4@example.com'],
    password: 'StrongP@ssw0rd4',
    firstName: 'Bob',
    lastName: 'Williams',
    username: 'bobwilliams4',
  },
  {
    emailAddress: ['test5@example.com'],
    password: 'StrongP@ssw0rd5',
    firstName: 'Carol',
    lastName: 'Brown',
    username: 'carolbrown5',
  },
  {
    emailAddress: ['test6@example.com'],
    password: 'StrongP@ssw0rd6',
    firstName: 'David',
    lastName: 'Miller',
    username: 'davidmiller6',
  },
  {
    emailAddress: ['test7@example.com'],
    password: 'StrongP@ssw0rd7',
    firstName: 'Emma',
    lastName: 'Wilson',
    username: 'emmawilson7',
  },
  {
    emailAddress: ['test8@example.com'],
    password: 'StrongP@ssw0rd8',
    firstName: 'Frank',
    lastName: 'Taylor',
    username: 'franktaylor8',
  },
  {
    emailAddress: ['test9@example.com'],
    password: 'StrongP@ssw0rd9',
    firstName: 'Grace',
    lastName: 'Davis',
    username: 'gracedavis9',
  },
  {
    emailAddress: ['test10@example.com'],
    password: 'StrongP@ssw0rd10',
    firstName: 'Henry',
    lastName: 'Clark',
    username: 'henryclark10',
  },
  {
    emailAddress: ['test11@example.com'],
    password: 'StrongP@ssw0rd11',
    firstName: 'Irene',
    lastName: 'Roberts',
    username: 'ireneroberts11',
  },
  {
    emailAddress: ['test12@example.com'],
    password: 'StrongP@ssw0rd12',
    firstName: 'Jack',
    lastName: 'Lewis',
    username: 'jacklewis12',
  },
  {
    emailAddress: ['test13@example.com'],
    password: 'StrongP@ssw0rd13',
    firstName: 'Kelly',
    lastName: 'Young',
    username: 'kellyyoung13',
  },
  {
    emailAddress: ['test14@example.com'],
    password: 'StrongP@ssw0rd14',
    firstName: 'Liam',
    lastName: 'Adams',
    username: 'liamadams14',
  },
  {
    emailAddress: ['test15@example.com'],
    password: 'StrongP@ssw0rd15',
    firstName: 'Megan',
    lastName: 'Baker',
    username: 'meganbaker15',
  },
  {
    emailAddress: ['test16@example.com'],
    password: 'StrongP@ssw0rd16',
    firstName: 'Nathan',
    lastName: 'Carter',
    username: 'nathancarter16',
  },
  {
    emailAddress: ['test17@example.com'],
    password: 'StrongP@ssw0rd17',
    firstName: 'Olivia',
    lastName: 'Evans',
    username: 'oliviaevans17',
  },
  {
    emailAddress: ['test18@example.com'],
    password: 'StrongP@ssw0rd18',
    firstName: 'Peter',
    lastName: 'Garcia',
    username: 'petergarcia18',
  },
  {
    emailAddress: ['test19@example.com'],
    password: 'StrongP@ssw0rd19',
    firstName: 'Quinn',
    lastName: 'Hill',
    username: 'quinnhill19',
  },
  {
    emailAddress: ['test20@example.com'],
    password: 'StrongP@ssw0rd20',
    firstName: 'Ryan',
    lastName: 'King',
    username: 'ryanking20',
  },
];

// Run the script
async function main() {
  try {
    console.log('Starting user creation process...');

    // Process users in smaller batches
    const batchSize = 5; // Process 5 users at a time
    for (let i = 0; i < sampleUsers.length; i += batchSize) {
      const batch = sampleUsers.slice(i, i + batchSize);
      console.log(
        `Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(sampleUsers.length / batchSize)}`,
      );
      await createMultipleUsers(batch);

      // Add a longer delay between batches
      if (i + batchSize < sampleUsers.length) {
        console.log('Waiting 10 seconds before processing next batch...');
        await sleep(10000);
      }
    }

    // Comment out single-batch processing
    // await createMultipleUsers(sampleUsers);

    console.log('Finished creating users');
  } catch (error) {
    console.error('Script failed:', error.message || error);
  }
}

main();
