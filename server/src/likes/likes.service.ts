import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { CreateLikeDto } from './dto/create-like.dto';
import { Not, IsNull } from 'typeorm';

@Injectable()
export class LikesService {
  private readonly logger = new Logger(LikesService.name);

  constructor(
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
  ) {}

  async create(
    createLikeDto: CreateLikeDto,
    clerkUserId: string,
  ): Promise<Like> {
    // Check if like already exists
    const exists = await this.likesRepository.findOne({
      where: {
        clerkUserId,
        ...(createLikeDto.postId ? { postId: createLikeDto.postId } : {}),
        ...(createLikeDto.commentId
          ? { commentId: createLikeDto.commentId }
          : {}),
      },
    });

    if (exists) {
      throw new ConflictException('You have already liked this item');
    }

    const like = this.likesRepository.create({
      ...createLikeDto,
      clerkUserId,
    });
    return this.likesRepository.save(like);
  }

  async findByUser(clerkUserId: string): Promise<Like[]> {
    return this.likesRepository.find({
      where: { clerkUserId },
      relations: ['post', 'comment'],
    });
  }

  async findByUserAndPost(
    clerkUserId: string,
    postId: string,
  ): Promise<Like | null> {
    return this.likesRepository.findOne({
      where: { clerkUserId, postId },
    });
  }

  async findByUserAndComment(
    clerkUserId: string,
    commentId: string,
  ): Promise<Like | null> {
    return this.likesRepository.findOne({
      where: { clerkUserId, commentId },
    });
  }

  async findOne(id: string): Promise<Like> {
    const like = await this.likesRepository.findOne({
      where: { id },
    });

    if (!like) {
      throw new NotFoundException(`Like with ID ${id} not found`);
    }

    return like;
  }

  async remove(id: string): Promise<void> {
    const result = await this.likesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Like with ID ${id} not found`);
    }
  }

  async removeByUserAndPost(
    clerkUserId: string,
    postId: string,
  ): Promise<void> {
    const like = await this.findByUserAndPost(clerkUserId, postId);
    if (!like) {
      throw new NotFoundException('Like not found');
    }
    await this.likesRepository.remove(like);
  }

  async removeByUserAndComment(
    clerkUserId: string,
    commentId: string,
  ): Promise<void> {
    const like = await this.findByUserAndComment(clerkUserId, commentId);
    if (!like) {
      throw new NotFoundException('Like not found');
    }
    await this.likesRepository.remove(like);
  }

  /**
   * Get all post IDs that a user has liked
   * @param clerkUserId The Clerk user ID
   * @returns Array of post IDs that the user has liked
   */
  async getUserLikedPosts(clerkUserId: string): Promise<string[]> {
    try {
      this.logger.log(`Fetching liked posts for user: ${clerkUserId}`);

      const likes = await this.likesRepository.find({
        where: {
          clerkUserId,
          postId: Not(IsNull()),
        },
        select: ['postId'],
      });

      const postIds = likes.map((like) => like.postId);
      this.logger.log(
        `Found ${postIds.length} liked posts for user ${clerkUserId}`,
      );

      return postIds;
    } catch (error) {
      this.logger.error(
        `Error fetching liked posts for user ${clerkUserId}:`,
        error,
      );
      return [];
    }
  }
}
