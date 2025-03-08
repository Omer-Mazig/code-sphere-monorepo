import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
  BadRequestException,
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
        // This should never be reached due to the validSort check above
        order.publishedAt = 'DESC';
    }

    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .loadRelationCountAndMap('post.likesCount', 'post.likes')
      .loadRelationCountAndMap('post.commentsCount', 'post.comments');

    // Only apply tag filter if a tag is provided
    if (tag) {
      queryBuilder.where('post.tags @> ARRAY[:...tags]', { tags: [tag] });
    }

    queryBuilder.orderBy(
      sort === 'newest'
        ? 'post.publishedAt'
        : sort === 'oldest'
          ? 'post.publishedAt'
          : 'post.views',
      sort === 'oldest' ? 'ASC' : 'DESC',
    );

    const posts = await queryBuilder.getMany();

    return this.enhancePostsWithCurrentUserStatus(posts, currentUserId);
  }

  async findOne(id: string, currentUserId?: string) {
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .loadRelationCountAndMap('post.likesCount', 'post.likes')
      .loadRelationCountAndMap('post.commentsCount', 'post.comments')
      .where('post.id = :id', { id });

    const post = await queryBuilder.getOne();

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    // Increment view count
    post.views += 1;
    await this.postRepository.save(post);

    // Get enhanced post with like status
    const [enhancedPost] = await this.enhancePostsWithCurrentUserStatus(
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
   * Add isLikedByCurrentUser flag to posts for a specific user
   */
  private async enhancePostsWithCurrentUserStatus(
    posts: Post[],
    currentUserId?: string,
  ) {
    // If no user is authenticated, return posts without like status
    if (!currentUserId) {
      return posts.map((post) => ({
        ...post,
        isLikedByCurrentUser: false,
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

    // Add isLikedByCurrentUser flag to each post
    return posts.map((post) => ({
      ...post,
      isLikedByCurrentUser: likedPostIds.has(post.id),
    }));
  }
}
