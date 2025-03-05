import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ClerkAuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { EnrichedComment } from './types/enriched-comment.type';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(ClerkAuthGuard)
  create(
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: any,
  ): Promise<EnrichedComment> {
    return this.commentsService.create(createCommentDto, user.userId);
  }

  @Get()
  findAll(@Query('postId') postId?: string): Promise<EnrichedComment[]> {
    return this.commentsService.findAll(postId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<EnrichedComment> {
    return this.commentsService.findOne(id);
  }

  @Get(':id/replies')
  findReplies(@Param('id') id: string): Promise<EnrichedComment[]> {
    return this.commentsService.findReplies(id);
  }

  @Patch(':id')
  @UseGuards(ClerkAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @CurrentUser() user: any,
  ): Promise<EnrichedComment> {
    // Get the comment to check ownership
    const comment = await this.commentsService.findOne(id);

    // Check if the user is the author
    if (comment.clerkUserId !== user.userId) {
      throw new ForbiddenException('You can only update your own comments');
    }

    return this.commentsService.update(id, updateCommentDto);
  }

  @Delete(':id')
  @UseGuards(ClerkAuthGuard)
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    // Get the comment to check ownership
    const comment = await this.commentsService.findOne(id);

    // Check if the user is the author
    if (comment.clerkUserId !== user.userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    return this.commentsService.remove(id);
  }
}
