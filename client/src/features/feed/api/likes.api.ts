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
export const getPostLikes = async (postId: string): Promise<Like[]> => {
  const response = await apiClient.get(`/likes?postId=${postId}`);
  return likesResponseSchema.parse(response.data);
};

/**
 * Fetch likes for a comment
 */
export const getCommentLikes = async (commentId: string): Promise<Like[]> => {
  const response = await apiClient.get(`/likes?commentId=${commentId}`);
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

/**
 * Like a post
 */
export const likePost = async (postId: string): Promise<Like> => {
  const response = await apiClient.post(`/likes`, { postId });
  return likeSchema.parse(response.data);
};

/**
 * Unlike a post
 */
export const unlikePost = async (postId: string): Promise<void> => {
  await apiClient.delete(`/likes/post/${postId}`);
};

/**
 * Like a comment
 */
export const likeComment = async (commentId: string): Promise<Like> => {
  const response = await apiClient.post(`/likes`, { commentId });
  return likeSchema.parse(response.data);
};

/**
 * Unlike a comment
 */
export const unlikeComment = async (commentId: string): Promise<void> => {
  await apiClient.delete(`/likes/comment/${commentId}`);
};

/**
 * Check if current user has liked a post
 */
export const hasLikedPost = async (postId: string): Promise<boolean> => {
  try {
    const response = await apiClient.get(`/likes/post/${postId}/check`);
    return response.data.hasLiked;
  } catch (error) {
    return false;
  }
};

/**
 * Check if current user has liked a comment
 */
export const hasLikedComment = async (commentId: string): Promise<boolean> => {
  try {
    const response = await apiClient.get(`/likes/comment/${commentId}/check`);
    return response.data.hasLiked;
  } catch (error) {
    return false;
  }
};
