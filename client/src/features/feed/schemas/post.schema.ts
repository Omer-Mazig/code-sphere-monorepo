import { z } from "zod";
import { userSchema } from "../../auth/schemas/user.schema";
import {
  POST_TITLE_MAX_LENGTH,
  POST_CONTENT_MAX_LENGTH,
  POST_TITLE_MIN_LENGTH,
  POST_CONTENT_MIN_LENGTH,
  POST_STATUS,
  PostStatus,
} from "../../../../../shared/constants/posts.constants";

const postTitleSchema = z
  .string()
  .min(
    POST_TITLE_MIN_LENGTH,
    `Title must be at least ${POST_TITLE_MIN_LENGTH} characters`
  )
  .max(
    POST_TITLE_MAX_LENGTH,
    `Title must be at most ${POST_TITLE_MAX_LENGTH} characters`
  );

const postContentSchema = z
  .string()
  .min(
    POST_CONTENT_MIN_LENGTH,
    `Content must be at least ${POST_CONTENT_MIN_LENGTH} characters`
  )
  .max(
    POST_CONTENT_MAX_LENGTH,
    `Content must be at most ${POST_CONTENT_MAX_LENGTH} characters`
  );

// Schema for a single post
export const postSchema = z.object({
  id: z.string(),
  title: postTitleSchema,
  content: postContentSchema,
  authorId: z.string(),
  author: userSchema,
  tags: z.array(z.object({ label: z.string(), value: z.string() })),
  publishedAt: z.string().or(z.date()),
  views: z.number(),
  likesCount: z.number().default(0),
  commentsCount: z.number().default(0),
  isLikedByCurrentUser: z.boolean().default(false),
});

// Schema for a list of posts
export const postsListSchema = z.array(postSchema);

// Schema for creating a post
export const createPostSchema = z.object({
  title: postTitleSchema,
  content: postContentSchema,
  tags: z.array(z.string()),
  status: z.enum(Object.values(POST_STATUS) as [PostStatus, ...PostStatus[]]),
});

// Schema for updating a post
export const updatePostSchema = createPostSchema.partial();

// Types derived from schemas
export type Post = z.infer<typeof postSchema>;
export type PostsList = z.infer<typeof postsListSchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
