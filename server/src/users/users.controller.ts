import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

interface RequestWithUser extends Request {
  user: {
    clerkId: string;
    isAdmin: boolean;
  };
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Req() req: RequestWithUser): Promise<User[]> {
    // Only admins can see all users
    if (!req.user.isAdmin) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }
    return this.usersService.findAll();
  }

  @Get('profile')
  async getProfile(@Req() req: RequestWithUser): Promise<User> {
    const user = await this.usersService.findByClerkId(req.user.clerkId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Put('profile')
  async update(
    @Req() req: RequestWithUser,
    @Body() updateUserData: Partial<User>,
  ): Promise<User> {
    // Users can only update their own profiles
    return this.usersService.updateByClerkId(req.user.clerkId, updateUserData);
  }

  @Delete('profile')
  async remove(@Req() req: RequestWithUser): Promise<void> {
    const user = await this.usersService.findByClerkId(req.user.clerkId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.usersService.remove(user.id);
  }

  @Post('follow/:clerkId')
  async followUser(
    @Req() req: RequestWithUser,
    @Param('clerkId') followingClerkId: string,
  ): Promise<{ message: string }> {
    const followerClerkId = req.user.clerkId;

    // Users cannot follow themselves
    if (followerClerkId === followingClerkId) {
      throw new ForbiddenException('You cannot follow yourself');
    }

    await this.usersService.followUser(followerClerkId, followingClerkId);
    return { message: 'User followed successfully' };
  }

  @Delete('unfollow/:clerkId')
  async unfollowUser(
    @Req() req: RequestWithUser,
    @Param('clerkId') followingClerkId: string,
  ): Promise<{ message: string }> {
    const followerClerkId = req.user.clerkId;

    await this.usersService.unfollowUser(followerClerkId, followingClerkId);
    return { message: 'User unfollowed successfully' };
  }

  @Get(':clerkId/followers')
  async getFollowers(@Param('clerkId') clerkId: string): Promise<User[]> {
    return this.usersService.getFollowers(clerkId);
  }

  @Get(':clerkId/following')
  async getFollowing(@Param('clerkId') clerkId: string): Promise<User[]> {
    return this.usersService.getFollowing(clerkId);
  }
}
