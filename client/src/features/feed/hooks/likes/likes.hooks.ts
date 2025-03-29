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
 * Hook to toggle a like for a post
 */
export const useTogglePostLike = (postId: string, currentIsLiked?: boolean) => {
  const queryClient = useQueryClient();
  const likePostMutation = useLikePost();
  const unlikePostMutation = useUnlikePost();

  // Also get posts list to update them directly
  const postsLists = queryClient.getQueriesData({ queryKey: postKeys.lists() });

  return {
    mutate: async () => {
      // Get latest post data
      const currentPost = queryClient.getQueryData(
        postKeys.detail(postId)
      ) as any;

      // Use the passed isLiked parameter if available, otherwise use the cached value
      const isLiked =
        currentIsLiked !== undefined
          ? currentIsLiked
          : currentPost?.isLikedByCurrentUser || false;

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
          console.log("isLiked", isLiked);
          await unlikePostMutation.mutateAsync(postId);
        } else {
          // If not liked, like it
          console.log("isLiked", isLiked);
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
