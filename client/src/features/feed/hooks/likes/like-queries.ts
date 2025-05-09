import { queryOptions, infiniteQueryOptions } from "@tanstack/react-query";
import { getPostLikesForDialog } from "../../api/likes.api";
import { handleRetry } from "@/helpers/retry.helper";
// Query key factory for likes
export const likeQueries = {
  // ["likes"]
  all: () => queryOptions({ queryKey: ["likes"] }),

  // ["likes", "list"]
  lists: () =>
    queryOptions({ queryKey: [...likeQueries.all().queryKey, "list"] }),

  // ["likes", "list", "post", postId]
  postLikes: (postId: string, enabled: boolean = true) =>
    infiniteQueryOptions({
      queryKey: [...likeQueries.lists().queryKey, "post", postId],
      queryFn: ({ pageParam = 1 }) => getPostLikesForDialog(postId, pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        if (!lastPage.pagination.hasMore) return null;
        return lastPage.pagination.nextPage;
      },
      enabled,
      retry: (failureCount, error) => handleRetry(failureCount, error),
    }),
};
