import apiClient from "@/lib/api-client";
import { Post, postSchema, postsListSchema } from "../schemas/post.schema";
import {
  Pagination,
  paginationSchema,
} from "@/features/schemas/pagination.schema";
/**
 * Fetch all posts with pagination support
 *
 * Note: The API now returns standardized response objects, but our apiClient interceptor
 * automatically unwraps the 'data' field for backward compatibility.
 */
export const getPosts = async (
  sort?: string,
  tag?: string,
  page = 1,
  limit = 10
): Promise<{ posts: Post[]; pagination: Pagination }> => {
  const params = new URLSearchParams();
  if (sort) params.append("sort", sort);
  if (tag) params.append("tag", tag);
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  const response = await apiClient.get(`/posts/feed?${params.toString()}`);
  const { posts, pagination } = response.data;

  try {
    const parsedPosts = postsListSchema.parse(posts);
    const parsedPagination = paginationSchema.parse(pagination);

    return {
      posts: parsedPosts,
      pagination: parsedPagination,
    };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error parsing posts:", error);
    }
    throw error;
  }
};

/**
 * Fetch a post by ID
 *
 * Note: The API now returns standardized response objects, but our apiClient interceptor
 * automatically unwraps the 'data' field for backward compatibility.
 */
export const getPostById = async (id: string): Promise<Post> => {
  const response = await apiClient.get(`/posts/${id}`);
  return postSchema.parse(response.data);
};

/**
 * Fetch posts by a specific user with pagination support
 */
export const getUserPosts = async (
  userId: string,
  page = 1,
  limit = 10
): Promise<{ posts: Post[]; pagination: Pagination }> => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  const response = await apiClient.get(
    `/users/${userId}/posts?${params.toString()}`
  );
  const { posts, pagination } = response.data;

  try {
    const parsedPosts = postsListSchema.parse(posts);
    const parsedPagination = paginationSchema.parse(pagination);

    return {
      posts: parsedPosts,
      pagination: parsedPagination,
    };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error parsing user posts:", error);
    }
    throw error;
  }
};

/**
 * Fetch posts liked by a specific user with pagination support
 */
export const getUserLikedPosts = async (
  userId: string,
  page = 1,
  limit = 10
): Promise<{ posts: Post[]; pagination: Pagination }> => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  const response = await apiClient.get(
    `/users/${userId}/liked-posts?${params.toString()}`
  );
  const { posts, pagination } = response.data;

  try {
    const parsedPosts = postsListSchema.parse(posts);
    const parsedPagination = paginationSchema.parse(pagination);

    return {
      posts: parsedPosts,
      pagination: parsedPagination,
    };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error parsing liked posts:", error);
    }
    throw error;
  }
};
