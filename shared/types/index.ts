// Example type definitions
export interface User {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  location?: string;
  website?: string;
  createdAt: string;
  followersCount: number;
  followingCount: number;
  skills?: string[];
  likedPosts?: string[];
  isFollowing?: boolean;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author?: User;
  tags?: string[];
  publishedAt: string;
  views: number;
  likesCount?: number;
  commentsCount?: number;
  bookmarksCount?: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  author?: User;
  postId: string;
  createdAt: string;
  likesCount?: number;
  isLiked?: boolean;
}

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  userId: string;
}

// Add more types as needed
