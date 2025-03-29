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
import { clerkClient } from '@clerk/express';

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

      // For public routes, try to authenticate the user if a session exists
      if (req.auth?.sessionId) {
        try {
          const session = await clerkClient.sessions.getSession(
            req.auth.sessionId,
          );
          if (session) {
            const user = await this.usersService.findByClerkId(session.userId);
            if (user) {
              req.user = {
                id: user.id,
                clerkId: session.userId,
              };
              this.logger.debug(
                `[${req.requestId}] Public route optional authentication successful, user: ${user.id}`,
              );
            }
          }
        } catch (error) {
          this.logger.debug(
            `[${req.requestId}] Public route optional authentication failed: ${error.message}`,
          );
        }
      }

      return true;
    }

    // For protected routes, require authentication
    if (!req.auth?.sessionId) {
      throw new UnauthorizedException('No active session found');
    }

    try {
      const session = await clerkClient.sessions.getSession(req.auth.sessionId);

      if (!session) {
        throw new UnauthorizedException('Invalid session');
      }

      // Find the user in the database by clerkId
      this.logger.debug(
        `[${req.requestId}] Looking up user by clerkId: ${session.userId}`,
      );
      const user = await this.usersService.findByClerkId(session.userId);

      if (!user) {
        throw new UnauthorizedException('User not found in the database');
      }

      // Add the user details to the request object
      req.user = {
        id: user.id,
        clerkId: session.userId,
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
}
