import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Comment } from '../../comments/entities/comment.entity';
import { Like } from '../../likes/entities/like.entity';
import { User } from '../../users/entities/user.entity';
import { Tag } from '../../../../shared/constants/tags.constants';
import {
  POST_STATUS,
  PostStatus,
} from '../../../../shared/constants/posts.constants';

// Content block types
export type ContentBlockType =
  | 'paragraph'
  | 'heading'
  | 'code'
  | 'image'
  | 'alert';

// Content block structure
export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  content: string;
  meta?: {
    title?: string;
    language?: string;
    imageUrl?: string;
    alertType?: 'info' | 'warning' | 'error';
  };
}

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar', nullable: true })
  subtitle: string;

  @Column({ type: 'json' })
  contentBlocks: ContentBlock[];

  @Index()
  @Column()
  authorId: string;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'authorId', referencedColumnName: 'id' })
  author: User;

  @Column({ type: 'enum', enum: POST_STATUS, default: POST_STATUS.DRAFT })
  status: PostStatus;

  @Column({ type: 'json', default: [] })
  tags: Tag[];

  @CreateDateColumn()
  publishedAt: Date;

  @Column({ default: 0 })
  views: number;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  // Virtual properties for relation counts (not stored in database)
  likesCount?: number;
  commentsCount?: number;
  isLikedByCurrentUser: boolean = false;
}
