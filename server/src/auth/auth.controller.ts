import {
  Controller,
  Get,
  Headers,
  UnauthorizedException,
  Post,
  Body,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';

// DTO for user sync data
class SyncUserDto {
  id: string;
  firstName?: string;
  lastName?: string;
  primaryEmail: string;
}

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Get('me')
  async getCurrentUser(@Headers('authorization') authorization: string) {
    if (!authorization) {
      throw new UnauthorizedException('No authorization token provided');
    }

    return this.authService.validateUser(authorization);
  }

  @Post('sync')
  async syncUser(@Body() userData: SyncUserDto) {
    try {
      this.logger.log(`Syncing user data for: ${userData.id}`);

      // For now, we'll just log the data and return success
      // In a real implementation, you might want to store this in your database
      this.logger.log('User data:', userData);

      return {
        success: true,
        message: 'User data synchronized successfully',
        userId: userData.id,
      };
    } catch (error) {
      this.logger.error(
        `Error syncing user data: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        'Failed to sync user data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
