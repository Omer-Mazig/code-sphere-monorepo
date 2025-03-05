import {
  Controller,
  Get,
  UseGuards,
  HttpException,
  HttpStatus,
  Param,
  Query,
  Logger,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
  Headers,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ClerkAuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { ClerkUser } from './types/clerk-user.type';
import { PostsService } from '../posts/posts.service';
import { LikesService } from '../likes/likes.service';
import { AuthService } from '../auth/auth.service';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
    private readonly likesService: LikesService,
    private readonly authService: AuthService,
  ) {}

  // Search users
  @UseGuards(ClerkAuthGuard)
  @Get('search')
  async searchUsers(@Query('q') query: string): Promise<ClerkUser[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }

    return this.usersService.searchUsers(query);
  }

  // Get current user's profile with complete data
  @Get('me/profile-complete')
  async getCurrentUserProfileComplete(
    @Headers('authorization') authorization: string,
  ) {
    console.log('authorization', authorization);
    if (!authorization) {
      this.logger.error('Missing authorization header');
      throw new UnauthorizedException('Authorization header is required');
    }

    try {
      this.logger.log('Fetching complete profile for current user');

      // Validate the user from the token
      const userData = await this.authService.validateUser(authorization);

      if (!userData || !userData.id) {
        this.logger.error('Invalid user data from token');
        throw new UnauthorizedException('Invalid authentication');
      }

      this.logger.log(`User authenticated: ${userData.id}`);

      // Get user's posts
      const posts = await this.postsService.findByClerkUserId(userData.id);
      this.logger.log(
        `Retrieved ${posts.length} posts for user ${userData.id}`,
      );

      // Get user's liked posts IDs
      const likedPostIds = await this.likesService.getUserLikedPosts(
        userData.id,
      );
      this.logger.log(
        `Retrieved ${likedPostIds.length} liked post IDs for user ${userData.id}`,
      );

      // Get the full liked posts data
      const likedPosts = posts.filter((post) => likedPostIds.includes(post.id));

      // Construct the profile response
      const response = {
        profile: {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          imageUrl: userData.imageUrl,
          bio: '', // These fields could be stored in a profile entity if needed
          location: '',
          website: '',
          followersCount: 0, // Implement followers functionality if needed
          followingCount: 0,
        },
        posts,
        likedPosts,
      };

      this.logger.log('Successfully retrieved complete profile data');
      return response;
    } catch (error) {
      this.logger.error('Error in getCurrentUserProfileComplete:', error);

      if (
        error instanceof UnauthorizedException ||
        error instanceof NotFoundException
      ) {
        throw error; // Re-throw authentication and not found errors
      }

      throw new InternalServerErrorException(
        'Failed to get current user profile: ' + error.message,
      );
    }
  }

  @UseGuards(ClerkAuthGuard)
  @Get('me/profile')
  async getCurrentUserProfile(@CurrentUser() user: any): Promise<ClerkUser> {
    if (!user || !user.userId) {
      this.logger.error('No user or userId found in the request');
      throw new HttpException(
        'User authentication error',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      return await this.usersService.getUserData(user.userId);
    } catch (error) {
      this.logger.error(`Error getting user data for ${user.userId}:`, error);
      throw new HttpException(
        'Error retrieving user data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Get user profile with complete data by ID
  @UseGuards(ClerkAuthGuard)
  @Get(':userId/profile-complete')
  async getUserProfileComplete(@Param('userId') userId: string) {
    try {
      this.logger.log(`Fetching complete profile for user: ${userId}`);

      // Get user data from Clerk
      const profile = await this.usersService.getUserData(userId);

      if (!profile) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      // Get user's posts
      const posts = await this.postsService.findByClerkUserId(userId);
      this.logger.log(`Retrieved ${posts.length} posts for user ${userId}`);

      // Get user's liked posts IDs
      const likedPostIds = await this.likesService.getUserLikedPosts(userId);
      this.logger.log(
        `Retrieved ${likedPostIds.length} liked post IDs for user ${userId}`,
      );

      // Get the full liked posts data
      const likedPosts = posts.filter((post) => likedPostIds.includes(post.id));

      // Add follow count information
      const profileWithCounts = {
        ...profile,
        followersCount: 0, // Replace with actual followers count
        followingCount: 0, // Replace with actual following count
      };

      return {
        profile: profileWithCounts,
        posts,
        likedPosts,
      };
    } catch (error) {
      this.logger.error(
        `Error getting complete profile data for user ${userId}:`,
        error,
      );

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new HttpException(
        'Error retrieving profile data: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Get batch of users by IDs
  @UseGuards(ClerkAuthGuard)
  @Get('batch')
  async getUsersByIds(@Query('ids') ids: string): Promise<ClerkUser[]> {
    if (!ids) {
      return [];
    }

    const userIds = ids.split(',').filter((id) => id.trim().length > 0);
    if (userIds.length === 0) {
      return [];
    }

    return this.usersService.getUsersByClerkIds(userIds);
  }

  // Get user profile by ID
  @UseGuards(ClerkAuthGuard)
  @Get('profile/:userId')
  async getProfile(@Param('userId') userId: string): Promise<ClerkUser> {
    try {
      return await this.usersService.getUserData(userId);
    } catch (error) {
      this.logger.error(`Error getting user profile for ${userId}:`, error);
      throw new HttpException(
        `User with ID ${userId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  // Get user by ID
  @UseGuards(ClerkAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ClerkUser> {
    try {
      return await this.usersService.getUserData(id);
    } catch (error) {
      this.logger.error(`Error getting user data for ${id}:`, error);
      throw new HttpException(
        `User with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
