import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUsers,
  getUserById,
  getUserPosts,
  getUserLikedPosts,
  followUser,
  unfollowUser,
  searchUsers,
  getCurrentUserProfile,
  getCurrentUserProfileComplete,
  getUserProfileComplete,
} from "../api/users.api";

// Query key factory for users
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: Record<string, unknown> = {}) =>
    [...userKeys.lists(), filters] as const,
  search: (query: string) => [...userKeys.lists(), "search", query] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  me: () => [...userKeys.all, "me"] as const,
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
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook to search users
 */
export const useSearchUsers = (query: string) => {
  return useQuery({
    queryKey: userKeys.search(query),
    queryFn: () => searchUsers(query),
    enabled: query.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to fetch a user by id
 */
export const useGetUser = (id: string) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => getUserById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook to fetch current user's profile
 */
export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: () => getCurrentUserProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook to fetch current user's profile with posts and likes in a single call
 */
export const useGetCurrentUserComplete = () => {
  return useQuery({
    queryKey: [...userKeys.me(), "complete"],
    queryFn: () => getCurrentUserProfileComplete(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook to fetch user profile with complete data
 */
export const useGetUserProfileComplete = (userId: string) => {
  return useQuery({
    queryKey: [...userKeys.detail(userId), "complete"],
    queryFn: () => getUserProfileComplete(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook to fetch posts by a user
 */
export const useGetUserPosts = (userId: string) => {
  return useQuery({
    queryKey: userKeys.posts(userId),
    queryFn: () => getUserPosts(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook to fetch liked posts by a user
 */
export const useGetUserLikedPosts = (userId: string) => {
  return useQuery({
    queryKey: userKeys.likedPosts(userId),
    queryFn: () => getUserLikedPosts(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook to follow a user
 */
export const useFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (followingClerkId: string) => followUser(followingClerkId),
    onSuccess: (_data, followingClerkId) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(followingClerkId),
      });
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
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
    mutationFn: (followingClerkId: string) => unfollowUser(followingClerkId),
    onSuccess: (_data, followingClerkId) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(followingClerkId),
      });
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
      queryClient.invalidateQueries({ queryKey: userKeys.list() });
    },
  });
};
