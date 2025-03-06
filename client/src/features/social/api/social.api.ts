import apiClient from "@/lib/api-client";
import { User } from "@/features/auth/schemas/user.schema";

/**
 * Follow a user
 */
export const followUser = async (userId: string): Promise<void> => {
  try {
    await apiClient.post(`/users/follow`, { userId });
  } catch (error) {
    console.error(`Error following user ${userId}:`, error);
    throw error;
  }
};

/**
 * Unfollow a user
 */
export const unfollowUser = async (userId: string): Promise<void> => {
  try {
    await apiClient.delete(`/users/follow/${userId}`);
  } catch (error) {
    console.error(`Error unfollowing user ${userId}:`, error);
    throw error;
  }
};

/**
 * Get user's followers
 */
export const getUserFollowers = async (userId: string): Promise<User[]> => {
  try {
    const response = await apiClient.get(`/users/${userId}/followers`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching followers for user ${userId}:`, error);
    throw error;
  }
};

/**
 * Get users followed by user
 */
export const getUserFollowing = async (userId: string): Promise<User[]> => {
  try {
    const response = await apiClient.get(`/users/${userId}/following`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching following for user ${userId}:`, error);
    throw error;
  }
};

/**
 * Check if the current user follows a specific user
 */
export const checkIfFollowing = async (userId: string): Promise<boolean> => {
  try {
    const response = await apiClient.get(`/users/follow/check/${userId}`);
    return response.data.isFollowing;
  } catch (error) {
    console.error(`Error checking if following user ${userId}:`, error);
    return false;
  }
};
