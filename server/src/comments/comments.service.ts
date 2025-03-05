import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { EnrichedComment, ClerkAuthor } from './types/enriched-comment.type';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    clerkUserId: string,
  ): Promise<EnrichedComment> {
    const comment = this.commentsRepository.create({
      ...createCommentDto,
      clerkUserId,
    });
    const savedComment = await this.commentsRepository.save(comment);
    return this.enrichCommentWithAuthor(savedComment);
  }

  async findAll(postId?: string): Promise<EnrichedComment[]> {
    let comments: Comment[];

    if (postId) {
      comments = await this.commentsRepository.find({
        where: { postId, parentId: IsNull() }, // Only top-level comments
        order: { createdAt: 'DESC' },
      });
    } else {
      comments = await this.commentsRepository.find({
        order: { createdAt: 'DESC' },
      });
    }

    return this.enrichCommentsWithAuthors(comments);
  }

  async findOne(id: string): Promise<EnrichedComment> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    return this.enrichCommentWithAuthor(comment);
  }

  async findReplies(id: string): Promise<EnrichedComment[]> {
    await this.findOne(id); // Check if parent comment exists

    const replies = await this.commentsRepository.find({
      where: { parentId: id },
      order: { createdAt: 'ASC' },
    });

    return this.enrichCommentsWithAuthors(replies);
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<EnrichedComment> {
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

  // Utility methods to enrich comments with author data from Clerk
  private async enrichCommentWithAuthor(
    comment: Comment,
  ): Promise<EnrichedComment> {
    try {
      if (comment.clerkUserId) {
        const author = await clerkClient.users.getUser(comment.clerkUserId);

        return {
          ...comment,
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
      return comment;
    } catch (error) {
      console.error(`Error fetching author for comment ${comment.id}:`, error);
      return comment;
    }
  }

  private async enrichCommentsWithAuthors(
    comments: Comment[],
  ): Promise<EnrichedComment[]> {
    // Get unique Clerk user IDs
    const clerkUserIds = [
      ...new Set(comments.map((comment) => comment.clerkUserId)),
    ];

    try {
      // Batch fetch users
      const userList = await clerkClient.users.getUserList({
        userId: clerkUserIds,
      });

      // Create a map for quick lookup
      const userMap = new Map();
      userList.data.forEach((user) => userMap.set(user.id, user));

      // Enrich comments
      return comments.map((comment) => {
        const author = userMap.get(comment.clerkUserId);

        if (author) {
          return {
            ...comment,
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

        return comment;
      });
    } catch (error) {
      console.error('Error fetching authors for comments:', error);
      return comments;
    }
  }
}
