import apiClient from "@/lib/api-client";
import {
  Post,
  CreatePostInput,
  UpdatePostInput,
  postSchema,
  postsResponseSchema,
} from "../schemas/post.schema";

/**
 * Fetch all posts with pagination support
 */
export const getPosts = async (
  sort?: string,
  tag?: string,
  page = 1,
  limit = 10
): Promise<{ posts: Post[]; hasMore: boolean; nextPage: number | null }> => {
  const params = new URLSearchParams();
  if (sort) params.append("sort", sort);
  if (tag) params.append("tag", tag);
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  const response = await apiClient.get(`/posts?${params.toString()}`);
  const { posts, pagination } = response.data;

  // Parse the posts using our schema
  const parsedPosts = postsResponseSchema.parse(posts);

  return {
    posts: parsedPosts,
    hasMore: pagination.hasMore,
    nextPage: pagination.nextPage,
  };
};

/**
 * Fetch a post by ID
 */
export const getPostById = async (id: string): Promise<Post> => {
  const response = await apiClient.get(`/posts/${id}`);
  return postSchema.parse(response.data);
};

/**
 * Create a new post
 */
export const createPost = async (data: CreatePostInput): Promise<Post> => {
  const response = await apiClient.post("/posts", data);
  return postSchema.parse(response.data);
};

/**
 * Update a post
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
