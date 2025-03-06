import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  followUser,
  unfollowUser,
  getUserFollowers,
  getUserFollowing,
  checkIfFollowing,
} from "../api/social.api";

// Query key factory for social interactions
export const socialKeys = {
  all: ["social"] as const,
  following: (userId: string) => ["social", "following", userId] as const,
  followers: (userId: string) => ["social", "followers", userId] as const,
  isFollowing: (userId: string) => ["social", "isFollowing", userId] as const,
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
      queryClient.invalidateQueries({
        queryKey: socialKeys.followers(userId),
      });
      queryClient.invalidateQueries({
        queryKey: socialKeys.following(userId),
      });
      queryClient.invalidateQueries({
        queryKey: socialKeys.isFollowing(userId),
      });
      // Set the isFollowing status to true
      queryClient.setQueryData(socialKeys.isFollowing(userId), true);
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
      queryClient.invalidateQueries({
        queryKey: socialKeys.followers(userId),
      });
      queryClient.invalidateQueries({
        queryKey: socialKeys.following(userId),
      });
      queryClient.invalidateQueries({
        queryKey: socialKeys.isFollowing(userId),
      });
      // Set the isFollowing status to false
      queryClient.setQueryData(socialKeys.isFollowing(userId), false);
    },
  });
};

/**
 * Hook to get followers of a user
 */
export const useGetUserFollowers = (userId: string) => {
  return useQuery({
    queryKey: socialKeys.followers(userId),
    queryFn: () => getUserFollowers(userId),
    enabled: !!userId,
  });
};

/**
 * Hook to get users followed by a user
 */
export const useGetUserFollowing = (userId: string) => {
  return useQuery({
    queryKey: socialKeys.following(userId),
    queryFn: () => getUserFollowing(userId),
    enabled: !!userId,
  });
};

/**
 * Hook to check if the current user is following another user
 */
export const useCheckIfFollowing = (userId: string) => {
  return useQuery({
    queryKey: socialKeys.isFollowing(userId),
    queryFn: () => checkIfFollowing(userId),
    enabled: !!userId,
  });
};
