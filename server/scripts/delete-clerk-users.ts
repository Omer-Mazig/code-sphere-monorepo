import { config } from 'dotenv';
import axios from 'axios';

// Load environment variables
config();

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
const CLERK_API_URL = 'https://api.clerk.com/v1';

if (!CLERK_SECRET_KEY) {
  throw new Error('CLERK_SECRET_KEY is not defined in environment variables');
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

// Run the script
async function main() {
  try {
    console.log('Starting user deletion process...');
    await deleteAllUsers();
    console.log('Finished deleting all users');
  } catch (error) {
    console.error('Script failed:', error);
  }
}

main();
