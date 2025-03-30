import { z } from "zod";
import { userSchema } from "@/features/auth/schemas/user.schema";

// Schema for a single like
export const likeSchema = z.object({
  id: z.string(),
  postId: z.string().nullable().optional(),
  commentId: z.string().nullable().optional(),
  createdAt: z.string().or(z.date()),
});

export const likeWithUserSchema = likeSchema.extend({
  user: userSchema,
});

// Schema for a list of likes
export const likesListSchema = z.array(likeWithUserSchema);

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
export type LikeWithUser = z.infer<typeof likeWithUserSchema>;
export type CreateLikeInput = z.infer<typeof createLikeSchema>;
