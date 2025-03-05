import apiClient from "@/lib/api-client";
import {
  Profile,
  UpdateProfileInput,
  profileSchema,
  profilesResponseSchema,
} from "../schemas/profile.schema";
import { Post } from "@/features/feed/schemas/post.schema";
import { postsResponseSchema } from "@/features/feed/schemas/post.schema";

/**
 * Get all users
 */
export const getUsers = async (): Promise<Profile[]> => {
  const response = await apiClient.get("/users");
  return profilesResponseSchema.parse(response.data);
};

/**
 * Get current user's profile
 */
export const getCurrentUserProfile = async (): Promise<Profile> => {
  const response = await apiClient.get("/users/profile/me");
  return profileSchema.parse(response.data);
};

/**
 * Get user profile by user ID
 */
export const getUserProfileById = async (userId: string): Promise<Profile> => {
  const response = await apiClient.get(`/users/profile/${userId}`);
  return profileSchema.parse(response.data);
};

/**
 * Get user by ID
 */
export const getUserById = async (userId: string): Promise<Profile> => {
  const response = await apiClient.get(`/users/${userId}`);
  return profileSchema.parse(response.data);
};

/**
 * Get posts by user ID
 */
export const getUserPosts = async (userId: string): Promise<Post[]> => {
  const response = await apiClient.get(`/posts/user/${userId}`);
  return postsResponseSchema.parse(response.data);
};

/**
 * Follow a user
 */
export const followUser = async (userId: string): Promise<void> => {
  await apiClient.post(`/users/${userId}/follow`);
};

/**
 * Unfollow a user
 */
export const unfollowUser = async (userId: string): Promise<void> => {
  await apiClient.delete(`/users/${userId}/follow`);
};

/**
 * Get user's liked posts
 */
export const getUserLikedPosts = async (userId: string): Promise<Post[]> => {
  const response = await apiClient.get(`/users/${userId}/liked-posts`);
  return postsResponseSchema.parse(response.data);
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  userData: UpdateProfileInput
): Promise<Profile> => {
  const response = await apiClient.patch("/users/profile/me", userData);
  return profileSchema.parse(response.data);
};
