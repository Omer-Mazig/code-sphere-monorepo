import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ClerkService } from '../auth/providers/clerk.service';
import {
  ClerkUserId,
  InternalUserId,
  asClerkId,
  asInternalId,
} from './types/id-types';
import {
  UserNotFoundByClerkIdException,
  UserNotFoundByInternalIdException,
} from './exceptions/user-exceptions';

interface UserCacheEntry {
  user: User;
  timestamp: number;
}

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  // Simple user cache with 5-minute expiry
  private userByClerkIdCache: Map<string, UserCacheEntry> = new Map();
  private readonly CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private clerkService: ClerkService,
  ) {}

  /**
   * Get all users
   */
  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Find a user by internal ID
   * @param id Internal user ID
   */
  async findOne(id: InternalUserId): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new UserNotFoundByInternalIdException(id);
    }

    return user;
  }

  /**
   * Find a user by Clerk ID
   * @param clerkId Clerk user ID
   */
  async findByClerkId(clerkId: ClerkUserId | string): Promise<User> {
    // Normalize the clerkId to our branded type
    const normalizedClerkId =
      typeof clerkId === 'string' ? asClerkId(clerkId) : clerkId;

    const user = await this.usersRepository.findOne({
      where: { clerkId: normalizedClerkId },
    });

    if (!user) {
      throw new UserNotFoundByClerkIdException(normalizedClerkId);
    }

    return user;
  }

  /**
   * Create a new user
   * @param userData User data
   */
  async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  /**
   * Update a user by internal ID
   * @param id Internal user ID
   * @param userData Updated user data
   */
  async update(
    id: InternalUserId | string,
    userData: Partial<User>,
  ): Promise<User> {
    // Normalize the id to our branded type
    const normalizedId = typeof id === 'string' ? asInternalId(id) : id;

    // Check if user exists
    const user = await this.findOne(normalizedId);

    // Update user
    await this.usersRepository.update(normalizedId, userData);

    // Return updated user
    return this.findOne(normalizedId);
  }

  /**
   * Update a user by Clerk ID
   * @param clerkId Clerk user ID
   * @param userData Updated user data
   */
  async updateByClerkId(
    clerkId: ClerkUserId | string,
    userData: Partial<User>,
  ): Promise<User> {
    // Normalize the clerkId to our branded type
    const normalizedClerkId =
      typeof clerkId === 'string' ? asClerkId(clerkId) : clerkId;

    // Find user to ensure they exist
    const user = await this.findByClerkId(normalizedClerkId);

    // Update user
    await this.usersRepository.update({ clerkId: normalizedClerkId }, userData);

    // Return updated user
    return this.findByClerkId(normalizedClerkId);
  }

  /**
   * Delete a user by internal ID
   * @param id Internal user ID
   */
  async remove(id: InternalUserId | string): Promise<void> {
    // Normalize the id to our branded type
    const normalizedId = typeof id === 'string' ? asInternalId(id) : id;

    // Find user to get clerk ID for Clerk deletion
    const user = await this.findOne(normalizedId);

    // Delete user from database
    await this.usersRepository.delete(normalizedId);

    // Delete user from Clerk
    try {
      await this.clerkService.deleteClerkUser(user.clerkId);
      this.logger.log(`User deleted in Clerk: ${user.clerkId}`);
    } catch (error) {
      this.logger.error(
        `Failed to delete user in Clerk: ${error.message}`,
        error.stack,
      );
      // Continue since the database record is already deleted
    }
  }

  /**
   * Delete a user by Clerk ID
   * @param clerkId Clerk user ID
   * @param skipClerkDeletion Whether to skip deleting the user in Clerk
   */
  async removeByClerkId(
    clerkId: ClerkUserId | string,
    skipClerkDeletion = false,
  ): Promise<void> {
    // Normalize the clerkId to our branded type
    const normalizedClerkId =
      typeof clerkId === 'string' ? asClerkId(clerkId) : clerkId;

    // Find user to ensure they exist and get their internal ID
    const user = await this.findByClerkId(normalizedClerkId);

    // Delete user from database
    await this.usersRepository.delete({ clerkId: normalizedClerkId });

    // Delete user from Clerk if not skipped
    if (!skipClerkDeletion) {
      try {
        await this.clerkService.deleteClerkUser(normalizedClerkId);
        this.logger.log(`User deleted in Clerk: ${normalizedClerkId}`);
      } catch (error) {
        this.logger.error(
          `Failed to delete user in Clerk: ${error.message}`,
          error.stack,
        );
        // Continue since the database record is already deleted
      }
    }
  }

  /**
   * Follow a user
   * @param followerClerkId Clerk ID of the user who wants to follow
   * @param followingClerkId Clerk ID of the user to be followed
   */
  async followUser(
    followerClerkId: ClerkUserId | string,
    followingClerkId: ClerkUserId | string,
  ): Promise<void> {
    // Normalize the clerk IDs to our branded type
    const normalizedFollowerClerkId =
      typeof followerClerkId === 'string'
        ? asClerkId(followerClerkId)
        : followerClerkId;
    const normalizedFollowingClerkId =
      typeof followingClerkId === 'string'
        ? asClerkId(followingClerkId)
        : followingClerkId;

    const follower = await this.findByClerkId(normalizedFollowerClerkId);
    const following = await this.findByClerkId(normalizedFollowingClerkId);

    if (!follower.following) {
      follower.following = [];
    }

    // Check if already following
    const isAlreadyFollowing = follower.following.some(
      (user) => user.id === following.id,
    );

    if (!isAlreadyFollowing) {
      follower.following.push(following);
      await this.usersRepository.save(follower);
      this.logger.log(
        `User ${normalizedFollowerClerkId} now follows ${normalizedFollowingClerkId}`,
      );
    }
  }

  /**
   * Unfollow a user
   * @param followerClerkId Clerk ID of the user who wants to unfollow
   * @param followingClerkId Clerk ID of the user to be unfollowed
   */
  async unfollowUser(
    followerClerkId: ClerkUserId | string,
    followingClerkId: ClerkUserId | string,
  ): Promise<void> {
    // Normalize the clerk IDs to our branded type
    const normalizedFollowerClerkId =
      typeof followerClerkId === 'string'
        ? asClerkId(followerClerkId)
        : followerClerkId;
    const normalizedFollowingClerkId =
      typeof followingClerkId === 'string'
        ? asClerkId(followingClerkId)
        : followingClerkId;

    const follower = await this.findByClerkId(normalizedFollowerClerkId);
    const following = await this.findByClerkId(normalizedFollowingClerkId);

    if (!follower.following) {
      return; // Nothing to unfollow
    }

    follower.following = follower.following.filter(
      (user) => user.id !== following.id,
    );

    await this.usersRepository.save(follower);
    this.logger.log(
      `User ${normalizedFollowerClerkId} unfollowed ${normalizedFollowingClerkId}`,
    );
  }

  /**
   * Get a user's followers
   * @param clerkId Clerk ID of the user
   */
  async getFollowers(clerkId: ClerkUserId | string): Promise<User[]> {
    // Normalize the clerkId to our branded type
    const normalizedClerkId =
      typeof clerkId === 'string' ? asClerkId(clerkId) : clerkId;

    const user = await this.usersRepository.findOne({
      where: { clerkId: normalizedClerkId },
      relations: ['followers'],
    });

    if (!user) {
      throw new UserNotFoundByClerkIdException(normalizedClerkId);
    }

    return user.followers;
  }

  /**
   * Get users that a user is following
   * @param clerkId Clerk ID of the user
   */
  async getFollowing(clerkId: ClerkUserId | string): Promise<User[]> {
    // Normalize the clerkId to our branded type
    const normalizedClerkId =
      typeof clerkId === 'string' ? asClerkId(clerkId) : clerkId;

    const user = await this.usersRepository.findOne({
      where: { clerkId: normalizedClerkId },
      relations: ['following'],
    });

    if (!user) {
      throw new UserNotFoundByClerkIdException(normalizedClerkId);
    }

    return user.following;
  }
}
