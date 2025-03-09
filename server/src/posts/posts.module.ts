import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { User } from '../users/entities/user.entity';
import { Logger } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User])],
  controllers: [PostsController],
  providers: [PostsService, Logger],
  exports: [PostsService],
})
export class PostsModule {}
