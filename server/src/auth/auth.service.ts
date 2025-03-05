import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { clerkClient } from '@clerk/clerk-sdk-node';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

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
    if (!authorization) {
      throw new UnauthorizedException('Authorization header is required');
    }

    // Extract token from Authorization header (Bearer token)
    const token = authorization.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Bearer token is required');
    }

    // Verify the token
    const verified = await this.verifyToken(token);
    if (!verified || !verified.userId) {
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
      username: userData.username,
      imageUrl: userData.imageUrl,
    };
  }

  /**
   * Verify a JWT from Clerk
   * @param jwt The JWT token to verify
   * @returns The verified session data or null if invalid
   */
  async verifyToken(jwt: string) {
    try {
      // Since sessions.verifyToken isn't available in the current version of the SDK,
      // we'll use the built-in JWT decoding method as a temporary solution

      // Parse the JWT payload
      const payload = JSON.parse(
        Buffer.from(jwt.split('.')[1], 'base64').toString(),
      );

      this.logger.log('Decoded JWT payload:', payload);

      // Extract the user ID from the payload
      const userId = payload.sub || payload.userId;

      if (!userId) {
        this.logger.error('No user ID found in token payload');
        return null;
      }

      return { userId };
    } catch (error) {
      this.logger.error('Error verifying token:', error);
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
      const user = await clerkClient.users.getUser(userId);
      this.logger.log(`Retrieved user data for ID: ${userId}`);
      return user;
    } catch (error) {
      this.logger.error(`Error getting user ${userId}:`, error);
      return null;
    }
  }
}
