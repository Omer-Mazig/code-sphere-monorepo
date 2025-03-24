import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getPosts,
  getPostForDetail,
  createPost,
  updatePost,
  getPostForEdit,
} from "../../api/posts.api";
import { useAuthInterceptor } from "@/providers/auth-interceptor-provider";
import { useAuth } from "@clerk/clerk-react";
import { useSearchParams } from "react-router-dom";
import { CreatePostInput, UpdatePostInput } from "../../schemas/post.schema";

const MAX_RETRIES = 3;

export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (filters: { sort?: string; tag?: string } = {}) =>
    [...postKeys.lists(), filters] as const,
  details: () => [...postKeys.all, "detail"] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
  edit: (id: string) => [...postKeys.details(), id, "edit"] as const,
  userPosts: (userId: string) => [...postKeys.all, "user", userId] as const,
  userLikedPosts: (userId: string) =>
    [...postKeys.all, "user", userId, "liked"] as const,
};

/**
 * Hook to get a list of posts with pagination
 * Returns an infinite query for paginated posts
 */
export const useGetInfinitePosts = (limit: number = 10) => {
  const { isInterceptorReady } = useAuthInterceptor();
  const { isLoaded } = useAuth();

  const [searchParams] = useSearchParams();

  const sort = searchParams.get("sort") || "latest";
  const tag = searchParams.get("tag") || undefined;

  return useInfiniteQuery({
    queryKey: postKeys.list({ sort, tag }),
    queryFn: ({ pageParam = 1 }) => getPosts(sort, tag, pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPageData) =>
      lastPageData.pagination.hasMore
        ? lastPageData.pagination.nextPage
        : undefined,
    enabled: isLoaded && isInterceptorReady,
    retry: (failureCount, error) => handleRetry(failureCount, error),
  });
};

/**
 * Hook to get a post for detail view
 * Returns a Post type which includes all fields
 */
export const useGetPostForDetail = (id: string) => {
  const { isInterceptorReady } = useAuthInterceptor();
  const { isLoaded } = useAuth();

  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => getPostForDetail(id),
    enabled: !!id && isLoaded && isInterceptorReady,
    retry: (failureCount, error) => handleRetry(failureCount, error),
  });
};

/**
 * Hook to get a post for editing
 * Only authorized users (post authors) can access this data
 * Returns a PostForEdit type which omits non-editable fields
 */
export const useGetPostForEdit = (id: string) => {
  const { isInterceptorReady } = useAuthInterceptor();
  const { isLoaded } = useAuth();

  return useQuery({
    queryKey: postKeys.edit(id),
    queryFn: () => getPostForEdit(id),
    enabled: !!id && isLoaded && isInterceptorReady,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => handleRetry(failureCount, error),
  });
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
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
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
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
};

/**
 * Handles the retry logic for queries
 * Returns true if the query should be retried, false otherwise
 */
const handleRetry = (failureCount: number, error: any) => {
  if (
    error &&
    typeof error === "object" &&
    "status" in error &&
    typeof error.status === "number" &&
    error.status >= 500
  ) {
    return failureCount < MAX_RETRIES;
  }
  return false;
};
