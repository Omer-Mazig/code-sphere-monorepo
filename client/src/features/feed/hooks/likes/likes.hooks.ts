import {
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { likePost, unlikePost, getPostLikes } from "../../api/likes.api";
import { postKeys } from "../posts/posts.hooks";
import { Post } from "../../schemas/post.schema";
import { PaginatedResponse } from "shared/schemas/pagination.schema";
import { Like, LikeWithUser } from "../../schemas/like.schema";

// Query key factory for likes
export const likeKeys = {
  all: ["likes"] as const,
  lists: () => [...likeKeys.all, "list"] as const,
  postLikes: (postId: string) => [...likeKeys.lists(), "post", postId] as const,
  commentLikes: (commentId: string) =>
    [...likeKeys.lists(), "comment", commentId] as const,
};

type ToggleType = "like" | "unlike";

// Context type for the mutation
type MutationContext = {
  previousPostDetailData?: Post;

  previousFeedData?: {
    pages: PaginatedResponse<Post>[];
    pageParams: number[];
  };

  previousLikesData?: {
    pages: PaginatedResponse<LikeWithUser>[];
    pageParams: number[];
  };
};

/**
 * Hook to toggle like status for a post
 */
export const useTogglePostLike = (type: ToggleType) => {
  const queryClient = useQueryClient();
  const isLiking = type === "like";

  return useMutation<Like | void, Error, string, MutationContext>({
    mutationFn: (postId: string) =>
      isLiking ? likePost(postId) : unlikePost(postId),

    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: postKeys.lists() });
      await queryClient.cancelQueries({ queryKey: postKeys.detail(postId) });
      await queryClient.cancelQueries({ queryKey: likeKeys.postLikes(postId) });

      // Optimistic update for the post detail
      const previousPostDetailData = queryClient.getQueryData<Post | undefined>(
        postKeys.detail(postId)
      );

      if (previousPostDetailData) {
        queryClient.setQueryData<Post>(postKeys.detail(postId), (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            isLikedByCurrentUser: isLiking,
            likesCount: isLiking
              ? oldData.likesCount + 1
              : oldData.likesCount - 1,
          };
        });
      }

      // Optimistic update for the feed
      const previousFeedData = queryClient.getQueryData<{
        pages: PaginatedResponse<Post>[];
        pageParams: number[];
      }>(postKeys.list({ sort: "latest", tag: undefined }));

      if (previousFeedData) {
        queryClient.setQueryData<{
          pages: PaginatedResponse<Post>[];
          pageParams: number[];
        }>(postKeys.list({ sort: "latest", tag: undefined }), (oldData) => {
          if (!oldData || !oldData.pages || !Array.isArray(oldData.pages)) {
            return oldData;
          }

          return {
            ...oldData,
            pages: oldData.pages.map((page) => {
              return {
                ...page,
                items: page.items.map((p) =>
                  p.id === postId
                    ? {
                        ...p,
                        isLikedByCurrentUser: isLiking,
                        likesCount: isLiking
                          ? (p.likesCount || 0) + 1
                          : (p.likesCount || 0) - 1,
                      }
                    : p
                ),
              };
            }),
          };
        });
      }

      // Optimistic update for the likes dialog
      const previousLikesData = queryClient.getQueryData<{
        pages: PaginatedResponse<LikeWithUser>[];
        pageParams: number[];
      }>(likeKeys.postLikes(postId));

      if (previousLikesData) {
        queryClient.setQueryData<{
          pages: PaginatedResponse<LikeWithUser>[];
          pageParams: number[];
        }>(likeKeys.postLikes(postId), (oldData) => {
          console.log("oldData", oldData);
          if (!oldData) return oldData;
        });
      }

      return { previousFeedData, previousPostDetailData, previousLikesData };
    },

    onError: (error, postId, context) => {
      console.log("error", error);
      // roll back the optimistic update if the mutation fails
      if (context?.previousFeedData) {
        queryClient.setQueryData(
          postKeys.list({ sort: "latest", tag: undefined }),
          context.previousFeedData
        );
      }

      if (context?.previousPostDetailData) {
        queryClient.setQueryData(
          postKeys.detail(postId),
          context.previousPostDetailData
        );
      }

      if (context?.previousLikesData) {
        queryClient.setQueryData(
          likeKeys.postLikes(postId),
          context.previousLikesData
        );
      }
    },

    onSettled: (_, __, postId) => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
      queryClient.invalidateQueries({ queryKey: likeKeys.postLikes(postId) });
    },
  });
};

/**
 * Hook to like a post (uses the toggle hook with "like" type)
 */
export const useLikePost = () => useTogglePostLike("like");

/**
 * Hook to unlike a post (uses the toggle hook with "unlike" type)
 */
export const useUnlikePost = () => useTogglePostLike("unlike");

/**
 * Hook to fetch likes for a post with infinite scrolling
 * @param postId - The ID of the post to fetch likes for
 * @param enabled - Whether to fetch the likes
 */
export const usePostLikes = (postId: string, enabled: boolean) => {
  return useInfiniteQuery({
    queryKey: likeKeys.postLikes(postId),
    queryFn: ({ pageParam = 1 }) => getPostLikes(postId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination.hasMore) return null;
      return lastPage.pagination.nextPage;
    },
    enabled,
  });
};
