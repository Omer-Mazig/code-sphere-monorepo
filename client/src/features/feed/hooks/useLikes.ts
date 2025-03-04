import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getLikesByPostId,
  getLikesByCommentId,
  createLike,
  deleteLike,
  togglePostLike,
  toggleCommentLike,
} from "../api/likes.api";
import { CreateLikeInput } from "../schemas/like.schema";
import { postKeys } from "./usePosts";
import { commentKeys } from "./useComments";

// Query key factory for likes
export const likeKeys = {
  all: ["likes"] as const,
  lists: () => [...likeKeys.all, "list"] as const,
  postLikes: (postId: string) => [...likeKeys.lists(), { postId }] as const,
  commentLikes: (commentId: string) =>
    [...likeKeys.lists(), { commentId }] as const,
  details: () => [...likeKeys.all, "detail"] as const,
  detail: (id: string) => [...likeKeys.details(), id] as const,
};

/**
 * Hook to fetch likes for a post
 */
export const useGetLikesByPostId = (postId: string) => {
  return useQuery({
    queryKey: likeKeys.postLikes(postId),
    queryFn: () => getLikesByPostId(postId),
    enabled: !!postId, // Only run the query if we have a postId
  });
};

/**
 * Hook to fetch likes for a comment
 */
export const useGetLikesByCommentId = (commentId: string) => {
  return useQuery({
    queryKey: likeKeys.commentLikes(commentId),
    queryFn: () => getLikesByCommentId(commentId),
    enabled: !!commentId, // Only run the query if we have a commentId
  });
};

/**
 * Hook to create a like
 */
export const useCreateLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLikeInput) => createLike(data),
    onSuccess: (newLike) => {
      if (newLike.postId) {
        // Invalidate the post likes query
        queryClient.invalidateQueries({
          queryKey: likeKeys.postLikes(newLike.postId),
        });

        // Invalidate the post detail to update the likes count
        queryClient.invalidateQueries({
          queryKey: postKeys.detail(newLike.postId),
        });
      }

      if (newLike.commentId) {
        // Invalidate the comment likes query
        queryClient.invalidateQueries({
          queryKey: likeKeys.commentLikes(newLike.commentId),
        });

        // Invalidate the comment detail to update the likes count
        queryClient.invalidateQueries({
          queryKey: commentKeys.detail(newLike.commentId),
        });
      }
    },
  });
};

/**
 * Hook to delete a like
 */
export const useDeleteLike = (postId?: string, commentId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteLike(id),
    onSuccess: () => {
      if (postId) {
        // Invalidate the post likes query
        queryClient.invalidateQueries({
          queryKey: likeKeys.postLikes(postId),
        });

        // Invalidate the post detail to update the likes count
        queryClient.invalidateQueries({
          queryKey: postKeys.detail(postId),
        });
      }

      if (commentId) {
        // Invalidate the comment likes query
        queryClient.invalidateQueries({
          queryKey: likeKeys.commentLikes(commentId),
        });

        // Invalidate the comment detail to update the likes count
        queryClient.invalidateQueries({
          queryKey: commentKeys.detail(commentId),
        });
      }
    },
  });
};

/**
 * Hook to toggle a like for a post
 */
export const useTogglePostLike = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => togglePostLike(postId),
    onSuccess: () => {
      // Invalidate the post likes query
      queryClient.invalidateQueries({
        queryKey: likeKeys.postLikes(postId),
      });

      // Invalidate the post detail to update the likes count
      queryClient.invalidateQueries({
        queryKey: postKeys.detail(postId),
      });

      // Invalidate the posts list to update the likes count in the list
      queryClient.invalidateQueries({
        queryKey: postKeys.lists(),
      });
    },
  });
};

/**
 * Hook to toggle a like for a comment
 */
export const useToggleCommentLike = (commentId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => toggleCommentLike(commentId),
    onSuccess: () => {
      // Invalidate the comment likes query
      queryClient.invalidateQueries({
        queryKey: likeKeys.commentLikes(commentId),
      });

      // Invalidate the comment detail to update the likes count
      queryClient.invalidateQueries({
        queryKey: commentKeys.detail(commentId),
      });
    },
  });
};
