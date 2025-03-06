import { Injectable, Logger } from '@nestjs/common';
import { ClerkService } from '../clerk/clerk.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private clerkService: ClerkService) {}

  /**
   * Validates a user from a Clerk JWT token
   * @param token JWT token from Clerk
   * @returns User information from the token
   */
  async validateUser(token: string): Promise<any> {
    const payload = await this.clerkService.verifyToken(token);

    if (!payload) {
      this.logger.warn('Invalid token provided for validation');
      return null;
    }

    // You can extend this to load more user data from your database
    return {
      clerkId: payload.sub,
      // Customize this based on your needs
      isAdmin: payload.isAdmin || false,
    };
  }
}
