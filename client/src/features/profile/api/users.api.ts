import apiClient from "@/lib/api-client";
import { Profile, UpdateProfileInput } from "../schemas/profile.schema";
import { Post } from "@/features/feed/schemas/post.schema";

export const profileApi = {
  // Get current user's profile
  getCurrentUserProfile: async (): Promise<Profile> => {
    try {
      // Using /users/me which is the common pattern for getting current user
      const response = await apiClient.get("/users/profile/me");
      return response.data;
    } catch (error: any) {
      console.error("Error fetching current user profile");
      throw error;
    }
  },

  // Get user profile by username
  getUserById: async (userId: string): Promise<Profile> => {
    try {
      // Using /users/:username which is most common pattern
      const response = await apiClient.get(`/users/profile/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching user profile for ${userId}`);
      throw error;
    }
  },

  // Get posts by user ID
  getUserPosts: async (userId: string): Promise<Post[]> => {
    try {
      const response = await apiClient.get(`/posts/user/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching posts for user ${userId}`);
      return [];
    }
  },

  // Follow a user
  followUser: async (userId: string): Promise<void> => {
    try {
      await apiClient.post(`/users/${userId}/follow`);
    } catch (error: any) {
      console.error(`Error following user ${userId}`);
      throw error;
    }
  },

  // Unfollow a user
  unfollowUser: async (userId: string): Promise<void> => {
    try {
      await apiClient.delete(`/users/${userId}/follow`);
    } catch (error: any) {
      console.error(`Error unfollowing user ${userId}`);
      throw error;
    }
  },

  // Get user's liked posts
  getUserLikedPosts: async (userId: string): Promise<Post[]> => {
    try {
      const response = await apiClient.get(`/users/${userId}/liked-posts`);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching liked posts for user ${userId}`);
      return [];
    }
  },

  // Update user profile
  updateUserProfile: async (userData: UpdateProfileInput): Promise<Profile> => {
    try {
      const response = await apiClient.patch("/users/me", userData);
      return response.data;
    } catch (error: any) {
      console.error("Error updating user profile");
      throw error;
    }
  },
};
