import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCommentsByPostId,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
} from "../api/comments.api";
import {
  CreateCommentInput,
  UpdateCommentInput,
} from "../schemas/comment.schema";
import { postKeys } from "./usePosts";

// Query key factory for comments
export const commentKeys = {
  all: ["comments"] as const,
  lists: () => [...commentKeys.all, "list"] as const,
  list: (postId: string) => [...commentKeys.lists(), { postId }] as const,
  details: () => [...commentKeys.all, "detail"] as const,
  detail: (id: string) => [...commentKeys.details(), id] as const,
};

/**
 * Hook to fetch comments for a post
 */
export const useGetCommentsByPostId = (postId: string) => {
  return useQuery({
    queryKey: commentKeys.list(postId),
    queryFn: () => getCommentsByPostId(postId),
    enabled: !!postId, // Only run the query if we have a postId
  });
};

/**
 * Hook to fetch a comment by id
 */
export const useGetComment = (id: string) => {
  return useQuery({
    queryKey: commentKeys.detail(id),
    queryFn: () => getCommentById(id),
    enabled: !!id, // Only run the query if we have an id
  });
};

/**
 * Hook to create a comment
 */
export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentInput) => createComment(data),
    onSuccess: (newComment) => {
      // Invalidate the comments list query for this post to refetch comments
      queryClient.invalidateQueries({
        queryKey: commentKeys.list(newComment.postId),
      });

      // Invalidate the post detail to update the comments count
      queryClient.invalidateQueries({
        queryKey: postKeys.detail(newComment.postId),
      });
    },
  });
};

/**
 * Hook to update a comment
 */
export const useUpdateComment = (id: string, postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCommentInput) => updateComment(id, data),
    onSuccess: (updatedComment) => {
      // Update the cache for this specific comment
      queryClient.setQueryData(commentKeys.detail(id), updatedComment);

      // Invalidate the comments list query for this post to refetch comments
      queryClient.invalidateQueries({
        queryKey: commentKeys.list(postId),
      });
    },
  });
};

/**
 * Hook to delete a comment
 */
export const useDeleteComment = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteComment(id),
    onSuccess: (_data, id) => {
      // Remove the comment from the cache
      queryClient.removeQueries({ queryKey: commentKeys.detail(id) });

      // Invalidate the comments list query for this post to refetch comments
      queryClient.invalidateQueries({
        queryKey: commentKeys.list(postId),
      });

      // Invalidate the post detail to update the comments count
      queryClient.invalidateQueries({
        queryKey: postKeys.detail(postId),
      });
    },
  });
};
