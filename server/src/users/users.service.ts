import { Injectable, NotFoundException } from '@nestjs/common';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { ClerkUser } from './types/clerk-user.type';

@Injectable()
export class UsersService {
  async getUserData(clerkUserId: string): Promise<ClerkUser> {
    try {
      const user = await clerkClient.users.getUser(clerkUserId);
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses[0]?.emailAddress,
        imageUrl: user.imageUrl,
        username: user.username,
      };
    } catch (error) {
      throw new NotFoundException(`User with ID ${clerkUserId} not found`);
    }
  }

  async searchUsers(query: string): Promise<ClerkUser[]> {
    try {
      const users = await clerkClient.users.getUserList();
      const filteredUsers = users.data.filter((user) => {
        const fullName =
          `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
        const username = (user.username || '').toLowerCase();
        const email = user.emailAddresses[0]?.emailAddress?.toLowerCase() || '';
        const searchTerm = query.toLowerCase();

        return (
          fullName.includes(searchTerm) ||
          username.includes(searchTerm) ||
          email.includes(searchTerm)
        );
      });

      return filteredUsers.map((user) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses[0]?.emailAddress,
        imageUrl: user.imageUrl,
        username: user.username,
      }));
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }

  // Method to get a batch of users by their Clerk IDs
  async getUsersByClerkIds(clerkUserIds: string[]): Promise<ClerkUser[]> {
    try {
      if (!clerkUserIds.length) return [];

      const uniqueIds = [...new Set(clerkUserIds)];
      const userList = await clerkClient.users.getUserList({
        userId: uniqueIds,
      });

      return userList.data.map((user) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses[0]?.emailAddress,
        imageUrl: user.imageUrl,
        username: user.username,
      }));
    } catch (error) {
      console.error('Error fetching users by IDs:', error);
      return [];
    }
  }
}
