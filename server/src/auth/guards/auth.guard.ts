import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decoarators/public.decorator';
import { UsersService } from '../../users/users.service';
import { clerkClient } from '@clerk/express';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    // Check if the route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    return isPublic
      ? this.handlePublicRoute(req)
      : this.handleProtectedRoute(req);
  }

  private async handlePublicRoute(req: any): Promise<boolean> {
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
          }
        }
      } catch (error) {
        // Do not throw an error here, just log it
        // This is because the route is public and we don't want to block access
        this.logger.debug(
          `[${req.requestId}] Public route optional authentication failed: ${error.message}`,
        );
      }
    }

    return true;
  }

  private async handleProtectedRoute(req: any): Promise<boolean> {
    // For protected routes, require authentication
    if (!req.auth?.sessionId) {
      throw new UnauthorizedException('No active session found');
    }

    try {
      const session = await clerkClient.sessions.getSession(req.auth.sessionId);
      if (!session) {
        throw new UnauthorizedException('Invalid session');
      }

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
