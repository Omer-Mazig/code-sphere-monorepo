import { queryOptions, infiniteQueryOptions } from "@tanstack/react-query";
import { getPostLikesForDialog } from "../../api/likes.api";

// Query key factory for likes
export const likeQueries = {
  all: () => queryOptions({ queryKey: ["likes"] }),
  lists: () =>
    queryOptions({ queryKey: [...likeQueries.all().queryKey, "list"] }),
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
    }),
};
