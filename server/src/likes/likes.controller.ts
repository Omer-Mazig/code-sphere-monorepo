import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { CurrentUser } from '../auth/decoarators/current-user.decorator';
import { Public } from '../auth/decoarators/public.decorator';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Get()
  @Public()
  findAll(
    @Query('postId') postId?: string,
    @Query('commentId') commentId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    if (postId) {
      return this.likesService.findByPostId(postId, page || 1, limit || 10);
    }

    if (commentId) {
      return this.likesService.findByCommentId(commentId);
    }

    return this.likesService.findAll();
  }

  @Post()
  create(
    @Body() createLikeDto: CreateLikeDto,
    @CurrentUser() currentUser?: any,
  ) {
    return this.likesService.create(createLikeDto, currentUser.id);
  }

  @Delete('post/:postId')
  removePostLike(
    @Param('postId') postId: string,
    @CurrentUser() currentUser?: any,
  ) {
    return this.likesService.removePostLike(postId, currentUser.id);
  }

  @Delete('comment/:commentId')
  removeCommentLike(
    @Param('commentId') commentId: string,
    @CurrentUser() currentUser?: any,
  ) {
    return this.likesService.removeCommentLike(commentId, currentUser.id);
  }
}
