import { z } from "zod";

// Schema for a single like
export const likeSchema = z.object({
  id: z.string(),
  userId: z.string(),
  postId: z.string().nullable().optional(),
  commentId: z.string().nullable().optional(),
  createdAt: z.string().or(z.date()),
});

// Schema for a list of likes
export const likesResponseSchema = z.array(likeSchema);

// Schema for creating a like
export const createLikeSchema = z
  .object({
    postId: z.string().optional(),
    commentId: z.string().optional(),
  })
  .refine((data) => data.postId || data.commentId, {
    message: "Either postId or commentId must be provided",
    path: ["postId", "commentId"],
  });

// Types derived from schemas
export type Like = z.infer<typeof likeSchema>;
export type LikesResponse = z.infer<typeof likesResponseSchema>;
export type CreateLikeInput = z.infer<typeof createLikeSchema>;
