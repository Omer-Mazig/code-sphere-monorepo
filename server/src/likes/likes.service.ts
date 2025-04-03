import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { CreateLikeDto } from './dto/create-like.dto';
import { User } from '../users/entities/user.entity';
import { Post } from '../posts/entities/post.entity';
import { Comment } from '../comments/entities/comment.entity';
import { PaginatedResponse } from 'shared/schemas/pagination.schema';
import { PaginationService } from '../common/services/pagination.service';
import { Logger } from '@nestjs/common';
@Injectable()
export class LikesService {
  private readonly logger = new Logger(LikesService.name);
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly paginationService: PaginationService,
  ) {}

  async findAll() {
    return this.likeRepository.find({
      relations: ['user', 'post', 'comment'],
    });
  }

  async findByPostId(
    postId: string,
    page = 1,
    limit = 10,
  ): Promise<PaginatedResponse<Like>> {
    const { page: sanitizedPage, limit: sanitizedLimit } =
      this.paginationService.sanitizePaginationParams(page, limit);

    const [likes, total] = await this.likeRepository.findAndCount({
      where: {
        postId,
      },
      relations: ['user'],
      skip: (sanitizedPage - 1) * sanitizedLimit,
      take: sanitizedLimit,
      order: {
        createdAt: 'DESC',
      },
    });

    return this.paginationService.createPaginatedResponse(
      likes,
      total,
      sanitizedPage,
      sanitizedLimit,
    );
  }

  async findByCommentId(commentId: string) {
    return this.likeRepository.find({
      where: {
        commentId,
      },
      relations: ['user'],
    });
  }

  async create(createLikeDto: CreateLikeDto, userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Check if it's a post like
    if (createLikeDto.postId) {
      const post = await this.postRepository.findOne({
        where: { id: createLikeDto.postId },
      });

      if (!post) {
        throw new NotFoundException(
          `Post with ID ${createLikeDto.postId} not found`,
        );
      }

      // Check if user already liked this post
      const existingLike = await this.likeRepository.findOne({
        where: {
          userId,
          postId: createLikeDto.postId,
        },
      });

      if (existingLike) {
        throw new ConflictException('User already liked this post');
      }
    }

    // Check if it's a comment like
    if (createLikeDto.commentId) {
      const comment = await this.commentRepository.findOne({
        where: { id: createLikeDto.commentId },
      });

      if (!comment) {
        throw new NotFoundException(
          `Comment with ID ${createLikeDto.commentId} not found`,
        );
      }

      // Check if user already liked this comment
      const existingLike = await this.likeRepository.findOne({
        where: {
          userId,
          commentId: createLikeDto.commentId,
        },
      });

      if (existingLike) {
        throw new ConflictException('User already liked this comment');
      }
    }

    const like = this.likeRepository.create({
      ...createLikeDto,
      userId,
    });

    const savedLike = await this.likeRepository.save(like);

    return this.likeRepository.findOne({
      where: { id: savedLike.id },
      relations: { user: true },
    });
  }

  async removePostLike(postId: string, userId: string) {
    const like = await this.likeRepository.findOne({
      where: {
        userId,
        postId,
      },
    });

    if (!like) {
      throw new NotFoundException(
        `Like not found for post ${postId} by user ${userId}`,
      );
    }

    await this.likeRepository.remove(like);
    return { success: true };
  }

  async removeCommentLike(commentId: string, userId: string) {
    const like = await this.likeRepository.findOne({
      where: {
        userId,
        commentId,
      },
    });

    if (!like) {
      throw new NotFoundException(
        `Like not found for comment ${commentId} by user ${userId}`,
      );
    }

    await this.likeRepository.remove(like);
    return { success: true };
  }

  async hasLikedPost(postId: string, userId: string) {
    const like = await this.likeRepository.findOne({
      where: {
        userId,
        postId,
      },
    });

    return { hasLiked: !!like };
  }

  async hasLikedComment(commentId: string, userId: string) {
    const like = await this.likeRepository.findOne({
      where: {
        userId,
        commentId,
      },
    });

    return { hasLiked: !!like };
  }
}
