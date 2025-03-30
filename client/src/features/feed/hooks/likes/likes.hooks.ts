import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likePost, unlikePost } from "../../api/likes.api";
import { postKeys } from "../posts/posts.hooks";
import { Post } from "../../schemas/post.schema";
import { Pagination } from "@/features/schemas/pagination.schema";

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

    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: postKeys.lists() });
      await queryClient.cancelQueries({ queryKey: postKeys.detail(postId) });

      const previousPostDetailData = queryClient.getQueryData<Post | undefined>(
        postKeys.detail(postId)
      );

      if (previousPostDetailData) {
        queryClient.setQueryData<Post>(postKeys.detail(postId), (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            isLikedByCurrentUser: true,
            likesCount: oldData.likesCount + 1,
          };
        });
      }

      const previousFeedData = queryClient.getQueryData<{
        pages: {
          posts: Post[];
          pagination: Pagination;
        }[];
        pageParams: number[];
      }>(postKeys.list({ sort: "latest", tag: undefined }));

      queryClient.setQueryData<{
        pages: {
          posts: Post[];
          pagination: Pagination;
        }[];
        pageParams: number[];
      }>(postKeys.list({ sort: "latest", tag: undefined }), (oldData) => {
        if (!oldData || !oldData.pages || !Array.isArray(oldData.pages)) {
          return oldData;
        }

        const newData = {
          ...oldData,
          pages: oldData.pages.map((page) => {
            return {
              ...page,
              posts: page.posts.map((p) =>
                p.id === postId
                  ? {
                      ...p,
                      isLikedByCurrentUser: true,
                      likesCount: (p.likesCount || 0) + 1,
                    }
                  : p
              ),
            };
          }),
        };

        return newData;
      });

      return { previousFeedData, previousPostDetailData };
    },

    onError: (error, postId, context) => {
      console.log("error", error);
      // roll back the optimistic update if the mutation fails
      queryClient.setQueryData(
        postKeys.list({ sort: "latest", tag: undefined }),
        context?.previousFeedData
      );

      queryClient.setQueryData(
        postKeys.detail(postId),
        context?.previousPostDetailData
      );
    },

    onSettled: (_, __, postId) => {
      // Invalidate post likes
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
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

    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: postKeys.lists() });
      await queryClient.cancelQueries({ queryKey: postKeys.detail(postId) });

      const previousPostDetailData = queryClient.getQueryData<Post | undefined>(
        postKeys.detail(postId)
      );

      if (previousPostDetailData) {
        queryClient.setQueryData<Post>(postKeys.detail(postId), (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            isLikedByCurrentUser: false,
            likesCount: oldData.likesCount - 1,
          };
        });
      }

      const previousFeedData = queryClient.getQueryData<{
        pages: {
          posts: Post[];
          pagination: Pagination;
        }[];
        pageParams: number[];
      }>(postKeys.list({ sort: "latest", tag: undefined }));

      queryClient.setQueryData<{
        pages: {
          posts: Post[];
          pagination: Pagination;
        }[];
        pageParams: number[];
      }>(postKeys.list({ sort: "latest", tag: undefined }), (oldData) => {
        if (!oldData || !oldData.pages || !Array.isArray(oldData.pages)) {
          return oldData;
        }

        const newData = {
          ...oldData,
          pages: oldData.pages.map((page) => {
            return {
              ...page,
              posts: page.posts.map((p) =>
                p.id === postId
                  ? {
                      ...p,
                      isLikedByCurrentUser: false,
                      likesCount: (p.likesCount || 0) - 1,
                    }
                  : p
              ),
            };
          }),
        };

        return newData;
      });

      return { previousFeedData, previousPostDetailData };
    },

    onError: (error, postId, context) => {
      console.log("error", error);
      // roll back the optimistic update if the mutation fails
      queryClient.setQueryData(
        postKeys.list({ sort: "latest", tag: undefined }),
        context?.previousFeedData
      );

      queryClient.setQueryData(
        postKeys.detail(postId),
        context?.previousPostDetailData
      );
    },

    onSettled: (_, __, postId) => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
    },
  });
};
