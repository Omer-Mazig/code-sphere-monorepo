import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FindPostsDto } from './dto/find-posts.dto';
import { Public } from '../auth/public.decorator';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Public()
  @Get()
  getFeedPosts(
    @Query() findPostsDto: FindPostsDto,
    @CurrentUser() currentUser?: any,
  ) {
    return this.postsService.findAll(findPostsDto, currentUser?.id);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() currentUser?: any) {
    return this.postsService.findOne(id, currentUser?.id);
  }

  @Post()
  create(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.postsService.create(createPostDto, currentUser.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.postsService.update(id, updatePostDto, currentUser.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() currentUser: any) {
    return this.postsService.remove(id, currentUser.id);
  }
}
