import apiClient from "@/lib/api-client";
import {
  Like,
  LikesResponse,
  CreateLikeInput,
  likeSchema,
  likesResponseSchema,
} from "../schemas/like.schema";

/**
 * Fetch likes for a post
 */
export const getLikesByPostId = async (postId: string): Promise<Like[]> => {
  const response = await apiClient.get(`/posts/${postId}/likes`);
  return likesResponseSchema.parse(response.data);
};

/**
 * Fetch likes for a comment
 */
export const getLikesByCommentId = async (
  commentId: string
): Promise<Like[]> => {
  const response = await apiClient.get(`/comments/${commentId}/likes`);
  return likesResponseSchema.parse(response.data);
};

/**
 * Create a like (for a post or comment)
 */
export const createLike = async (data: CreateLikeInput): Promise<Like> => {
  const response = await apiClient.post("/likes", data);
  return likeSchema.parse(response.data);
};

/**
 * Delete a like
 */
export const deleteLike = async (id: string): Promise<void> => {
  await apiClient.delete(`/likes/${id}`);
};

/**
 * Toggle like for a post
 */
export const togglePostLike = async (postId: string): Promise<Like | void> => {
  const response = await apiClient.post(`/posts/${postId}/toggle-like`);
  if (response.status === 204) return;
  return likeSchema.parse(response.data);
};

/**
 * Toggle like for a comment
 */
export const toggleCommentLike = async (
  commentId: string
): Promise<Like | void> => {
  const response = await apiClient.post(`/comments/${commentId}/toggle-like`);
  if (response.status === 204) return;
  return likeSchema.parse(response.data);
};
