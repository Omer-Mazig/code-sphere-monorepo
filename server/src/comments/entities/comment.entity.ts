import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
import { Like } from '../../likes/entities/like.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  content: string;

  @Index()
  @Column()
  clerkUserId: string;

  @Column()
  postId: string;

  @ManyToOne(() => Post, (post) => post.comments)
  @JoinColumn({ name: 'postId' })
  post: Post;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  parentId: string;

  @ManyToOne(() => Comment, (comment) => comment.replies)
  @JoinColumn({ name: 'parentId' })
  parent: Comment;

  @OneToMany(() => Comment, (comment) => comment.parent)
  replies: Comment[];

  @OneToMany(() => Like, (like) => like.comment)
  likes: Like[];

  @Column({ default: 0 })
  likesCount: number;
}
