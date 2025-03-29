import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
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
    const req = context.switchToHttp().getRequest();
    const path = req.path;
    const method = req.method;

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
      this.logger.debug(
        `[${req.requestId}] Public route, skipping auth checks`,
      );

      // For public routes, try to authenticate the user if a token is present,
      // but don't block access if authentication fails
      const token = this.extractTokenFromHeader(req);
      if (token) {
        try {
          this.logger.debug(
            `[${req.requestId}] Public route with token, attempting optional authentication`,
          );
          const payload = await this.clerkService.verifyToken(token);

          if (payload) {
            const user = await this.usersService.findByClerkId(payload.sub);
            if (user) {
              req.user = {
                id: user.id,
                clerkId: payload.sub,
                isAdmin: payload.isAdmin || false,
              };
              this.logger.debug(
                `[${req.requestId}] Public route optional authentication successful, user: ${user.id}`,
              );
            }
          }
        } catch (error) {
          // For public routes, we silently ignore authentication errors
          this.logger.debug(
            `[${req.requestId}] Public route optional authentication failed: ${error.message}`,
          );
        }
      }

      // Always allow access to public routes regardless of authentication result
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
