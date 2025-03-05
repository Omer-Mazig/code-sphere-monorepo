import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  followUser,
  unfollowUser,
  getUserFollowers,
  getUserFollowing,
} from "../api/social.api";
import { userKeys } from "@/features/profile/hooks/useUsers";

// Query key factory for social interactions
export const socialKeys = {
  all: ["social"] as const,
  following: (userId: string) => ["social", "following", userId] as const,
  followers: (userId: string) => ["social", "followers", userId] as const,
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
      queryClient.invalidateQueries({
        queryKey: socialKeys.followers(followingClerkId),
      });
      queryClient.invalidateQueries({
        queryKey: socialKeys.following(followingClerkId),
      });
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
      queryClient.invalidateQueries({
        queryKey: socialKeys.followers(followingClerkId),
      });
      queryClient.invalidateQueries({
        queryKey: socialKeys.following(followingClerkId),
      });
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
