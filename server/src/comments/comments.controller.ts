import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Request } from 'express';

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

  // TODO: find better naming
  @Get()
  getCommentsForPostCardDialog() {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }

  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @Req() req: Request) {
    // @ts-ignore - using userId from authenticated request
    return this.commentsService.create(createCommentDto, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req: Request,
  ) {
    // @ts-ignore - using userId from authenticated request
    return this.commentsService.update(id, updateCommentDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    // @ts-ignore - using userId from authenticated request
    return this.commentsService.remove(id, req.user.id);
  }
}
