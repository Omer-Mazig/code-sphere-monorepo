import { Comment } from '../entities/comment.entity';

export interface ClerkAuthor {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | undefined;
  imageUrl: string | null;
  username: string | null;
}

export interface EnrichedComment extends Comment {
  author?: ClerkAuthor;
}
