import { z } from "zod";
import { userSchema } from "../../auth/schemas/user.schema";
// Schema for a single post
export const postSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  authorId: z.string(),
  author: userSchema,
  tags: z.array(z.string()),
  publishedAt: z.string().or(z.date()),
  views: z.number(),
  likesCount: z.number().default(0),
  commentsCount: z.number().default(0),
  isLikedByCurrentUser: z.boolean().default(false),
});

// Schema for a list of posts
export const postsResponseSchema = z.array(postSchema);

// Schema for creating a post
export const createPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  tags: z.array(z.string()),
});

// Schema for updating a post
export const updatePostSchema = createPostSchema.partial();

// Types derived from schemas
export type Post = z.infer<typeof postSchema>;
export type PostsResponse = z.infer<typeof postsResponseSchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
