import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { CreateLikeDto } from './dto/create-like.dto';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
  ) {}

  async create(createLikeDto: CreateLikeDto): Promise<Like> {
    // Check if like already exists
    const exists = await this.likesRepository.findOne({
      where: {
        userId: createLikeDto.userId,
        ...(createLikeDto.postId ? { postId: createLikeDto.postId } : {}),
        ...(createLikeDto.commentId
          ? { commentId: createLikeDto.commentId }
          : {}),
      },
    });

    if (exists) {
      return exists;
    }

    const like = this.likesRepository.create(createLikeDto);
    return this.likesRepository.save(like);
  }

  async remove(id: string): Promise<void> {
    const result = await this.likesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Like with ID ${id} not found`);
    }
  }
}
