import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPostComments,
  getCommentReplies,
  getCommentById,
  createComment,
  createReply,
  updateComment,
  deleteComment,
} from "../../api/comments.api";
import {
  CreateCommentInput,
  UpdateCommentInput,
  Comment,
} from "../../schemas/comment.schema";
import { postKeys } from "../posts/posts.hooks";

// Query key factory for comments
export const commentKeys = {
  all: ["comments"] as const,
  lists: () => [...commentKeys.all, "list"] as const,
  postComments: (postId: string) =>
    [...commentKeys.lists(), "post", postId] as const,
  commentReplies: (commentId: string) =>
    [...commentKeys.lists(), "comment", commentId] as const,
  details: () => [...commentKeys.all, "detail"] as const,
  detail: (id: string) => [...commentKeys.details(), id] as const,
};

/**
 * Hook to fetch comments for a post
 */
export const useGetPostComments = (postId: string) => {
  return useQuery({
    queryKey: commentKeys.postComments(postId),
    queryFn: () => getPostComments(postId),
    enabled: !!postId,
  });
};

/**
 * Legacy hook name for backward compatibility
 * @deprecated Use useGetPostComments instead
 */
export const useGetCommentsByPostId = useGetPostComments;

/**
 * Hook to fetch replies for a comment
 */
export const useGetCommentReplies = (commentId: string) => {
  return useQuery({
    queryKey: commentKeys.commentReplies(commentId),
    queryFn: () => getCommentReplies(commentId),
    enabled: !!commentId,
  });
};

/**
 * Hook to fetch a comment by id
 */
export const useGetComment = (id: string) => {
  return useQuery({
    queryKey: commentKeys.detail(id),
    queryFn: () => getCommentById(id),
    enabled: !!id,
  });
};

/**
 * Hook to create a comment on a post
 */
export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentInput) => createComment(data),
    onSuccess: (newComment) => {
      // Invalidate the post comments query
      queryClient.invalidateQueries({
        queryKey: commentKeys.postComments(newComment.postId),
      });

      // Invalidate the post detail to update the comments count
      queryClient.invalidateQueries({
        queryKey: postKeys.detail(newComment.postId),
      });
    },
  });
};

/**
 * Hook to create a reply to a comment
 */
export const useCreateReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentInput) => createReply(data),
    onSuccess: (newReply) => {
      // Invalidate the parent comment's replies query
      if (newReply.parent) {
        queryClient.invalidateQueries({
          queryKey: commentKeys.commentReplies(newReply.parent.id),
        });
      }

      // Invalidate the post comments query
      queryClient.invalidateQueries({
        queryKey: commentKeys.postComments(newReply.postId),
      });

      // Invalidate the post detail to update the comments count
      queryClient.invalidateQueries({
        queryKey: postKeys.detail(newReply.postId),
      });
    },
  });
};

/**
 * Hook to update a comment
 */
export const useUpdateComment = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCommentInput) => updateComment(id, data),
    onSuccess: (updatedComment) => {
      // Update the comment in the cache
      queryClient.setQueryData(commentKeys.detail(id), updatedComment);

      // Invalidate the post comments query
      queryClient.invalidateQueries({
        queryKey: commentKeys.postComments(updatedComment.postId),
      });

      // If it's a reply, invalidate the parent comment's replies
      if (updatedComment.parent) {
        queryClient.invalidateQueries({
          queryKey: commentKeys.commentReplies(updatedComment.parent.id),
        });
      }
    },
  });
};

/**
 * Hook to delete a comment
 */
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteComment(id),
    onSuccess: (_data, id) => {
      // Get the comment from the cache
      const comment = queryClient.getQueryData(commentKeys.detail(id)) as
        | Comment
        | undefined;

      // Remove the comment from the cache
      queryClient.removeQueries({ queryKey: commentKeys.detail(id) });

      // Invalidate related queries
      if (comment) {
        queryClient.invalidateQueries({
          queryKey: commentKeys.postComments(comment.postId),
        });

        if (comment.parent) {
          queryClient.invalidateQueries({
            queryKey: commentKeys.commentReplies(comment.parent.id),
          });
        }

        // Invalidate the post detail to update the comments count
        queryClient.invalidateQueries({
          queryKey: postKeys.detail(comment.postId),
        });
      }
    },
  });
};
