import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comment } from '../../comments/entities/comment.entity';
import { Like } from '../../likes/entities/like.entity';
import { User } from '../../users/entities/user.entity';
import { POST_STATUS } from '../../../../shared/constants/posts.constants';
import { ContentBlock, PostStatus } from '../../../../shared/types/posts.types';
import { Tag } from '../../../../shared/types/tags.types';
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

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

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
