import { Post } from '../entities/post.entity';

export interface ClerkAuthor {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | undefined;
  imageUrl: string | null;
  username: string | null;
}

export interface EnrichedPost extends Post {
  author?: ClerkAuthor;
}
