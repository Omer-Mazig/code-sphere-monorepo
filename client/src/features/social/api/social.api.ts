import apiClient from "@/lib/api-client";

/**
 * Follow a user
 */
export const followUser = async (followingClerkId: string): Promise<void> => {
  try {
    await apiClient.post(`/follows`, { followingClerkId });
  } catch (error) {
    console.error(`Error following user ${followingClerkId}:`, error);
    throw error;
  }
};

/**
 * Unfollow a user
 */
export const unfollowUser = async (followingClerkId: string): Promise<void> => {
  try {
    await apiClient.delete(`/follows/${followingClerkId}`);
  } catch (error) {
    console.error(`Error unfollowing user ${followingClerkId}:`, error);
    throw error;
  }
};

/**
 * Get user's followers
 */
export const getUserFollowers = async (userId: string): Promise<any[]> => {
  try {
    const response = await apiClient.get(`/follows/followers/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching followers for user ${userId}:`, error);
    throw error;
  }
};

/**
 * Get users followed by user
 */
export const getUserFollowing = async (userId: string): Promise<any[]> => {
  try {
    const response = await apiClient.get(`/follows/following/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching following for user ${userId}:`, error);
    throw error;
  }
};
