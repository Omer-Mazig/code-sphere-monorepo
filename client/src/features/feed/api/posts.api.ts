import apiClient from "@/lib/api-client";
import {
  CreatePostInput,
  UpdatePostInput,
  postSchema,
  postForEditSchema,
  postsListSchema,
} from "../schemas/post.schema";
import { paginationSchema } from "shared/schemas/pagination.schema";
/**
 * Fetch all posts with pagination support
 *
 * Note: The API now returns standardized response objects, but our apiClient interceptor
 * automatically unwraps the 'data' field for backward compatibility.
 */
export const getPosts = async (
  filters: { sort?: string; tag?: string } = {},
  page = 1,
  limit = 10
) => {
  const params = new URLSearchParams();
  if (filters.sort) params.append("sort", filters.sort);
  if (filters.tag) params.append("tag", filters.tag);
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  const response = await apiClient.get(`/posts/feed?${params.toString()}`);
  const { items, pagination } = response.data.data;

  try {
    const parsedPosts = postsListSchema.parse(items);
    const parsedPagination = paginationSchema.parse(pagination);

    return {
      items: parsedPosts,
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
export const getPostForDetail = async (id: string) => {
  const response = await apiClient.get(`/posts/${id}`);
  try {
    return postSchema.parse(response.data.data);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error parsing post:", error);
    }
    throw error;
  }
};

/**
 * Fetch a post by ID for editing purposes
 * Only returns the post's editable fields and performs author verification on the server
 */
export const getPostForEdit = async (id: string) => {
  const response = await apiClient.get(`/posts/${id}/edit`);
  try {
    return postForEditSchema.parse(response.data.data);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error parsing post:", error);
    }
    throw error;
  }
};

/**
 * Create a new post
 * Returns a Post type which includes all fields
 */
export const createPost = async (post: CreatePostInput) => {
  const response = await apiClient.post("/posts", post);
  try {
    return postSchema.parse(response.data.data);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error parsing post:", error);
    }
    throw error;
  }
};

/**
 * Update an existing post
 * Returns a Post type which includes all fields
 */
export const updatePost = async (post: UpdatePostInput, id: string) => {
  const response = await apiClient.put(`/posts/${id}`, post);
  try {
    return postSchema.parse(response.data.data);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error parsing post:", error);
    }
    throw error;
  }
};
