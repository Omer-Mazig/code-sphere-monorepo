import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { EnrichedPost, ClerkAuthor } from './types/enriched-post.type';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async create(
    createPostDto: CreatePostDto,
    clerkUserId: string,
  ): Promise<Post> {
    const post = this.postsRepository.create({
      ...createPostDto,
      clerkUserId, // Set the Clerk user ID
    });
    return this.postsRepository.save(post);
  }

  async findAll(sort?: string, tag?: string): Promise<EnrichedPost[]> {
    this.logger.log(`Finding all posts with sort: ${sort}, tag: ${tag}`);

    const queryBuilder = this.postsRepository.createQueryBuilder('post');

    // Apply tag filter if provided
    if (tag) {
      queryBuilder.andWhere('post.tags LIKE :tag', { tag: `%${tag}%` });
    }

    // Apply sorting based on sort parameter
    switch (sort) {
      case 'popular':
        queryBuilder.orderBy('post.views', 'DESC');
        break;
      case 'latest':
      default:
        queryBuilder.orderBy('post.publishedAt', 'DESC');
        break;
    }

    const posts = await queryBuilder.getMany();
    this.logger.log(`Found ${posts.length} posts`);

    // Enrich posts with author data from Clerk
    return this.enrichPostsWithAuthors(posts);
  }

  async findOne(id: string): Promise<EnrichedPost> {
    this.logger.log(`Finding post with ID: ${id}`);

    const post = await this.postsRepository.findOne({
      where: { id },
    });

    if (!post) {
      this.logger.error(`Post with ID ${id} not found`);
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    // Increment views
    post.views += 1;
    await this.postsRepository.save(post);

    // Enrich with author data
    return this.enrichPostWithAuthor(post);
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
  ): Promise<EnrichedPost> {
    const post = await this.findOne(id); // Check if exists
    await this.postsRepository.update(id, updatePostDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.postsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
  }

  /**
   * Find all posts by a specific Clerk user ID
   * @param clerkUserId The Clerk user ID
   * @returns Array of posts with author data
   */
  async findByClerkUserId(clerkUserId: string): Promise<EnrichedPost[]> {
    try {
      this.logger.log(`Finding posts for user: ${clerkUserId}`);

      const posts = await this.postsRepository.find({
        where: { clerkUserId },
        order: { publishedAt: 'DESC' },
      });

      this.logger.log(`Found ${posts.length} posts for user ${clerkUserId}`);

      // Enrich with author data
      return this.enrichPostsWithAuthors(posts);
    } catch (error) {
      this.logger.error(`Error finding posts for user ${clerkUserId}:`, error);
      return [];
    }
  }

  // Utility methods to enrich posts with author data from Clerk
  private async enrichPostWithAuthor(post: Post): Promise<EnrichedPost> {
    try {
      if (post.clerkUserId) {
        this.logger.log(`Enriching post ${post.id} with author data`);

        const author = await clerkClient.users.getUser(post.clerkUserId);

        return {
          ...post,
          author: {
            id: author.id,
            firstName: author.firstName,
            lastName: author.lastName,
            email: author.emailAddresses[0]?.emailAddress,
            imageUrl: author.imageUrl,
            username: author.username,
          },
        };
      }
      return post;
    } catch (error) {
      this.logger.error(`Error fetching author for post ${post.id}:`, error);
      return post;
    }
  }

  private async enrichPostsWithAuthors(posts: Post[]): Promise<EnrichedPost[]> {
    if (posts.length === 0) {
      return [];
    }

    // Get unique Clerk user IDs
    const clerkUserIds = [...new Set(posts.map((post) => post.clerkUserId))];
    this.logger.log(
      `Enriching posts with authors. Unique authors: ${clerkUserIds.length}`,
    );

    try {
      // Batch fetch users
      const userList = await clerkClient.users.getUserList({
        userId: clerkUserIds,
      });

      // Create a map for quick lookup
      const userMap = new Map();
      userList.data.forEach((user) => userMap.set(user.id, user));

      // Enrich posts
      return posts.map((post) => {
        const author = userMap.get(post.clerkUserId);

        if (author) {
          return {
            ...post,
            author: {
              id: author.id,
              firstName: author.firstName,
              lastName: author.lastName,
              email: author.emailAddresses[0]?.emailAddress,
              imageUrl: author.imageUrl,
              username: author.username,
            },
          };
        }

        return post;
      });
    } catch (error) {
      this.logger.error('Error fetching authors for posts:', error);
      return posts;
    }
  }
}
