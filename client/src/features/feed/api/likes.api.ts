import apiClient from "@/lib/api-client";
import {
  Like,
  likeSchema,
  PaginatedLikesResponse,
  paginatedLikesSchema,
} from "../schemas/like.schema";

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

/**
 * Get likes for a post with pagination
 */
export const getPostLikes = async (
  postId: string,
  page = 1,
  limit = 10
): Promise<PaginatedLikesResponse> => {
  const response = await apiClient.get(
    `/likes?postId=${postId}&page=${page}&limit=${limit}`
  );
  try {
    return paginatedLikesSchema.parse(response.data.data);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
      console.log(response.data.data);
    }
    throw error;
  }
};
