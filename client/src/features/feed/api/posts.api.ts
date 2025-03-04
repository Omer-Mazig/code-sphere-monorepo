import apiClient from "@/lib/api-client";
import {
  Post,
  PostsResponse,
  CreatePostInput,
  UpdatePostInput,
  postSchema,
  postsResponseSchema,
} from "../schemas/post.schema";

/**
 * Fetch all posts
 */
export const getPosts = async (): Promise<Post[]> => {
  const response = await apiClient.get("/posts");
  return postsResponseSchema.parse(response.data);
};

/**
 * Fetch posts with optional filters
 */
export const getFilteredPosts = async (
  filter?: string,
  tag?: string
): Promise<Post[]> => {
  const params = new URLSearchParams();
  if (filter) params.append("filter", filter);
  if (tag) params.append("tag", tag);

  const response = await apiClient.get(`/posts?${params.toString()}`);
  return postsResponseSchema.parse(response.data);
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
