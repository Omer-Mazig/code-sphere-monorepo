import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import {
  getPosts,
  getPostForDetail,
  getPostForEdit,
} from "../../api/posts.api";
import { handleRetry } from "@/helpers/retry.helper";

// TODO: change name to '[entity]QueryOptionsFactory
export const postQueries = {
  // ["posts"]
  all: () => queryOptions({ queryKey: ["posts"] }),

  // ["posts", "list"]
  lists: () =>
    queryOptions({
      queryKey: [...postQueries.all().queryKey, "list"],
    }),

  // ["posts", "list", filters]
  list: (
    filters: { sort?: string; tag?: string } = {},
    enabled: boolean = true
  ) =>
    infiniteQueryOptions({
      queryKey: [...postQueries.lists().queryKey, filters],
      queryFn: ({ pageParam = 1 }) => getPosts(filters, pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPageData) =>
        lastPageData.pagination.hasMore
          ? lastPageData.pagination.nextPage
          : undefined,
      retry: (failureCount, error) => handleRetry(failureCount, error),
      enabled,
    }),

  // ["posts", "detail"]
  details: () =>
    queryOptions({
      queryKey: [...postQueries.all().queryKey, "detail"],
    }),

  // ["posts", "detail", id]
  detail: (id: string) =>
    queryOptions({
      queryKey: [...postQueries.details().queryKey, id],
      queryFn: () => getPostForDetail(id),
      enabled: !!id,
      retry: (failureCount, error) => handleRetry(failureCount, error),
    }),

  // ["posts", "detail", id, "edit"]
  edit: (id: string) =>
    queryOptions({
      queryKey: [...postQueries.details().queryKey, id, "edit"],
      queryFn: () => getPostForEdit(id),
      enabled: !!id,
      retry: (failureCount, error) => handleRetry(failureCount, error),
    }),
};
