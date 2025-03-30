import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { PostsModule } from '../posts/posts.module';
import { CommentsModule } from '../comments/comments.module';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { AuthModule } from '../auth/auth.module';
import { User } from '../users/entities/user.entity';
import { Post } from '../posts/entities/post.entity';
import { Comment } from '../comments/entities/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Like, User, Post, Comment]),
    PostsModule,
    CommentsModule,
    AuthModule,
  ],
  controllers: [LikesController],
  providers: [LikesService, Logger],
  exports: [LikesService],
})
export class LikesModule {}
