import apiClient from "@/lib/api-client";
import {
  Like,
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
 * Create a new like
 */
export const createLike = async (data: CreateLikeInput): Promise<Like> => {
  const response = await apiClient.post("/likes", data);
  return likeSchema.parse(response.data);
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
