import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, SelectQueryBuilder } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../users/entities/user.entity';
import { Like } from '../likes/entities/like.entity';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
  ) {}

  async findAll(
    { sort = 'newest', tag }: { sort?: string; tag?: string },
    currentUserId?: string,
  ) {
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .loadRelationCountAndMap('post.likesCount', 'post.likes')
      .loadRelationCountAndMap('post.commentsCount', 'post.comments');

    // Add check if the current user has liked each post
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
      // Fix for filtering by tag with simple-array column type
      queryBuilder.where('post.tags LIKE :tag', { tag: `%${tag}%` });
    }

    await this.sortPosts(queryBuilder, sort);

    const posts = await queryBuilder.getRawAndEntities();

    // Combine the raw results (which contain our custom selection) with the entity results
    return posts.entities.map((post, index) => ({
      ...post,
      isLikedByCurrentUser: currentUserId
        ? !!posts.raw[index]?.post_isLikedByCurrentUser
        : false,
    }));
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
