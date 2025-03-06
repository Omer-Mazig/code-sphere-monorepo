import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(sort = 'newest') {
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

    return this.postRepository.find({
      relations: ['author', 'likes', 'comments'],
      order,
    });
  }

  async findByAuthor(authorId: string) {
    return this.postRepository.find({
      where: {
        authorId,
      },
      relations: ['author', 'likes', 'comments'],
      order: {
        publishedAt: 'DESC',
      },
    });
  }

  async findByTag(tag: string) {
    // Since tags are stored as an array, we need to search for posts
    // that include the tag in their tags array
    const posts = await this.postRepository.find({
      relations: ['author', 'likes', 'comments'],
      order: {
        publishedAt: 'DESC',
      },
    });

    // Filter posts that have the tag
    return posts.filter((post) => post.tags.includes(tag));
  }

  async findOne(id: string) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author', 'likes', 'comments'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    // Increment view count
    post.views += 1;
    await this.postRepository.save(post);

    return post;
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
}
