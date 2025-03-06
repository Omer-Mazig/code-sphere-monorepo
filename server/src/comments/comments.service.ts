import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll() {
    return this.commentRepository.find({
      relations: ['author', 'post', 'parent', 'replies', 'likes'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findByPostId(postId: string) {
    return this.commentRepository.find({
      where: {
        post: {
          id: postId,
        },
      },
      relations: ['author', 'parent', 'replies', 'likes'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findReplies(parentId: string) {
    return this.commentRepository.find({
      where: {
        parent: {
          id: parentId,
        },
      },
      relations: ['author', 'likes'],
      order: {
        createdAt: 'ASC',
      },
    });
  }

  async findOne(id: string) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author', 'post', 'parent', 'replies', 'likes'],
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    return comment;
  }

  async create(createCommentDto: CreateCommentDto, userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // If this is a reply, check if the parent comment exists
    if (createCommentDto.parentId) {
      const parentComment = await this.commentRepository.findOne({
        where: { id: createCommentDto.parentId },
      });

      if (!parentComment) {
        throw new NotFoundException(
          `Parent comment with ID ${createCommentDto.parentId} not found`,
        );
      }
    }

    const comment = this.commentRepository.create({
      ...createCommentDto,
      authorId: userId,
    });

    return this.commentRepository.save(comment);
  }

  async update(id: string, updateCommentDto: UpdateCommentDto, userId: string) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    if (comment.authorId !== userId) {
      throw new ForbiddenException('You can only update your own comments');
    }

    Object.assign(comment, updateCommentDto);
    return this.commentRepository.save(comment);
  }

  async remove(id: string, userId: string) {
    const comment = await this.commentRepository.findOne({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    if (comment.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.commentRepository.remove(comment);
    return { id };
  }
}
