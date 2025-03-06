import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment } from './entities/comment.entity';
import { User } from '../users/entities/user.entity';
import { Post } from '../posts/entities/post.entity';
import { Like } from '../likes/entities/like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User, Post, Like])],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
