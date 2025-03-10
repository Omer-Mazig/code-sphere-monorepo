import apiClient from "@/lib/api-client";
import {
  Post,
  CreatePostInput,
  UpdatePostInput,
  postSchema,
  postsListSchema,
} from "../schemas/post.schema";
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
 * Create a new post
 *
 * Note: The API now returns standardized response objects, but our apiClient interceptor
 * automatically unwraps the 'data' field for backward compatibility.
 */
export const createPost = async (data: CreatePostInput): Promise<Post> => {
  const response = await apiClient.post("/posts", data);
  return postSchema.parse(response.data);
};

/**
 * Update a post
 *
 * Note: The API now returns standardized response objects, but our apiClient interceptor
 * automatically unwraps the 'data' field for backward compatibility.
 */
export const updatePost = async (
  id: string,
  data: UpdatePostInput
): Promise<Post> => {
  const response = await apiClient.patch(`/posts/${id}`, data);
  return postSchema.parse(response.data);
};

/**
 * Delete a post
 */
export const deletePost = async (id: string): Promise<void> => {
  await apiClient.delete(`/posts/${id}`);
};
