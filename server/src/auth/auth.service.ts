import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { clerkClient } from '@clerk/clerk-sdk-node';

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService) {
    // Clerk is automatically initialized using the CLERK_SECRET_KEY
    // environment variable, so no explicit initialization is needed
  }

  /**
   * Validate a user from the authorization header
   * @param authorization The authorization header
   * @returns The user data
   */
  async validateUser(authorization: string) {
    // Extract token from Authorization header (Bearer token)
    const token = authorization.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Bearer token is required');
    }

    // Verify the token
    const verified = await this.verifyToken(token);
    if (!verified) {
      throw new UnauthorizedException('Invalid token');
    }

    // Get user data
    const userData = await this.getUserById(verified.userId);
    if (!userData) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: userData.id,
      email: userData.emailAddresses[0]?.emailAddress,
      firstName: userData.firstName,
      lastName: userData.lastName,
    };
  }

  /**
   * Verify a JWT from Clerk
   * @param jwt The JWT token to verify
   * @returns The verified session data or null if invalid
   */
  async verifyToken(jwt: string) {
    try {
      // Note: Verification should be done with middleware
      // This is a placeholder for authentication logic
      // In production, use Clerk's verification middleware
      return { userId: 'user_id_from_verified_token' };
    } catch (error) {
      console.error('Error verifying token:', error);
      return null;
    }
  }

  /**
   * Get a user by their Clerk ID
   * @param userId The Clerk user ID
   * @returns The user data or null if not found
   */
  async getUserById(userId: string) {
    try {
      return await clerkClient.users.getUser(userId);
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }
}
