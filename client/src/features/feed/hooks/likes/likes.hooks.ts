import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPostLikes,
  getCommentLikes,
  likePost,
  unlikePost,
  likeComment,
  unlikeComment,
} from "../../api/likes.api";
import { postKeys } from "../posts/posts.hooks";
import { commentKeys } from "../comments/comments.hooks";

// Query key factory for likes
export const likeKeys = {
  all: ["likes"] as const,
  lists: () => [...likeKeys.all, "list"] as const,
  postLikes: (postId: string) => [...likeKeys.lists(), "post", postId] as const,
  commentLikes: (commentId: string) =>
    [...likeKeys.lists(), "comment", commentId] as const,
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
    },
  });
};

/**
 * Hook to toggle a like for a post
 */
export const useTogglePostLike = (postId: string) => {
  const queryClient = useQueryClient();
  const likePostMutation = useLikePost();
  const unlikePostMutation = useUnlikePost();

  // Get post from cache to check isLikedByCurrentUser
  const post = queryClient.getQueryData(postKeys.detail(postId));

  // Also get posts list to update them directly
  const postsLists = queryClient.getQueriesData({ queryKey: postKeys.lists() });

  return {
    mutate: async () => {
      // Get latest post data
      const currentPost = queryClient.getQueryData(
        postKeys.detail(postId)
      ) as any;
      const isLiked = currentPost?.isLikedByCurrentUser || false;

      // Optimistically update the post in the cache
      if (currentPost) {
        queryClient.setQueryData(postKeys.detail(postId), {
          ...currentPost,
          isLikedByCurrentUser: !isLiked,
          likesCount: isLiked
            ? Math.max(0, (currentPost.likesCount || 0) - 1)
            : (currentPost.likesCount || 0) + 1,
        });
      }

      // Also update posts in any lists that contain this post
      postsLists.forEach(([queryKey, posts]) => {
        if (Array.isArray(posts)) {
          queryClient.setQueryData(
            queryKey,
            posts.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    isLikedByCurrentUser: !isLiked,
                    likesCount: isLiked
                      ? Math.max(0, (post.likesCount || 0) - 1)
                      : (post.likesCount || 0) + 1,
                  }
                : post
            )
          );
        }
      });

      try {
        if (isLiked) {
          // If already liked, unlike it
          await unlikePostMutation.mutateAsync(postId);
        } else {
          // If not liked, like it
          await likePostMutation.mutateAsync(postId);
        }

        // Invalidate queries to get fresh data after the server responds
        queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
        queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      } catch (error) {
        // If there's an error, revert the optimistic update
        if (currentPost) {
          queryClient.setQueryData(postKeys.detail(postId), currentPost);
        }
        // Revert any list updates
        postsLists.forEach(([queryKey, originalData]) => {
          queryClient.setQueryData(queryKey, originalData);
        });
        throw error;
      }
    },
    isPending: likePostMutation.isPending || unlikePostMutation.isPending,
    isError: likePostMutation.isError || unlikePostMutation.isError,
    error: likePostMutation.error || unlikePostMutation.error,
  };
};

/**
 * Hook to toggle a like for a comment
 */
export const useToggleCommentLike = (commentId: string) => {
  const queryClient = useQueryClient();
  const likeCommentMutation = useLikeComment();
  const unlikeCommentMutation = useUnlikeComment();

  // Get comment from cache to check if it's already liked
  const comment = queryClient.getQueryData(
    commentKeys.detail(commentId)
  ) as any;
  const isLiked = comment?.isLikedByCurrentUser || false;

  return {
    mutate: async () => {
      // Get latest comment data
      const currentComment = queryClient.getQueryData(
        commentKeys.detail(commentId)
      ) as any;
      const isCurrentlyLiked = currentComment?.isLikedByCurrentUser || false;

      // Optimistically update the comment in the cache
      if (currentComment) {
        queryClient.setQueryData(commentKeys.detail(commentId), {
          ...currentComment,
          isLikedByCurrentUser: !isCurrentlyLiked,
          likesCount: isCurrentlyLiked
            ? Math.max(0, (currentComment.likesCount || 0) - 1)
            : (currentComment.likesCount || 0) + 1,
        });
      }

      try {
        if (isCurrentlyLiked) {
          // If already liked, unlike it
          await unlikeCommentMutation.mutateAsync(commentId);
        } else {
          // If not liked, like it
          await likeCommentMutation.mutateAsync(commentId);
        }

        // Invalidate relevant queries
        queryClient.invalidateQueries({
          queryKey: commentKeys.detail(commentId),
        });
      } catch (error) {
        // If there's an error, revert the optimistic update
        if (currentComment) {
          queryClient.setQueryData(
            commentKeys.detail(commentId),
            currentComment
          );
        }
        throw error;
      }
    },
    isPending: likeCommentMutation.isPending || unlikeCommentMutation.isPending,
    isError: likeCommentMutation.isError || unlikeCommentMutation.isError,
    error: likeCommentMutation.error || unlikeCommentMutation.error,
  };
};
