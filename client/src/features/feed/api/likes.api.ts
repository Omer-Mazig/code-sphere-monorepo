import apiClient from "@/lib/api-client";
import { Like, likeSchema } from "../schemas/like.schema";

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
