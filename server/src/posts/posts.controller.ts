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
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';
import { UpdatePostDto } from './dto/update-post.dto';
import { ClerkAuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { EnrichedPost } from './types/enriched-post.type';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(ClerkAuthGuard)
  create(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() user: any,
  ): Promise<EnrichedPost> {
    return this.postsService.create(createPostDto, user.userId);
  }

  @Get()
  findAll(
    @Query('tag') tag?: string,
    @Query('sort') sort?: string,
  ): Promise<EnrichedPost[]> {
    return this.postsService.findAll(sort, tag);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string): Promise<EnrichedPost[]> {
    return this.postsService.findByClerkUserId(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<EnrichedPost> {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(ClerkAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @CurrentUser() user: any,
  ): Promise<EnrichedPost> {
    // Get the post to check ownership
    const post = await this.postsService.findOne(id);

    // Check if the user is the author
    if (post.clerkUserId !== user.userId) {
      throw new ForbiddenException('You can only update your own posts');
    }

    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(ClerkAuthGuard)
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    // Get the post to check ownership
    const post = await this.postsService.findOne(id);

    // Check if the user is the author
    if (post.clerkUserId !== user.userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    return this.postsService.remove(id);
  }
}
