import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from './entities/follow.entity';
import { CreateFollowDto } from './dto/create-follow.dto';
import { clerkClient } from '@clerk/clerk-sdk-node';

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
  ) {}

  async followUser(
    followerClerkId: string,
    createFollowDto: CreateFollowDto,
  ): Promise<Follow> {
    const { followingClerkId } = createFollowDto;

    // Prevent users from following themselves
    if (followerClerkId === followingClerkId) {
      throw new ConflictException('You cannot follow yourself');
    }

    // Check if the user to follow exists in Clerk
    try {
      await clerkClient.users.getUser(followingClerkId);
    } catch (error) {
      throw new NotFoundException(
        `User to follow with ID ${followingClerkId} not found`,
      );
    }

    // Check if already following
    const existingFollow = await this.followRepository.findOne({
      where: { followerClerkId, followingClerkId },
    });

    if (existingFollow) {
      throw new ConflictException('You are already following this user');
    }

    // Create the follow relationship
    const follow = this.followRepository.create({
      followerClerkId,
      followingClerkId,
    });

    return this.followRepository.save(follow);
  }

  async unfollowUser(
    followerClerkId: string,
    followingClerkId: string,
  ): Promise<void> {
    const follow = await this.followRepository.findOne({
      where: { followerClerkId, followingClerkId },
    });

    if (!follow) {
      throw new NotFoundException('You are not following this user');
    }

    await this.followRepository.remove(follow);
  }

  async getFollowers(clerkUserId: string): Promise<Follow[]> {
    return this.followRepository.find({
      where: { followingClerkId: clerkUserId },
    });
  }

  async getFollowing(clerkUserId: string): Promise<Follow[]> {
    return this.followRepository.find({
      where: { followerClerkId: clerkUserId },
    });
  }

  async getFollowersCount(clerkUserId: string): Promise<number> {
    return this.followRepository.count({
      where: { followingClerkId: clerkUserId },
    });
  }

  async getFollowingCount(clerkUserId: string): Promise<number> {
    return this.followRepository.count({
      where: { followerClerkId: clerkUserId },
    });
  }

  async isFollowing(
    followerClerkId: string,
    followingClerkId: string,
  ): Promise<boolean> {
    const count = await this.followRepository.count({
      where: { followerClerkId, followingClerkId },
    });
    return count > 0;
  }
}
