import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  getPosts,
  getPostById,
  getUserPosts,
  getUserLikedPosts,
} from "../api/posts.api";
import { useAuthInterceptor } from "@/providers/auth-interceptor-provider";
import { ZodError } from "zod";
import { useAuth } from "@clerk/clerk-react";
import { useSearchParams } from "react-router-dom";

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
  limit: number = 10,
  maxRetries: number = 3
) => {
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
    retry: (failureCount, error) => {
      if (
        error &&
        typeof error === "object" &&
        "status" in error &&
        typeof error.status === "number" &&
        error.status >= 500
      ) {
        return failureCount < maxRetries;
      }
      return false;
    },
  });
};

/**
 * Hook to fetch a post by id
 */

export const useGetPost = (id: string, maxRetries: number = 3) => {
  const { isInterceptorReady } = useAuthInterceptor();
  const { isLoaded } = useAuth();

  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => getPostById(id),
    enabled: !!id && isLoaded && isInterceptorReady,
    retry: (failureCount, error) => {
      if (
        error &&
        typeof error === "object" &&
        "status" in error &&
        typeof error.status === "number" &&
        error.status >= 500
      ) {
        return failureCount < maxRetries;
      }
      return false;
    },
  });
};

/**
 * Hook to fetch posts by a specific user
 */
export const useGetUserPosts = (userId: string, limit: number = 10) => {
  const { isInterceptorReady } = useAuthInterceptor();
  const { isLoaded } = useAuth();

  return useInfiniteQuery({
    queryKey: postKeys.userPosts(userId),
    queryFn: ({ pageParam = 1 }) => getUserPosts(userId, pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPageData) =>
      lastPageData.pagination.hasMore
        ? lastPageData.pagination.nextPage
        : undefined,
    enabled: !!userId && isLoaded && isInterceptorReady,
    retry: (failureCount, error) => {
      if (error instanceof ZodError) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

/**
 * Hook to fetch posts liked by a specific user
 */
export const useGetUserLikedPosts = (userId: string, limit: number = 10) => {
  const { isInterceptorReady } = useAuthInterceptor();
  const { isLoaded } = useAuth();

  return useInfiniteQuery({
    queryKey: postKeys.userLikedPosts(userId),
    queryFn: ({ pageParam = 1 }) => getUserLikedPosts(userId, pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPageData) =>
      lastPageData.pagination.hasMore
        ? lastPageData.pagination.nextPage
        : undefined,
    enabled: !!userId && isLoaded && isInterceptorReady,
    retry: (failureCount, error) => {
      if (error instanceof ZodError) {
        return false;
      }
      return failureCount < 3;
    },
  });
};
