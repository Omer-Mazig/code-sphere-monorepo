import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../users/entities/user.entity';
import { Like } from '../likes/entities/like.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    private readonly logger: Logger,
  ) {}

  async findAll(sort = 'newest', currentUserId?: string) {
    const order: Record<string, 'ASC' | 'DESC'> = {};

    switch (sort) {
      case 'newest':
        order.publishedAt = 'DESC';
        break;
      case 'oldest':
        order.publishedAt = 'ASC';
        break;
      case 'popular':
        order.views = 'DESC';
        break;
      default:
        order.publishedAt = 'DESC';
    }

    const posts = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .loadRelationCountAndMap('post.likesCount', 'post.likes')
      .loadRelationCountAndMap('post.commentsCount', 'post.comments')
      .orderBy(
        sort === 'newest'
          ? 'post.publishedAt'
          : sort === 'oldest'
            ? 'post.publishedAt'
            : 'post.views',
        sort === 'oldest' ? 'ASC' : 'DESC',
      )
      .getMany();

    // Enhance posts with like status
    return this.enhancePostsWithLikeStatus(posts, currentUserId);
  }

  async findByAuthor(authorId: string, currentUserId?: string) {
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .loadRelationCountAndMap('post.likesCount', 'post.likes')
      .loadRelationCountAndMap('post.commentsCount', 'post.comments')
      .where('post.authorId = :authorId', { authorId })
      .orderBy('post.publishedAt', 'DESC')
      .getMany();

    // Enhance posts with like status
    return this.enhancePostsWithLikeStatus(posts, currentUserId);
  }

  async findByTag(tag: string, currentUserId?: string) {
    // Get posts filtered by tag directly from database
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .loadRelationCountAndMap('post.likesCount', 'post.likes')
      .loadRelationCountAndMap('post.commentsCount', 'post.comments')
      .where(':tag = ANY (post.tags)', { tag }) // Filter by tag using PostgreSQL ANY operator
      .orderBy('post.publishedAt', 'DESC')
      .getMany();

    // Enhance posts with like status
    return this.enhancePostsWithLikeStatus(posts, currentUserId);
  }

  async findOne(id: string, currentUserId?: string) {
    const post = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .loadRelationCountAndMap('post.likesCount', 'post.likes')
      .loadRelationCountAndMap('post.commentsCount', 'post.comments')
      .where('post.id = :id', { id })
      .getOne();

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    // Increment view count
    post.views += 1;
    await this.postRepository.save(post);

    // Enhance post with like status
    const [enhancedPost] = await this.enhancePostsWithLikeStatus(
      [post],
      currentUserId,
    );
    return enhancedPost;
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

    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only update your own posts');
    }

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

    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.postRepository.remove(post);
    return { id };
  }

  /**
   * Add like status to posts for a specific user
   */
  private async enhancePostsWithLikeStatus(
    posts: Post[],
    currentUserId?: string,
  ) {
    this.logger.log(currentUserId);

    // If no user is authenticated, return posts without like status
    if (!currentUserId) {
      return posts.map((post) => ({
        ...post,
        isLikedByCurrentUser: false,
        // Ensure likesCount and commentsCount are preserved
        likesCount: post.likesCount || 0,
        commentsCount: post.commentsCount || 0,
      }));
    }

    // Get all post IDs
    const postIds = posts.map((post) => post.id);

    // If no posts, return empty array with like status
    if (postIds.length === 0) {
      return [];
    }

    // Find all likes by the current user for these posts
    const likes = await this.likeRepository.find({
      where: {
        userId: currentUserId,
        postId: In(postIds), // Use TypeORM's In operator for array of IDs
      },
    });

    // Create a set of postIds that the user has liked for quick lookup
    const likedPostIds = new Set(likes.map((like) => like.postId));

    // Add isLikedByCurrentUser flag to each post and preserve counts
    return posts.map((post) => ({
      ...post,
      isLikedByCurrentUser: likedPostIds.has(post.id),
      // Ensure likesCount and commentsCount are preserved
      likesCount: post.likesCount || 0,
      commentsCount: post.commentsCount || 0,
    }));
  }
}
