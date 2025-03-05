import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  private readonly logger = new Logger(ClerkAuthGuard.name);

  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authorization = request.headers.authorization;

    if (!authorization) {
      this.logger.error('Missing authorization header');
      throw new UnauthorizedException('Authorization header is required');
    }

    try {
      // Extract token from Authorization header (Bearer token)
      const parts = authorization.split(' ');
      if (parts.length !== 2 || parts[0] !== 'Bearer') {
        this.logger.error('Invalid authorization format');
        throw new UnauthorizedException('Invalid authorization format');
      }

      const token = parts[1];

      // Verify the token
      const verified = await this.authService.verifyToken(token);
      if (!verified || !verified.userId) {
        this.logger.error('Invalid token');
        throw new UnauthorizedException('Invalid token');
      }

      // Get the full user data
      const userData = await this.authService.getUserById(verified.userId);
      if (!userData) {
        this.logger.error(`User not found for ID: ${verified.userId}`);
        throw new UnauthorizedException('User not found');
      }

      // Attach the verified user to the request object
      request['user'] = {
        userId: userData.id,
        email: userData.emailAddresses[0]?.emailAddress,
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: userData.username,
        imageUrl: userData.imageUrl,
      };

      this.logger.log(`User authenticated: ${userData.id}`);
      return true;
    } catch (error) {
      this.logger.error('Authentication error:', error);
      throw new UnauthorizedException(
        'Authentication failed: ' + error.message,
      );
    }
  }
}
