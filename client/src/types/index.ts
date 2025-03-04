export interface User {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  location?: string;
  website?: string;
  skills?: string[];
  createdAt: string;
  followersCount?: number;
  followingCount?: number;
  likedPosts?: string[];
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author?: User;
  tags: string[];
  publishedAt: string;
  views: number;
  likesCount?: number;
  commentsCount?: number;
  bookmarksCount?: number;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  author?: User;
  postId: string;
  post?: Post;
  createdAt: string;
  likesCount?: number;
  parentId?: string;
  replies?: Comment[];
}

export interface Like {
  id: string;
  userId: string;
  postId?: string;
  commentId?: string;
  createdAt: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  postId: string;
  post?: Post;
  createdAt: string;
  category?: string;
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  follower?: User;
  following?: User;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: "like" | "comment" | "follow";
  actorId: string;
  actor?: User;
  postId?: string;
  post?: Post;
  commentId?: string;
  comment?: Comment;
  read: boolean;
  createdAt: string;
}
