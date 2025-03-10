import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { getPosts, getPostById } from "../api/posts.api";
import { useAuthContext } from "@/providers/auth-provider";
import { ZodError } from "zod";

// Query key factory for posts
export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (filters: { sort?: string; tag?: string } = {}) =>
    [...postKeys.lists(), filters] as const,
  details: () => [...postKeys.all, "detail"] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
  userPosts: (userId: string) => [...postKeys.all, "user", userId] as const,
  userLikedPosts: (userId: string) =>
    [...postKeys.all, "user", userId, "liked"] as const,
};

/**
 * Hook to fetch posts with infinite scrolling
 */
export const useGetInfinitePosts = (
  sort?: string,
  tag?: string,
  limit: number = 10
) => {
  const { isLoading: isAuthLoading, isInterceptorReady } = useAuthContext();

  return useInfiniteQuery({
    queryKey: postKeys.list({ sort, tag }),
    queryFn: ({ pageParam = 1 }) => getPosts(sort, tag, pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPageData) =>
      lastPageData.pagination.hasMore
        ? lastPageData.pagination.nextPage
        : undefined,
    enabled: !isAuthLoading && isInterceptorReady,
    retry: (failureCount, error: unknown) => {
      if (error instanceof ZodError) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

/**
 * Hook to fetch a post by id
 */

export const useGetPost = (id: string) => {
  const { isLoading: isAuthLoading, isInterceptorReady } = useAuthContext();

  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => getPostById(id),
    enabled: !!id && !isAuthLoading && isInterceptorReady,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404 || error instanceof ZodError) {
        return false;
      }
      return failureCount < 3;
    },
  });
};
