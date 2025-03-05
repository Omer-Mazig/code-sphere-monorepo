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
import { User } from '../../users/entities/user.entity';

@Entity('likes')
@Unique(['clerkUserId', 'postId', 'commentId'])
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  clerkUserId: string;

  @ManyToOne(() => User, (user) => user.likes)
  @JoinColumn({ name: 'clerkUserId', referencedColumnName: 'clerkId' })
  user: User;

  @Column({ nullable: true })
  postId: string;

  @Column({ nullable: true })
  commentId: string;

  @ManyToOne(() => Post, (post) => post.likes, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'postId' })
  post: Post;

  @ManyToOne(() => Comment, (comment) => comment.likes, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'commentId' })
  comment: Comment;

  @CreateDateColumn()
  createdAt: Date;
}
