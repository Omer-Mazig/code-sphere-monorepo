import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import {
  getPosts,
  getPostForDetail,
  getPostForEdit,
} from "../../api/posts.api";
import { handleRetry } from "@/helpers/retry.helper";

export const postQueries = {
  /**
   * Query options for all posts
   * @returns Query options for all posts
   */
  all: () => queryOptions({ queryKey: ["posts"] }),

  /**
   * Query options for list of posts
   * @returns Query options for all lists of posts
   */
  lists: () =>
    queryOptions({
      queryKey: [...postQueries.all().queryKey, "list"],
    }),

  /**
   * Query options for list of posts
   * @param filters - Filters for the list of posts
   * @param enabled - Whether the query is enabled
   * @returns Query options for a specific list of posts
   */
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

  /**
   * Query options for detail of a post
   * @returns Query options for all details of a every post
   */
  details: () =>
    queryOptions({
      queryKey: [...postQueries.all().queryKey, "detail"],
    }),

  /**
   * Query options for detail of a post
   * @param id - ID of the post
   * @returns Query options for a specific detail of a post
   */
  detail: (id: string) =>
    queryOptions({
      queryKey: [...postQueries.details().queryKey, id],
      queryFn: () => getPostForDetail(id),
      enabled: !!id,
      retry: (failureCount, error) => handleRetry(failureCount, error),
    }),

  /**
   * Query options for edit of a post
   * @param id - ID of the post
   * @returns Query options for a specific edit of a post
   */
  edit: (id: string) =>
    queryOptions({
      queryKey: [...postQueries.details().queryKey, id, "edit"],
      queryFn: () => getPostForEdit(id),
      enabled: !!id,
      retry: (failureCount, error) => handleRetry(failureCount, error),
    }),
};
