import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class ClerkService {
  private readonly logger = new Logger(ClerkService.name);
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.clerk.com/v1';

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('CLERK_SECRET_KEY');
    if (!apiKey) {
      this.logger.error('CLERK_SECRET_KEY is not defined');
      throw new Error('CLERK_SECRET_KEY is not defined');
    }
    this.apiKey = apiKey;
  }

  /**
   * Get user details from Clerk
   * @param userId Clerk user ID
   * @returns User details from Clerk API
   */
  async getClerkUserDetails(userId: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to get user details: ${error.message}`,
        error.stack,
      );
      return null;
    }
  }

  /**
   * Delete a user from Clerk
   * @param clerkId The Clerk ID of the user to delete
   * @returns Promise indicating success/failure
   */
  async deleteClerkUser(clerkId: string): Promise<boolean> {
    try {
      this.logger.log(`Deleting user from Clerk: ${clerkId}`);
      const response = await axios.delete(`${this.baseUrl}/users/${clerkId}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      this.logger.log(`Successfully deleted user from Clerk: ${clerkId}`);
      return response.status === 200;
    } catch (error) {
      this.logger.error(
        `Failed to delete user from Clerk: ${error.message}`,
        error.stack,
      );
      return false;
    }
  }
}
