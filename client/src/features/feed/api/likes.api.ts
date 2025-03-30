import apiClient from "@/lib/api-client";
import { Like, likeSchema, likesListSchema } from "../schemas/like.schema";
import { paginationSchema } from "shared/schemas/pagination.schema";

/**
 * Like a post
 */
export const likePost = async (postId: string) => {
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
export const unlikePost = async (postId: string) => {
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
export const getPostLikes = async (postId: string, page = 1, limit = 10) => {
  const response = await apiClient.get(
    `/likes?postId=${postId}&page=${page}&limit=${limit}`
  );

  const { items, pagination } = response.data.data;

  try {
    const parsedLikes = likesListSchema.parse(items);
    const parsedPagination = paginationSchema.parse(pagination);

    return {
      items: parsedLikes,
      pagination: parsedPagination,
    };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
      console.log(response.data.data);
    }
    throw error;
  }
};
