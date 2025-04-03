import {
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  InfiniteData,
} from "@tanstack/react-query";
import {
  likePost,
  unlikePost,
  getPostLikesForDialog,
} from "../../api/likes.api";
import { postQueries } from "../posts/posts.hooks";
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
type InfinitePostData = InfiniteData<PaginatedResponse<Post>, number[]>;
type InfiniteLikeData = InfiniteData<PaginatedResponse<LikeWithUser>, number[]>;

// Context type for the mutation
type MutationContext = {
  previousPostDetailData?: Post;
  previousFeedData?: InfinitePostData;
  previousLikesData?: InfiniteLikeData;
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
      await queryClient.cancelQueries({ queryKey: postQueries.lists() });
      await queryClient.cancelQueries({ queryKey: postQueries.detail(postId) });
      await queryClient.cancelQueries({ queryKey: likeKeys.postLikes(postId) });

      // Optimistic update for the post detail
      const previousPostDetailData = queryClient.getQueryData<Post | undefined>(
        postQueries.detail(postId)
      );

      if (previousPostDetailData) {
        queryClient.setQueryData<Post>(
          postQueries.detail(postId),
          (oldData) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              isLikedByCurrentUser: isLiking,
              likesCount: isLiking
                ? oldData.likesCount + 1
                : oldData.likesCount - 1,
            };
          }
        );
      }

      // Optimistic update for the feed
      const previousFeedData = queryClient.getQueryData<InfinitePostData>(
        postQueries.list({ sort: "latest", tag: undefined })
      );

      if (previousFeedData) {
        queryClient.setQueryData<InfinitePostData>(
          postQueries.list({ sort: "latest", tag: undefined }),
          (oldData) => {
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
          }
        );
      }

      // Optimistic update for the likes dialog
      const previousLikesData = queryClient.getQueryData<InfiniteLikeData>(
        likeKeys.postLikes(postId)
      );

      if (previousLikesData) {
        queryClient.setQueryData<InfiniteLikeData>(
          likeKeys.postLikes(postId),
          (oldData) => {
            if (!oldData) return oldData;
          }
        );
      }

      return { previousFeedData, previousPostDetailData, previousLikesData };
    },

    onError: (error, postId, context) => {
      console.log("error", error);
      // roll back the optimistic update if the mutation fails
      if (context?.previousFeedData) {
        queryClient.setQueryData(
          postQueries.list({ sort: "latest", tag: undefined }),
          context.previousFeedData
        );
      }

      if (context?.previousPostDetailData) {
        queryClient.setQueryData(
          postQueries.detail(postId),
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
      queryClient.invalidateQueries({ queryKey: postQueries.lists() });
      queryClient.invalidateQueries({ queryKey: postQueries.detail(postId) });
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
export const usePostLikesForDialog = (
  postId: string,
  enabled: boolean = true
) => {
  return useInfiniteQuery({
    queryKey: likeKeys.postLikes(postId),
    queryFn: ({ pageParam = 1 }) => getPostLikesForDialog(postId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination.hasMore) return null;
      return lastPage.pagination.nextPage;
    },
    enabled,
  });
};
