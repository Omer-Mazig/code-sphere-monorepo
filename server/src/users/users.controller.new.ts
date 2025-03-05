import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ClerkAuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(ClerkAuthGuard)
  async getCurrentUser(@CurrentUser() user: any) {
    return this.usersService.getUserData(user.userId);
  }

  @Get('search')
  async searchUsers(@Query('q') query: string) {
    if (!query || query.trim().length < 2) {
      return [];
    }
    return this.usersService.searchUsers(query);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.usersService.getUserData(id);
  }
}
