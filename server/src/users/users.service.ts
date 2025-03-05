import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByClerkId(clerkId: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { clerkId } });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, userData);
    return this.usersRepository.save(user);
  }

  async updateByClerkId(
    clerkId: string,
    userData: Partial<User>,
  ): Promise<User> {
    const user = await this.findByClerkId(clerkId);
    if (!user) {
      throw new NotFoundException(`User with Clerk ID ${clerkId} not found`);
    }
    Object.assign(user, userData);
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  async followUser(
    followerClerkId: string,
    followingClerkId: string,
  ): Promise<void> {
    const follower = await this.findByClerkId(followerClerkId);
    const following = await this.findByClerkId(followingClerkId);

    if (!follower || !following) {
      throw new NotFoundException('One or both users not found');
    }

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
        `User ${followerClerkId} now follows ${followingClerkId}`,
      );
    }
  }

  async unfollowUser(
    followerClerkId: string,
    followingClerkId: string,
  ): Promise<void> {
    const follower = await this.findByClerkId(followerClerkId);
    const following = await this.findByClerkId(followingClerkId);

    if (!follower || !following) {
      throw new NotFoundException('One or both users not found');
    }

    if (!follower.following) {
      return; // Nothing to unfollow
    }

    follower.following = follower.following.filter(
      (user) => user.id !== following.id,
    );

    await this.usersRepository.save(follower);
    this.logger.log(`User ${followerClerkId} unfollowed ${followingClerkId}`);
  }

  async getFollowers(clerkId: string): Promise<User[]> {
    const user = await this.usersRepository.findOne({
      where: { clerkId },
      relations: ['followers'],
    });

    if (!user) {
      throw new NotFoundException(`User with Clerk ID ${clerkId} not found`);
    }

    return user.followers;
  }

  async getFollowing(clerkId: string): Promise<User[]> {
    const user = await this.usersRepository.findOne({
      where: { clerkId },
      relations: ['following'],
    });

    if (!user) {
      throw new NotFoundException(`User with Clerk ID ${clerkId} not found`);
    }

    return user.following;
  }
}
