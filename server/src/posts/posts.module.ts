import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { User } from '../users/entities/user.entity';
import { Comment } from '../comments/entities/comment.entity';
import { Like } from '../likes/entities/like.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, Comment, Like]), AuthModule],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
