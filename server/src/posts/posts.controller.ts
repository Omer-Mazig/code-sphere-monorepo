import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  Req,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Request } from 'express';
import { Public } from '../auth/public.decorator';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Public()
  @Get()
  findAll(
    @Query('authorId') authorId?: string,
    @Query('tag') tag?: string,
    @Query('sort') sort?: string,
    @CurrentUser() currentUser?: any,
  ) {
    if (authorId) {
      return this.postsService.findByAuthor(authorId, currentUser?.id);
    }

    if (tag) {
      return this.postsService.findByTag(tag, currentUser?.id);
    }

    return this.postsService.findAll(sort, currentUser?.id);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() currentUser?: any) {
    return this.postsService.findOne(id, currentUser?.id);
  }

  @Post()
  create(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
    // Extract user ID from request (will be set by middleware)
    const userId = (req.headers['user-id'] as string) || '1';
    return this.postsService.create(createPostDto, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: Request,
  ) {
    // Extract user ID from request (will be set by middleware)
    const userId = (req.headers['user-id'] as string) || '1';
    return this.postsService.update(id, updatePostDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    // Extract user ID from request (will be set by middleware)
    const userId = (req.headers['user-id'] as string) || '1';
    return this.postsService.remove(id, userId);
  }
}
