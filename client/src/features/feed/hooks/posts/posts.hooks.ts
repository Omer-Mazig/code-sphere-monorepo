import {
  useMutation,
  useQueryClient,
  infiniteQueryOptions,
  queryOptions,
} from "@tanstack/react-query";
import {
  getPosts,
  getPostForDetail,
  createPost,
  updatePost,
  getPostForEdit,
} from "../../api/posts.api";
import { CreatePostInput, UpdatePostInput } from "../../schemas/post.schema";

const MAX_RETRIES = 3;

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

/**
 * Hook to create a new post
 * Returns a mutation for creating a post
 */
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: CreatePostInput) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postQueries.lists().queryKey });
    },
  });
};

/**
 * Hook to update an existing post
 * Returns a mutation for updating a post
 */
export const useUpdatePost = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: UpdatePostInput) => updatePost(post, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postQueries.lists().queryKey });
      queryClient.invalidateQueries({
        queryKey: postQueries.detail(id).queryKey,
      });
    },
  });
};

/**
 * Handles the retry logic for queries
 * Returns true if the query should be retried, false otherwise
 */
const handleRetry = (failureCount: number, error: unknown) => {
  // Retry on server errors (500+)
  if (
    error &&
    typeof error === "object" &&
    "status" in error &&
    typeof error.status === "number" &&
    error.status >= 500
  ) {
    return failureCount < MAX_RETRIES;
  }

  // Retry when server is down (status 0)
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    error.response &&
    typeof error.response === "object" &&
    "status" in error.response &&
    typeof error.response.status === "number" &&
    error.response.status === 0
  ) {
    return failureCount < MAX_RETRIES;
  }

  return false;
};
