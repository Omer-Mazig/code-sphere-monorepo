import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const comment = this.commentsRepository.create(createCommentDto);
    return this.commentsRepository.save(comment);
  }

  async findAll(postId?: string): Promise<Comment[]> {
    if (postId) {
      return this.commentsRepository.find({
        where: { postId, parentId: IsNull() }, // Only top-level comments
        relations: ['author'],
        order: { createdAt: 'DESC' },
      });
    }
    return this.commentsRepository.find({
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    return comment;
  }

  async findReplies(id: string): Promise<Comment[]> {
    await this.findOne(id); // Check if parent comment exists

    return this.commentsRepository.find({
      where: { parentId: id },
      relations: ['author'],
      order: { createdAt: 'ASC' },
    });
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    await this.findOne(id); // Check if exists
    await this.commentsRepository.update(id, updateCommentDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.commentsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
  }
}
