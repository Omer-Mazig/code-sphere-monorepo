import { z } from "zod";
import { userSchema } from "../../auth/schemas/user.schema";
import {
  POST_TITLE_MAX_LENGTH,
  POST_TITLE_MIN_LENGTH,
  POST_STATUS,
} from "../../../../../shared/constants/posts.constants";
import { PostStatus } from "../../../../../shared/types/posts.types";

const contentBlockSchema = z.object({
  id: z.string(),
  type: z.enum(["paragraph", "heading", "code", "image", "alert"] as const),
  content: z.string(),
  meta: z
    .object({
      title: z.string().optional(),
      language: z.string().optional(),
      imageUrl: z.string().optional(),
      alertType: z.enum(["info", "warning", "error"] as const).optional(),
    })
    .optional(),
});

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

const postSubtitleSchema = z
  .string()
  .max(
    POST_TITLE_MAX_LENGTH * 2,
    `Subtitle must be at most ${POST_TITLE_MAX_LENGTH * 2} characters`
  )
  .optional();

// Schema for a single post
export const postSchema = z.object({
  id: z.string(),
  title: postTitleSchema,
  subtitle: postSubtitleSchema,
  contentBlocks: z.array(contentBlockSchema),
  authorId: z.string(),
  author: userSchema,
  tags: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
      bgColor: z.string().optional(),
      textColor: z.string().optional(),
    })
  ),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
  views: z.number(),
  likesCount: z.number().default(0),
  commentsCount: z.number().default(0),
  isLikedByCurrentUser: z.boolean().default(false),
});

// Schema for a list of posts
export const postsListSchema = z.array(postSchema);

// We'll validate content blocks at a high level by requiring at least one block
const validateContentBlocks = (
  blocks: z.infer<typeof contentBlockSchema>[]
) => {
  if (blocks.length === 0) {
    throw new Error("Post must have at least one content block");
  }
  return blocks;
};

// Schema for creating a post
export const createPostSchema = z.object({
  title: postTitleSchema,
  subtitle: postSubtitleSchema,
  contentBlocks: z.array(contentBlockSchema).refine(validateContentBlocks, {
    message: "Post must have at least one content block",
  }),
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
