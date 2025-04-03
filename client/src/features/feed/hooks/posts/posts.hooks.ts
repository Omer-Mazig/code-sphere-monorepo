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
  all: () => queryOptions({ queryKey: ["posts"] }), // ["posts"]

  lists: () =>
    queryOptions({
      queryKey: [...postQueries.all().queryKey, "list"],
    }),
  list: (
    filters: { sort?: string; tag?: string } = {},
    enabled: boolean = true
  ) =>
    infiniteQueryOptions({
      queryKey: [...postQueries.lists().queryKey, filters],
      queryFn: () => getPosts(filters),
      initialPageParam: 1,
      getNextPageParam: (lastPageData) =>
        lastPageData.pagination.hasMore
          ? lastPageData.pagination.nextPage
          : undefined,
      retry: (failureCount, error) => handleRetry(failureCount, error),
      enabled,
    }),

  details: () =>
    queryOptions({
      queryKey: [...postQueries.all().queryKey, "detail"],
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: [...postQueries.details().queryKey, id],
      queryFn: () => getPostForDetail(id),
      enabled: !!id,
      retry: (failureCount, error) => handleRetry(failureCount, error),
    }),
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
