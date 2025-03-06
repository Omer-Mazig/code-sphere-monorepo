import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as jose from 'jose';

@Injectable()
export class ClerkService {
  private readonly logger = new Logger(ClerkService.name);
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.clerk.com/v1';
  private readonly issuer?: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('CLERK_SECRET_KEY');
    if (!apiKey) {
      this.logger.error('CLERK_SECRET_KEY is not defined');
      throw new Error('CLERK_SECRET_KEY is not defined');
    }
    this.apiKey = apiKey;

    // Set issuer based on your Clerk instance - get this from Clerk dashboard
    this.issuer = this.configService.get<string>('CLERK_ISSUER');
  }

  /**
   * Verify a JWT token from Clerk
   * @param token JWT token from Clerk
   * @returns Decoded JWT payload or null if invalid
   */
  async verifyToken(token: string): Promise<any> {
    try {
      if (!token) {
        return null;
      }

      // Get token without the Bearer prefix if it exists
      const tokenValue = token.startsWith('Bearer ')
        ? token.substring(7)
        : token;

      // Create JWKS client using Clerk's JWKS endpoint
      // The issuer should match your Clerk Frontend API
      // Example: https://clerk.your-domain.com or https://your-instance.clerk.accounts.dev
      const issuer = this.issuer || 'https://clerk.your-domain.com';

      // Change from debug to verbose level - will only show in verbose mode
      this.logger.verbose(`Verifying token with issuer: ${issuer}`);

      const JWKS = jose.createRemoteJWKSet(
        new URL(`${issuer}/.well-known/jwks.json`),
      );

      // Verify the token
      const { payload } = await jose.jwtVerify(tokenValue, JWKS, {
        issuer,
      });

      // Change from debug to verbose level - will only show in verbose mode
      this.logger.verbose(
        `Token verified successfully for subject: ${payload.sub}`,
      );
      return payload;
    } catch (error) {
      this.logger.error(
        `Failed to verify token: ${error.message}`,
        error.stack,
      );
      return null;
    }
  }

  /**
   * Get user details from Clerk
   * @param userId Clerk user ID
   * @returns User details from Clerk API
   */
  async getUserDetails(userId: string): Promise<any> {
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
  async deleteUser(clerkId: string): Promise<boolean> {
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
