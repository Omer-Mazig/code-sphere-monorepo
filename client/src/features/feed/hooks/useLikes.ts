import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPostLikes,
  getCommentLikes,
  likePost,
  unlikePost,
  likeComment,
  unlikeComment,
  hasLikedPost,
  hasLikedComment,
} from "../api/likes.api";
import { postKeys } from "./usePosts";
import { commentKeys } from "./useComments";

// Query key factory for likes
export const likeKeys = {
  all: ["likes"] as const,
  lists: () => [...likeKeys.all, "list"] as const,
  postLikes: (postId: string) => [...likeKeys.lists(), "post", postId] as const,
  commentLikes: (commentId: string) =>
    [...likeKeys.lists(), "comment", commentId] as const,
  hasLikedPost: (postId: string) =>
    [...likeKeys.all, "hasLiked", "post", postId] as const,
  hasLikedComment: (commentId: string) =>
    [...likeKeys.all, "hasLiked", "comment", commentId] as const,
};

/**
 * Hook to fetch likes for a post
 */
export const useGetPostLikes = (postId: string) => {
  return useQuery({
    queryKey: likeKeys.postLikes(postId),
    queryFn: () => getPostLikes(postId),
    enabled: !!postId,
  });
};

/**
 * Hook to fetch likes for a comment
 */
export const useGetCommentLikes = (commentId: string) => {
  return useQuery({
    queryKey: likeKeys.commentLikes(commentId),
    queryFn: () => getCommentLikes(commentId),
    enabled: !!commentId,
  });
};

/**
 * Hook to check if the current user has liked a post
 */
export const useHasLikedPost = (postId: string) => {
  return useQuery({
    queryKey: likeKeys.hasLikedPost(postId),
    queryFn: () => hasLikedPost(postId),
    enabled: !!postId,
  });
};

/**
 * Hook to check if the current user has liked a comment
 */
export const useHasLikedComment = (commentId: string) => {
  return useQuery({
    queryKey: likeKeys.hasLikedComment(commentId),
    queryFn: () => hasLikedComment(commentId),
    enabled: !!commentId,
  });
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
      queryClient.invalidateQueries({ queryKey: likeKeys.postLikes(postId) });
      // Invalidate post details to update like count
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
      // Update hasLiked status
      queryClient.setQueryData(likeKeys.hasLikedPost(postId), true);
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
      // Update hasLiked status
      queryClient.setQueryData(likeKeys.hasLikedPost(postId), false);
    },
  });
};

/**
 * Hook to like a comment
 */
export const useLikeComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => likeComment(commentId),
    onSuccess: (_data, commentId) => {
      // Invalidate comment likes
      queryClient.invalidateQueries({
        queryKey: likeKeys.commentLikes(commentId),
      });
      // Invalidate comment details to update like count
      queryClient.invalidateQueries({
        queryKey: commentKeys.detail(commentId),
      });
      // Update hasLiked status
      queryClient.setQueryData(likeKeys.hasLikedComment(commentId), true);
    },
  });
};

/**
 * Hook to unlike a comment
 */
export const useUnlikeComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => unlikeComment(commentId),
    onSuccess: (_data, commentId) => {
      // Invalidate comment likes
      queryClient.invalidateQueries({
        queryKey: likeKeys.commentLikes(commentId),
      });
      // Invalidate comment details to update like count
      queryClient.invalidateQueries({
        queryKey: commentKeys.detail(commentId),
      });
      // Update hasLiked status
      queryClient.setQueryData(likeKeys.hasLikedComment(commentId), false);
    },
  });
};

/**
 * Hook to toggle a like for a post (for backward compatibility)
 */
export const useTogglePostLike = (postId: string) => {
  const queryClient = useQueryClient();
  const likePostMutation = useLikePost();
  const unlikePostMutation = useUnlikePost();

  // Check if post is already liked
  const { data: isLiked, isLoading: isCheckingLike } = useHasLikedPost(postId);

  return {
    mutate: async () => {
      if (isCheckingLike) return;

      if (isLiked) {
        // If already liked, unlike it
        await unlikePostMutation.mutateAsync(postId);
      } else {
        // If not liked, like it
        await likePostMutation.mutateAsync(postId);
      }

      // Invalidate the posts list to update the likes count in the list
      queryClient.invalidateQueries({
        queryKey: postKeys.lists(),
      });
    },
    isLoading:
      isCheckingLike ||
      likePostMutation.isPending ||
      unlikePostMutation.isPending,
    isPending:
      isCheckingLike ||
      likePostMutation.isPending ||
      unlikePostMutation.isPending,
    isError: likePostMutation.isError || unlikePostMutation.isError,
    error: likePostMutation.error || unlikePostMutation.error,
  };
};

/**
 * Hook to toggle a like for a comment (for backward compatibility)
 */
export const useToggleCommentLike = (commentId: string) => {
  const queryClient = useQueryClient();
  const likeCommentMutation = useLikeComment();
  const unlikeCommentMutation = useUnlikeComment();

  // Check if comment is already liked
  const { data: isLiked, isLoading: isCheckingLike } =
    useHasLikedComment(commentId);

  return {
    mutate: async () => {
      if (isCheckingLike) return;

      if (isLiked) {
        // If already liked, unlike it
        await unlikeCommentMutation.mutateAsync(commentId);
      } else {
        // If not liked, like it
        await likeCommentMutation.mutateAsync(commentId);
      }
    },
    isLoading:
      isCheckingLike ||
      likeCommentMutation.isPending ||
      unlikeCommentMutation.isPending,
    isPending:
      isCheckingLike ||
      likeCommentMutation.isPending ||
      unlikeCommentMutation.isPending,
    isError: likeCommentMutation.isError || unlikeCommentMutation.isError,
    error: likeCommentMutation.error || unlikeCommentMutation.error,
  };
};
