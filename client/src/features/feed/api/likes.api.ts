import apiClient from "@/lib/api-client";
import { Like, likeSchema } from "../schemas/like.schema";

/**
 * Like a post
 */
export const likePost = async (postId: string): Promise<Like> => {
  const response = await apiClient.post(`/likes`, { postId });

  try {
    return likeSchema.parse(response.data.data);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }
    throw error;
  }
};

/**
 * Unlike a post
 */
export const unlikePost = async (postId: string): Promise<void> => {
  try {
    await apiClient.delete(`/likes/post/${postId}`);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }
    throw error;
  }
};
