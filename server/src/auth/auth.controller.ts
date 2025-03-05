import {
  Controller,
  Get,
  Post,
  Headers,
  Body,
  UnauthorizedException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
  ) {}

  @Get('me')
  async getCurrentUser(@Headers('authorization') authorization: string) {
    if (!authorization) {
      throw new UnauthorizedException('No authorization token provided');
    }

    return this.authService.validateUser(authorization);
  }

  // Simple endpoint to sync user after login
  @Post('sync-user')
  async syncUser(@Body() userData: any) {
    try {
      console.log('Syncing user to database:', userData);

      // Check if user already exists
      const existingUser = await this.usersService.findByClerkId(userData.id);

      if (existingUser) {
        // Update existing user
        const updatedUser = await this.usersService.update(existingUser.id, {
          email: userData.primaryEmail || existingUser.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
        });

        console.log('Updated user in database:', updatedUser.id);
        return { success: true, action: 'updated', userId: updatedUser.id };
      } else {
        // Create new user
        if (!userData.primaryEmail) {
          throw new Error('User has no primary email address');
        }

        const newUser = await this.usersService.create({
          clerkId: userData.id,
          email: userData.primaryEmail,
          firstName: userData.firstName,
          lastName: userData.lastName,
        });

        console.log('Created user in database:', newUser.id);
        return { success: true, action: 'created', userId: newUser.id };
      }
    } catch (error) {
      console.error('Error syncing user:', error);
      return {
        success: false,
        error: error.message || 'Failed to sync user',
      };
    }
  }
}
