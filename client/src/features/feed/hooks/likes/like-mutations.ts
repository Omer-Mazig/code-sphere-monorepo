import { useMutation } from "@tanstack/react-query";

import { useQueryClient } from "@tanstack/react-query";
import { postQueries } from "../posts/post-queries";
import { likePost, unlikePost } from "../../api/likes.api";
import { LikeWithUser } from "../../schemas/like.schema";
import { likeQueries } from "./like-queries";
import { useUser } from "@clerk/clerk-react";

type ToggleType = "like" | "unlike";

export const useTogglePostLike = (type: ToggleType) => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const isLiking = type === "like";

  return useMutation<LikeWithUser | void, unknown, string>({
    mutationFn: (postId: string) =>
      isLiking ? likePost(postId) : unlikePost(postId),

    onMutate: async (postId: string) => {
      // Cancel all queries to avoid race condition
      await Promise.all([
        queryClient.cancelQueries({
          queryKey: postQueries.lists().queryKey,
        }),
        queryClient.cancelQueries({
          queryKey: postQueries.detail(postId).queryKey,
        }),
      ]);

      // Optimistic update for the post detail
      const previousPostDetailData = queryClient.getQueryData(
        postQueries.detail(postId).queryKey
      );

      if (previousPostDetailData) {
        queryClient.setQueryData(
          postQueries.detail(postId).queryKey,
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
      const previousFeedData = queryClient.getQueryData(
        // TODO: fix undefined value
        postQueries.list({ sort: "latest", tag: undefined }).queryKey
      );

      if (previousFeedData) {
        queryClient.setQueryData(
          postQueries.list({ sort: "latest", tag: undefined }).queryKey,
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

      return { previousFeedData, previousPostDetailData };
    },

    // TODO: fix any type
    onError: (error, postId, context: any) => {
      console.log("error", error);

      // roll back the optimistic update if the mutation fails
      if (context?.previousFeedData) {
        queryClient.setQueryData(
          postQueries.list({ sort: "latest", tag: undefined }).queryKey,
          context.previousFeedData
        );
      }

      if (context?.previousPostDetailData) {
        queryClient.setQueryData(
          postQueries.detail(postId).queryKey,
          context.previousPostDetailData
        );
      }
    },

    onSuccess: (data, postId) => {
      // unlike manual update
      if (!data) {
        queryClient.setQueryData(
          likeQueries.postLikes(postId).queryKey,
          (oldData) => {
            if (!oldData) return oldData;

            const updatedPages = [...oldData.pages];
            if (updatedPages.length > 0) {
              updatedPages[0] = {
                ...updatedPages[0],
                items: updatedPages[0].items.filter(
                  (item) => item.user.clerkId !== user?.id
                ),
              };
            }

            return {
              ...oldData,
              pages: updatedPages,
            };
          }
        );

        return;
      }

      // like manual update
      queryClient.setQueryData(
        likeQueries.postLikes(postId).queryKey,
        (oldData) => {
          if (!oldData) return oldData;

          // Add the new like to the first page
          const updatedPages = [...oldData.pages];
          if (updatedPages.length > 0) {
            updatedPages[0] = {
              ...updatedPages[0],
              items: [data, ...updatedPages[0].items],
            };
          }

          return {
            ...oldData,
            pages: updatedPages,
          };
        }
      );
    },

    onSettled: (_, __, postId) => {
      queryClient.invalidateQueries({ queryKey: postQueries.lists().queryKey });
      queryClient.invalidateQueries({
        queryKey: postQueries.detail(postId).queryKey,
      });
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
