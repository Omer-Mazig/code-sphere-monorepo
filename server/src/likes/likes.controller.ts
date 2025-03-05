import {
  Controller,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Get,
  ForbiddenException,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { ClerkAuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('likes')
@UseGuards(ClerkAuthGuard)
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  create(@Body() createLikeDto: CreateLikeDto, @CurrentUser() user: any) {
    return this.likesService.create(createLikeDto, user.userId);
  }

  @Get('my')
  findMyLikes(@CurrentUser() user: any) {
    return this.likesService.findByUser(user.userId);
  }

  @Post('post/:postId')
  likePost(@Param('postId') postId: string, @CurrentUser() user: any) {
    const createLikeDto: CreateLikeDto = { postId };
    return this.likesService.create(createLikeDto, user.userId);
  }

  @Delete('post/:postId')
  unlikePost(@Param('postId') postId: string, @CurrentUser() user: any) {
    return this.likesService.removeByUserAndPost(user.userId, postId);
  }

  @Post('comment/:commentId')
  likeComment(@Param('commentId') commentId: string, @CurrentUser() user: any) {
    const createLikeDto: CreateLikeDto = { commentId };
    return this.likesService.create(createLikeDto, user.userId);
  }

  @Delete('comment/:commentId')
  unlikeComment(
    @Param('commentId') commentId: string,
    @CurrentUser() user: any,
  ) {
    return this.likesService.removeByUserAndComment(user.userId, commentId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    // Get the like first to check ownership
    const like = await this.likesService.findOne(id);

    // Check if the user is the owner of the like
    if (like.clerkUserId !== user.userId) {
      throw new ForbiddenException('You can only remove your own likes');
    }

    return this.likesService.remove(id);
  }
}
