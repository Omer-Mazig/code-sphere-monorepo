import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../users/entities/user.entity';
import { FindPostsDto } from './dto/find-posts.dto';
import { POST_STATUS } from 'shared/constants/posts.constants';
import { tags } from 'shared/constants/tags.constants';
import { Tag } from 'shared/types/tags.types';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(
    { sort = 'newest', tag, page = 1, limit = 10 }: FindPostsDto,
    currentUserId?: string,
  ) {
    limit = Math.min(Math.max(1, limit), 50);

    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .where('post.status = :status', { status: POST_STATUS.PUBLISHED })
      .leftJoinAndSelect('post.author', 'author')
      .loadRelationCountAndMap('post.likesCount', 'post.likes')
      .loadRelationCountAndMap('post.commentsCount', 'post.comments');

    if (currentUserId) {
      queryBuilder
        .leftJoin(
          'likes',
          'currentUserLike',
          'currentUserLike.postId = post.id AND currentUserLike.userId = :currentUserId',
          { currentUserId },
        )
        .addSelect(
          'CASE WHEN currentUserLike.id IS NOT NULL THEN TRUE ELSE FALSE END',
          'post_isLikedByCurrentUser',
        );
    }

    if (tag) {
      queryBuilder.where('post.tags LIKE :tag', { tag: `%${tag}%` });
    }

    await this.sortPosts(queryBuilder, sort);

    queryBuilder.skip((page - 1) * limit).take(limit);

    const [posts, total] = await Promise.all([
      queryBuilder.getRawAndEntities(),
      queryBuilder.getCount(),
    ]);

    const lastPage = Math.ceil(total / limit) || 1;
    const hasMore = page < lastPage;
    const nextPage = hasMore ? page + 1 : null;

    // The query returns two parts:
    // 1. posts.entities - The Post entities with their relations (author, likes count, etc)
    // 2. posts.raw - Raw query results containing our custom selected fields
    const formattedPosts = posts.entities.map((post, index) => ({
      ...post,
      isLikedByCurrentUser: currentUserId
        ? !!posts.raw[index]?.post_isLikedByCurrentUser
        : false,
    }));

    return {
      posts: formattedPosts,
      pagination: {
        total,
        page,
        limit,
        lastPage,
        hasMore,
        nextPage,
      },
    };
  }

  async findOneForDetail(id: string, currentUserId?: string) {
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .loadRelationCountAndMap('post.likesCount', 'post.likes')
      .loadRelationCountAndMap('post.commentsCount', 'post.comments')
      .where('post.id = :id', { id });

    // throw new NotFoundException('test');

    // Add check if the current user has liked this post
    if (currentUserId) {
      queryBuilder
        .leftJoin(
          'likes',
          'currentUserLike',
          'currentUserLike.postId = post.id AND currentUserLike.userId = :currentUserId',
          { currentUserId },
        )
        .addSelect(
          'CASE WHEN currentUserLike.id IS NOT NULL THEN TRUE ELSE FALSE END',
          'post_isLikedByCurrentUser',
        );
    }

    const result = await queryBuilder.getRawAndEntities();

    if (!result.entities[0]) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    const post = result.entities[0];

    await this.postRepository.update(id, {
      views: () => 'views + 1',
    });

    return {
      ...post,
      isLikedByCurrentUser: currentUserId
        ? !!result.raw[0]?.post_isLikedByCurrentUser
        : false,
    };
  }

  /**
   * Find a post for editing without incrementing view count
   * Only the post author can access this endpoint
   */
  async findOneForEdit(id: string, userId: string) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    this.checkOwnership(post, userId);

    return post;
  }

  async create(createPostDto: CreatePostDto, userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const { tags: tagValues, ...values } = createPostDto;
    const validTags = tagValues
      .map((tag) => tags.find((t) => t.value === tag.value))
      .filter((tag): tag is Tag => tag !== undefined);

    const post = this.postRepository.create({
      authorId: userId,
      author: user,
      ...values,
      tags: validTags,
    });

    return this.postRepository.save(post);
  }

  async update(id: string, updatePostDto: UpdatePostDto, userId: string) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    this.checkOwnership(post, userId);

    // Handle tag updates if any
    if (updatePostDto.tags) {
      const validTags = updatePostDto.tags
        .map((tag) => tags.find((t) => t.value === tag.value))
        .filter((tag): tag is Tag => tag !== undefined);

      // First apply the DTO to post, then set tags separately
      Object.assign(post, updatePostDto);
      post.tags = validTags;
    } else {
      Object.assign(post, updatePostDto);
    }

    return this.postRepository.save(post);
  }

  async remove(id: string, userId: string) {
    const post = await this.postRepository.findOne({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    this.checkOwnership(post, userId);

    await this.postRepository.remove(post);
    return { id };
  }

  async sortPosts(queryBuilder: SelectQueryBuilder<Post>, sort: string) {
    switch (sort) {
      case 'newest':
        queryBuilder.orderBy('post.createdAt', 'DESC');
        break;
      case 'oldest':
        queryBuilder.orderBy('post.createdAt', 'ASC');
        break;
      case 'popular':
        queryBuilder.orderBy('post.views', 'DESC');
        break;
      default:
        queryBuilder.orderBy('post.createdAt', 'DESC');
    }

    return queryBuilder;
  }

  private checkOwnership(post: Post, userId: string) {
    if (post.authorId !== userId) {
      this.logger.error(
        `User ${userId} attempted to modify post ${post.id} but does not own it`,
      );
      throw new ForbiddenException(
        'You do not have permission to modify this post',
      );
    }
  }
}
