import { z } from "zod";
import { userSchema } from "../../auth/schemas/user.schema";

// Define the base comment schema without replies first
const baseCommentSchema = z.object({
  id: z.string(),
  content: z.string(),
  authorId: z.string(),
  author: userSchema.optional(),
  postId: z.string(),
  createdAt: z.string().or(z.date()),
  likesCount: z.number().default(0),
  parentId: z.string().nullable().optional(),
});

// Complete comment schema with replies
export const commentSchema: z.ZodType<any> = baseCommentSchema.extend({
  replies: z.lazy(() => z.array(commentSchema).optional()),
});

// Schema for a list of comments
export const commentsResponseSchema = z.array(commentSchema);

// Schema for creating a comment
export const createCommentSchema = z.object({
  content: z.string().min(1, "Comment content is required"),
  postId: z.string(),
  parentId: z.string().optional(),
});

// Schema for updating a comment
export const updateCommentSchema = z.object({
  content: z.string().min(1, "Comment content is required"),
});

// Types derived from schemas
export type Comment = z.infer<typeof commentSchema>;
export type CommentsResponse = z.infer<typeof commentsResponseSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
