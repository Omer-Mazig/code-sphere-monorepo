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

// Symbol for storing the auth result in the request
const AUTH_RESULT_KEY = Symbol('AUTH_RESULT_KEY');

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  private requestCount = 0;

  constructor(
    private clerkService: ClerkService,
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const path = req.path;
    const method = req.method;

    // Create a unique ID for this request if it doesn't exist
    if (!req.requestId) {
      req.requestId =
        Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Count guard executions for each request
    if (!req.guardCallCount) {
      req.guardCallCount = 1;
    } else {
      req.guardCallCount++;
    }

    this.logger.debug(
      `[${req.requestId}] AuthGuard execution #${req.guardCallCount} for ${method} ${path}`,
    );

    // Check if the route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If the route is public, allow access
    if (isPublic) {
      this.logger.debug(`[${req.requestId}] Public route, skipping auth`);
      return true;
    }

    // Check if the request was already authenticated
    if (req[AUTH_RESULT_KEY]) {
      this.logger.debug(
        `[${req.requestId}] Request already authenticated, skipping verification`,
      );
      return true;
    }

    const token = this.extractTokenFromHeader(req);

    if (!token) {
      throw new UnauthorizedException('No authentication token provided');
    }

    try {
      // Verify the token using ClerkService
      this.logger.debug(`[${req.requestId}] Verifying token for request`);
      const payload = await this.clerkService.verifyToken(token);

      if (!payload) {
        throw new UnauthorizedException('Invalid authentication token');
      }

      // Find the user in the database by clerkId
      this.logger.debug(
        `[${req.requestId}] Looking up user by clerkId: ${payload.sub}`,
      );
      const user = await this.usersService.findByClerkId(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found in the database');
      }

      // Add the user details to the request object for use in controllers
      req.user = {
        id: user.id, // Add UUID from database
        clerkId: payload.sub,
        isAdmin: payload.isAdmin || false,
      };

      // Mark this request as authenticated to avoid redundant checks
      req[AUTH_RESULT_KEY] = true;
      this.logger.debug(
        `[${req.requestId}] Authentication successful, user: ${user.id}`,
      );

      return true;
    } catch (error) {
      this.logger.error(
        `[${req.requestId}] Authentication failed: ${error.message}`,
        error.stack,
      );
      throw new UnauthorizedException('Authentication failed');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
