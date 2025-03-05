import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
import { Comment } from '../../comments/entities/comment.entity';

@Entity('likes')
@Unique(['clerkUserId', 'postId', 'commentId'])
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  clerkUserId: string;

  @Column({ nullable: true })
  postId: string;

  @ManyToOne(() => Post, (post) => post.likes, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'postId' })
  post: Post;

  @Column({ nullable: true })
  commentId: string;

  @ManyToOne(() => Comment, (comment) => comment.likes, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'commentId' })
  comment: Comment;

  @CreateDateColumn()
  createdAt: Date;
}
