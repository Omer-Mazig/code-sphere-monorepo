import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUsers,
  getUserById,
  getUserProfileById,
  getCurrentUserProfile,
  getUserPosts,
  getUserLikedPosts,
  followUser,
  unfollowUser,
  updateUserProfile,
} from "../api/users.api";
import { UpdateProfileInput } from "../schemas/profile.schema";

// Query key factory for users
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: Record<string, unknown> = {}) =>
    [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  profile: () => [...userKeys.all, "profile"] as const,
  currentProfile: () => [...userKeys.profile(), "me"] as const,
  userProfile: (id: string) => [...userKeys.profile(), id] as const,
  posts: (userId: string) => [...userKeys.detail(userId), "posts"] as const,
  likedPosts: (userId: string) =>
    [...userKeys.detail(userId), "liked-posts"] as const,
  following: (userId: string) =>
    [...userKeys.detail(userId), "following"] as const,
  followers: (userId: string) =>
    [...userKeys.detail(userId), "followers"] as const,
};

/**
 * Hook to fetch all users
 */
export const useGetUsers = () => {
  return useQuery({
    queryKey: userKeys.list(),
    queryFn: () => getUsers(),
  });
};

/**
 * Hook to fetch a user by id
 */
export const useGetUser = (id: string) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => getUserById(id),
    enabled: !!id, // Only run the query if we have an id
  });
};

/**
 * Hook to fetch a user profile by id
 */
export const useGetUserProfile = (id: string) => {
  return useQuery({
    queryKey: userKeys.userProfile(id),
    queryFn: () => getUserProfileById(id),
    enabled: !!id, // Only run the query if we have an id
  });
};

/**
 * Hook to fetch current user's profile
 */
export const useGetCurrentUserProfile = () => {
  return useQuery({
    queryKey: userKeys.currentProfile(),
    queryFn: () => getCurrentUserProfile(),
  });
};

/**
 * Hook to fetch posts by a user
 */
export const useGetUserPosts = (userId: string) => {
  return useQuery({
    queryKey: userKeys.posts(userId),
    queryFn: () => getUserPosts(userId),
    enabled: !!userId, // Only run the query if we have a userId
  });
};

/**
 * Hook to fetch liked posts by a user
 */
export const useGetUserLikedPosts = (userId: string) => {
  return useQuery({
    queryKey: userKeys.likedPosts(userId),
    queryFn: () => getUserLikedPosts(userId),
    enabled: !!userId, // Only run the query if we have a userId
  });
};

/**
 * Hook to follow a user
 */
export const useFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => followUser(userId),
    onSuccess: (_data, userId) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: userKeys.userProfile(userId) });
      queryClient.invalidateQueries({ queryKey: userKeys.currentProfile() });
      queryClient.invalidateQueries({ queryKey: userKeys.list() });
    },
  });
};

/**
 * Hook to unfollow a user
 */
export const useUnfollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => unfollowUser(userId),
    onSuccess: (_data, userId) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: userKeys.userProfile(userId) });
      queryClient.invalidateQueries({ queryKey: userKeys.currentProfile() });
      queryClient.invalidateQueries({ queryKey: userKeys.list() });
    },
  });
};

/**
 * Hook to update user profile
 */
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileInput) => updateUserProfile(data),
    onSuccess: () => {
      // Invalidate the current user profile
      queryClient.invalidateQueries({ queryKey: userKeys.currentProfile() });
    },
  });
};
