import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { RequestWithUser } from '../auth/request-with-user.interface';
import {
  UpdateUserDto,
  UserResponseDto,
  FollowRelationshipDto,
} from './dto/user.dto';
import {
  UserPermissionException,
  SelfFollowException,
} from './exceptions/user-exceptions';
import { asClerkId } from './types/id-types';

@ApiTags('users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: [UserResponseDto],
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async findAll(@Req() req: RequestWithUser): Promise<UserResponseDto[]> {
    // Only admins can see all users
    if (!req.user.isAdmin) {
      throw new UserPermissionException('access all users');
    }

    const users = await this.usersService.findAll();
    return users.map((user) => this.mapUserToDto(user));
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get the current user profile' })
  @ApiResponse({
    status: 200,
    description: 'The current user profile',
    type: UserResponseDto,
  })
  async getProfile(@Req() req: RequestWithUser): Promise<UserResponseDto> {
    const user = await this.usersService.findByClerkId(req.user.clerkId);
    return this.mapUserToDto(user);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get a user by their user ID (Clerk ID)' })
  @ApiParam({ name: 'userId', description: 'User identifier (Clerk ID)' })
  @ApiResponse({
    status: 200,
    description: 'The user profile',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('userId') userId: string): Promise<UserResponseDto> {
    const user = await this.usersService.findByClerkId(userId);
    return this.mapUserToDto(user);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update the current user profile' })
  @ApiResponse({
    status: 200,
    description: 'The updated user profile',
    type: UserResponseDto,
  })
  async update(
    @Req() req: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const updatedUser = await this.usersService.updateByClerkId(
      req.user.clerkId,
      updateUserDto,
    );
    return this.mapUserToDto(updatedUser);
  }

  @Delete('profile')
  @ApiOperation({ summary: 'Delete the current user account' })
  @ApiResponse({
    status: 204,
    description: 'User account deleted successfully',
  })
  async remove(@Req() req: RequestWithUser): Promise<void> {
    await this.usersService.removeByClerkId(req.user.clerkId);
  }

  @Post('follow/:userId')
  @ApiOperation({ summary: 'Follow another user' })
  @ApiParam({
    name: 'userId',
    description: 'User identifier (Clerk ID) to follow',
  })
  @ApiResponse({ status: 200, description: 'User followed successfully' })
  @ApiResponse({ status: 403, description: 'Cannot follow yourself' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async followUser(
    @Req() req: RequestWithUser,
    @Param('userId') userId: string,
  ): Promise<{ message: string }> {
    const followerClerkId = req.user.clerkId;

    // Users cannot follow themselves
    if (followerClerkId === userId) {
      throw new SelfFollowException();
    }

    await this.usersService.followUser(
      asClerkId(followerClerkId),
      asClerkId(userId),
    );
    return { message: 'User followed successfully' };
  }

  @Delete('unfollow/:userId')
  @ApiOperation({ summary: 'Unfollow another user' })
  @ApiParam({
    name: 'userId',
    description: 'User identifier (Clerk ID) to unfollow',
  })
  @ApiResponse({ status: 200, description: 'User unfollowed successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async unfollowUser(
    @Req() req: RequestWithUser,
    @Param('userId') userId: string,
  ): Promise<{ message: string }> {
    const followerClerkId = req.user.clerkId;

    await this.usersService.unfollowUser(
      asClerkId(followerClerkId),
      asClerkId(userId),
    );
    return { message: 'User unfollowed successfully' };
  }

  @Get(':userId/followers')
  @ApiOperation({ summary: "Get a user's followers" })
  @ApiParam({ name: 'userId', description: 'User identifier (Clerk ID)' })
  @ApiResponse({
    status: 200,
    description: 'List of users who follow the specified user',
    type: [FollowRelationshipDto],
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getFollowers(
    @Param('userId') userId: string,
  ): Promise<FollowRelationshipDto[]> {
    const followers = await this.usersService.getFollowers(userId);
    return followers.map((user) => this.mapUserToFollowDto(user));
  }

  @Get(':userId/following')
  @ApiOperation({ summary: 'Get users that a user is following' })
  @ApiParam({ name: 'userId', description: 'User identifier (Clerk ID)' })
  @ApiResponse({
    status: 200,
    description: 'List of users the specified user follows',
    type: [FollowRelationshipDto],
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getFollowing(
    @Param('userId') userId: string,
  ): Promise<FollowRelationshipDto[]> {
    const following = await this.usersService.getFollowing(userId);
    return following.map((user) => this.mapUserToFollowDto(user));
  }

  /**
   * Maps a User entity to a UserResponseDto
   */
  private mapUserToDto(user: User): UserResponseDto {
    return new UserResponseDto({
      userId: user.clerkId,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      createdAt: user.createdAt,
    });
  }

  /**
   * Maps a User entity to a FollowRelationshipDto
   */
  private mapUserToFollowDto(user: User): FollowRelationshipDto {
    return new FollowRelationshipDto({
      userId: user.clerkId,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImageUrl: user.profileImageUrl,
    });
  }
}
