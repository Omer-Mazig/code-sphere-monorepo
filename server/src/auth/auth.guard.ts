import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClerkService } from './providers/clerk.service';
import { IS_PUBLIC_KEY } from './public.decorator';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private clerkService: ClerkService,
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If the route is public, allow access
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No authentication token provided');
    }

    try {
      // Verify the token using ClerkService
      // TODO: fix this multiple calls to clerk service
      this.logger.debug(`Verifying token: ${token}`);
      const payload = await this.clerkService.verifyToken(token);

      if (!payload) {
        throw new UnauthorizedException('Invalid authentication token');
      }

      // Find the user in the database by clerkId
      const user = await this.usersService.findByClerkId(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found in the database');
      }

      // Add the user details to the request object for use in controllers
      request.user = {
        id: user.id, // Add UUID from database
        clerkId: payload.sub,
        // Set isAdmin based on your application's logic
        // This might come from a claim in the JWT or from your database
        isAdmin: payload.isAdmin || false,
      };

      return true;
    } catch (error) {
      this.logger.error(`Authentication failed: ${error.message}`, error.stack);
      throw new UnauthorizedException('Authentication failed');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
