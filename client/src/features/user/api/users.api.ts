import apiClient from "@/lib/api-client";
import {
  Profile,
  UpdateProfileInput,
  profileSchema,
} from "../schemas/profile.schema";
import { Post } from "@/features/feed/schemas/post.schema";
import { postsListSchema } from "@/features/feed/schemas/post.schema";
import { User, userSchema } from "@/features/auth/schemas/user.schema";
/**
 * Get all users
 */
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await apiClient.get("/users");
    return userSchema.array().parse(response.data);
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

/**
 * Get current user's profile
 */
export const getCurrentUserProfile = async (): Promise<User> => {
  try {
    console.log("Fetching current user profile...");
    const response = await apiClient.get("/users/me/profile");
    console.log("Current user profile response:", response.data);
    return userSchema.parse(response.data);
  } catch (error) {
    console.error("Error fetching current user profile:", error);
    throw error;
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (userId: string): Promise<User> => {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return userSchema.parse(response.data);
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    throw error;
  }
};

/**
 * Get posts by a user with pagination
 */
export const getUserPosts = async (
  userId: string,
  page = 1,
  limit = 10
): Promise<{ posts: Post[]; hasMore: boolean; nextPage: number | null }> => {
  try {
    const params = new URLSearchParams();
    params.append("authorId", userId);
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    const response = await apiClient.get(`/posts?${params.toString()}`);
    const { posts, pagination } = response.data;

    // Parse the posts using our schema
    const parsedPosts = postsListSchema.parse(posts);

    return {
      posts: parsedPosts,
      hasMore: pagination.hasMore,
      nextPage: pagination.nextPage,
    };
  } catch (error) {
    console.error(`Error fetching posts for user ${userId}:`, error);
    throw error;
  }
};

/**
 * Get posts liked by a user with pagination
 */
export const getUserLikedPosts = async (
  userId: string,
  page = 1,
  limit = 10
): Promise<{ posts: Post[]; hasMore: boolean; nextPage: number | null }> => {
  try {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    const response = await apiClient.get(
      `/users/${userId}/liked-posts?${params.toString()}`
    );
    const { posts, pagination } = response.data;

    // Parse the posts using our schema
    const parsedPosts = postsListSchema.parse(posts);

    return {
      posts: parsedPosts,
      hasMore: pagination.hasMore,
      nextPage: pagination.nextPage,
    };
  } catch (error) {
    console.error(`Error fetching liked posts for user ${userId}:`, error);
    throw error;
  }
};

/**
 * Get user profile by user ID
 */
export const getUserProfileById = async (userId: string): Promise<Profile> => {
  const response = await apiClient.get(`/users/profile/${userId}`);
  return profileSchema.parse(response.data);
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  userData: UpdateProfileInput
): Promise<Profile> => {
  const response = await apiClient.put("/users/me/profile", userData);
  return profileSchema.parse(response.data);
};

/**
 * Get current user's profile with posts and liked posts in a single call
 */
export const getCurrentUserProfileComplete = async () => {
  try {
    console.log("Fetching complete user profile data...");

    // Get the current token from Clerk
    const token = await getAuthToken();

    if (!token) {
      console.error("Authentication token not available");
      throw new Error("You must be logged in to access your profile");
    }

    // Make the API call with the token in the Authorization header
    const response = await apiClient.get("/users/me/profile-complete", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Complete profile response:", response.data);

    // Parse the response using our schemas
    const profileData = {
      profile: profileSchema.parse(response.data.profile),
      posts: postsListSchema.parse(response.data.posts),
      likedPosts: postsListSchema.parse(response.data.likedPosts),
    };

    return profileData;
  } catch (error) {
    console.error("Error fetching complete profile data:", error);
    throw error;
  }
};

/**
 * Get user profile with complete data (posts and likes) by ID
 */
export const getUserProfileComplete = async (userId: string) => {
  try {
    console.log(`Fetching complete profile for user: ${userId}`);

    // Get the current token from Clerk
    const token = await getAuthToken();

    if (!token) {
      console.error("Authentication token not available");
      throw new Error("You must be logged in to view user profiles");
    }

    // Make the API call with the token in the Authorization header
    const response = await apiClient.get(`/users/${userId}/profile-complete`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("User complete profile response:", response.data);

    return {
      profile: profileSchema.parse(response.data.profile),
      posts: postsListSchema.parse(response.data.posts),
      likedPosts: postsListSchema.parse(response.data.likedPosts),
    };
  } catch (error) {
    console.error(`Error fetching complete profile for user ${userId}:`, error);
    throw error;
  }
};

// Helper function to get the current auth token from Clerk
export async function getAuthToken() {
  try {
    // Try to get the token from localStorage first
    const storedToken =
      localStorage.getItem("clerk_auth_token") ||
      localStorage.getItem("__clerk_db_jwt");

    if (storedToken) {
      console.log("Using token from localStorage");
      return storedToken;
    }

    // If no token in localStorage, try to get it from the window.__clerk object
    // @ts-ignore - clerk global object
    if (window.__clerk && window.__clerk.session) {
      // @ts-ignore - clerk global object
      const token = await window.__clerk.session.getToken();
      console.log("Got token from window.__clerk");

      // Store for future use
      if (token) {
        localStorage.setItem("clerk_auth_token", token);
      }

      return token;
    }

    console.error("No authentication methods available");
    return null;
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
}
