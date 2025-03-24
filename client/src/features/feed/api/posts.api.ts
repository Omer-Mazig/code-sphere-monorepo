import apiClient from "@/lib/api-client";
import {
  CreatePostInput,
  UpdatePostInput,
  postSchema,
  postForEditSchema,
  postsListSchema,
} from "../schemas/post.schema";
import { paginationSchema } from "@/features/schemas/pagination.schema";
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
) => {
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
export const getPostForDetail = async (id: string) => {
  const response = await apiClient.get(`/posts/${id}`);
  try {
    return postSchema.parse(response.data);
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
  console.log("response", response);
  try {
    return postForEditSchema.parse(response.data);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error parsing post:", error);
    }
    throw error;
  }
};

export const createPost = async (post: CreatePostInput) => {
  const response = await apiClient.post("/posts", post);
  try {
    return postSchema.parse(response.data);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error parsing post:", error);
    }
    throw error;
  }
};

export const updatePost = async (post: UpdatePostInput, id: string) => {
  const response = await apiClient.put(`/posts/${id}`, post);
  return postSchema.parse(response.data);
};
