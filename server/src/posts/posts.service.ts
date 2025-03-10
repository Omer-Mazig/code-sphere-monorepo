import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../users/entities/user.entity';
import { FindPostsDto } from './dto/find-posts.dto';

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
    // Ensure limit has a reasonable value
    // TODO: consider
    limit = Math.min(Math.max(1, limit), 50);

    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
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

    const lastPage = Math.ceil(total / limit);
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

    // Return both the posts and pagination metadata
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

  async findOne(id: string, currentUserId?: string) {
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .loadRelationCountAndMap('post.likesCount', 'post.likes')
      .loadRelationCountAndMap('post.commentsCount', 'post.comments')
      .where('post.id = :id', { id });

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

    // Increment view count
    await this.postRepository.update(id, {
      views: () => 'views + 1',
    });

    // Add isLikedByCurrentUser flag from raw result
    return {
      ...post,
      isLikedByCurrentUser: currentUserId
        ? !!result.raw[0]?.post_isLikedByCurrentUser
        : false,
    };
  }

  async create(createPostDto: CreatePostDto, userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const post = this.postRepository.create({
      ...createPostDto,
      authorId: userId,
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

    Object.assign(post, updatePostDto);
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
        queryBuilder.orderBy('post.publishedAt', 'DESC');
        break;
      case 'oldest':
        queryBuilder.orderBy('post.publishedAt', 'ASC');
        break;
      case 'popular':
        queryBuilder.orderBy('post.views', 'DESC');
        break;
      default:
        queryBuilder.orderBy('post.publishedAt', 'DESC');
    }

    return queryBuilder;
  }

  private checkOwnership(post: Post, userId: string) {
    if (post.authorId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to modify this post',
      );
    }
  }
}
