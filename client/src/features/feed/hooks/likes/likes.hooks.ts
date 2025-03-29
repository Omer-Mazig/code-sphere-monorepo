import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likePost, unlikePost } from "../../api/likes.api";
import { postKeys } from "../posts/posts.hooks";

// Query key factory for likes
export const likeKeys = {
  all: ["likes"] as const,
  lists: () => [...likeKeys.all, "list"] as const,
  postLikes: (postId: string) => [...likeKeys.lists(), "post", postId] as const,
  commentLikes: (commentId: string) =>
    [...likeKeys.lists(), "comment", commentId] as const,
};

/**
 * Hook to like a post
 */
export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => likePost(postId),
    onSuccess: (_data, postId) => {
      // Invalidate post likes
      queryClient.invalidateQueries({ queryKey: postKeys.list() });
      // Invalidate post details to update like count
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
    },
  });
};

/**
 * Hook to unlike a post
 */
export const useUnlikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => unlikePost(postId),
    onSuccess: (_data, postId) => {
      // Invalidate post likes
      queryClient.invalidateQueries({ queryKey: likeKeys.postLikes(postId) });
      // Invalidate post details to update like count
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
    },
  });
};
