import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Get,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { FollowsService } from './follows.service';
import { CreateFollowDto } from './dto/create-follow.dto';
import { ClerkAuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { Follow } from './entities/follow.entity';

@Controller('follows')
@UseGuards(ClerkAuthGuard)
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Post()
  async followUser(
    @CurrentUser() user: any,
    @Body() createFollowDto: CreateFollowDto,
  ): Promise<Follow> {
    return this.followsService.followUser(user.userId, createFollowDto);
  }

  @Delete(':followingId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async unfollowUser(
    @CurrentUser() user: any,
    @Param('followingId') followingId: string,
  ): Promise<void> {
    return this.followsService.unfollowUser(user.userId, followingId);
  }

  @Get('followers')
  async getMyFollowers(@CurrentUser() user: any): Promise<Follow[]> {
    return this.followsService.getFollowers(user.userId);
  }

  @Get('following')
  async getMyFollowing(@CurrentUser() user: any): Promise<Follow[]> {
    return this.followsService.getFollowing(user.userId);
  }

  @Get('user/:userId/followers')
  async getUserFollowers(@Param('userId') userId: string): Promise<Follow[]> {
    return this.followsService.getFollowers(userId);
  }

  @Get('user/:userId/following')
  async getUserFollowing(@Param('userId') userId: string): Promise<Follow[]> {
    return this.followsService.getFollowing(userId);
  }

  @Get('counts/followers')
  async getMyFollowersCount(
    @CurrentUser() user: any,
  ): Promise<{ count: number }> {
    const count = await this.followsService.getFollowersCount(user.userId);
    return { count };
  }

  @Get('counts/following')
  async getMyFollowingCount(
    @CurrentUser() user: any,
  ): Promise<{ count: number }> {
    const count = await this.followsService.getFollowingCount(user.userId);
    return { count };
  }

  @Get('user/:userId/counts')
  async getUserFollowCounts(@Param('userId') userId: string): Promise<{
    followers: number;
    following: number;
  }> {
    const [followers, following] = await Promise.all([
      this.followsService.getFollowersCount(userId),
      this.followsService.getFollowingCount(userId),
    ]);

    return { followers, following };
  }

  @Get('is-following/:userId')
  async isFollowing(
    @CurrentUser() user: any,
    @Param('userId') userId: string,
  ): Promise<{ isFollowing: boolean }> {
    const isFollowing = await this.followsService.isFollowing(
      user.userId,
      userId,
    );
    return { isFollowing };
  }
}
