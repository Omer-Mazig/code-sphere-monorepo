import apiClient from "@/lib/api-client";
import {
  Comment,
  CommentsResponse,
  CreateCommentInput,
  UpdateCommentInput,
  commentSchema,
  commentsResponseSchema,
} from "../schemas/comment.schema";

/**
 * Fetch comments for a post
 */
export const getCommentsByPostId = async (
  postId: string
): Promise<Comment[]> => {
  const response = await apiClient.get(`/posts/${postId}/comments`);
  return commentsResponseSchema.parse(response.data);
};

/**
 * Fetch a comment by ID
 */
export const getCommentById = async (id: string): Promise<Comment> => {
  const response = await apiClient.get(`/comments/${id}`);
  return commentSchema.parse(response.data);
};

/**
 * Create a new comment
 */
export const createComment = async (
  data: CreateCommentInput
): Promise<Comment> => {
  const response = await apiClient.post("/comments", data);
  return commentSchema.parse(response.data);
};

/**
 * Update a comment
 */
export const updateComment = async (
  id: string,
  data: UpdateCommentInput
): Promise<Comment> => {
  const response = await apiClient.patch(`/comments/${id}`, data);
  return commentSchema.parse(response.data);
};

/**
 * Delete a comment
 */
export const deleteComment = async (id: string): Promise<void> => {
  await apiClient.delete(`/comments/${id}`);
};
