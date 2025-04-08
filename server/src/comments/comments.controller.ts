import { Controller, Get, Param, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  getCommentsForPostDetail(
    @Query('postId') postId?: string,
    @Query('parentId') parentId?: string,
  ) {
    if (postId) {
      return this.commentsService.findByPostId(postId);
    }

    if (parentId) {
      return this.commentsService.findReplies(parentId);
    }

    return this.commentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }
}
