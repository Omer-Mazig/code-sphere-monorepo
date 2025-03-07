import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import {
  ClerkUserId,
  InternalUserId,
  asClerkId,
  asInternalId,
} from '../types/id-types';
import {
  UserNotFoundByClerkIdException,
  UserNotFoundByInternalIdException,
} from '../exceptions/user-exceptions';

/**
 * Service responsible for mapping between different user ID types
 * This abstraction layer centralizes ID conversion logic
 */
@Injectable()
export class UserIdMapperService {
  private readonly logger = new Logger(UserIdMapperService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Find an internal user ID by Clerk ID
   * @param clerkId The Clerk user ID
   * @returns The internal user ID
   * @throws UserNotFoundByClerkIdException if user not found
   */
  async getInternalIdFromClerkId(
    clerkId: ClerkUserId,
  ): Promise<InternalUserId> {
    const user = await this.usersRepository.findOne({
      where: { clerkId },
      select: ['id'],
    });

    if (!user) {
      this.logger.warn(`Failed to find user with Clerk ID: ${clerkId}`);
      throw new UserNotFoundByClerkIdException(clerkId);
    }

    return asInternalId(user.id);
  }

  /**
   * Find a Clerk ID by internal user ID
   * @param internalId The internal user ID
   * @returns The Clerk user ID
   * @throws UserNotFoundByInternalIdException if user not found
   */
  async getClerkIdFromInternalId(
    internalId: InternalUserId,
  ): Promise<ClerkUserId> {
    const user = await this.usersRepository.findOne({
      where: { id: internalId },
      select: ['clerkId'],
    });

    if (!user) {
      this.logger.warn(`Failed to find user with internal ID: ${internalId}`);
      throw new UserNotFoundByInternalIdException(internalId);
    }

    return asClerkId(user.clerkId);
  }

  /**
   * Find a user by Clerk ID
   * @param clerkId The Clerk user ID
   * @returns The user entity
   * @throws UserNotFoundByClerkIdException if user not found
   */
  async getUserByClerkId(clerkId: ClerkUserId): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { clerkId },
    });

    if (!user) {
      this.logger.warn(`Failed to find user with Clerk ID: ${clerkId}`);
      throw new UserNotFoundByClerkIdException(clerkId);
    }

    return user;
  }

  /**
   * Find a user by internal ID
   * @param internalId The internal user ID
   * @returns The user entity
   * @throws UserNotFoundByInternalIdException if user not found
   */
  async getUserByInternalId(internalId: InternalUserId): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: internalId },
    });

    if (!user) {
      this.logger.warn(`Failed to find user with internal ID: ${internalId}`);
      throw new UserNotFoundByInternalIdException(internalId);
    }

    return user;
  }
}
