import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
  Unique,
} from 'typeorm';

@Entity('follows')
@Unique(['followerClerkId', 'followingClerkId']) // A user can only follow another user once
export class Follow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  followerClerkId: string; // The Clerk ID of the user who is following

  @Index()
  @Column()
  followingClerkId: string; // The Clerk ID of the user being followed

  @CreateDateColumn()
  createdAt: Date;
}
