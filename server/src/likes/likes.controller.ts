import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Query,
  Req,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { Request } from 'express';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Get()
  findAll(
    @Query('postId') postId?: string,
    @Query('commentId') commentId?: string,
    @Query('userId') userId?: string,
  ) {
    if (postId) {
      return this.likesService.findByPostId(postId);
    }

    if (commentId) {
      return this.likesService.findByCommentId(commentId);
    }

    if (userId) {
      return this.likesService.findByUserId(userId);
    }

    return this.likesService.findAll();
  }

  @Post()
  create(@Body() createLikeDto: CreateLikeDto, @Req() req: Request) {
    // @ts-ignore - using userId from authenticated request
    return this.likesService.create(createLikeDto, req.user.id);
  }

  @Delete('post/:postId')
  removePostLike(@Param('postId') postId: string, @Req() req: Request) {
    // @ts-ignore - using userId from authenticated request
    return this.likesService.removePostLike(postId, req.user.id);
  }

  @Delete('comment/:commentId')
  removeCommentLike(
    @Param('commentId') commentId: string,
    @Req() req: Request,
  ) {
    // @ts-ignore - using userId from authenticated request
    return this.likesService.removeCommentLike(commentId, req.user.id);
  }
}
