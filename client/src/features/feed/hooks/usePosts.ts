import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { getPosts, getPostById, createPost } from "../api/posts.api";
import { useAuthInterceptor } from "@/providers/auth-interceptor-provider";
import { useAuth } from "@clerk/clerk-react";
import { useSearchParams } from "react-router-dom";
import { CreatePostInput } from "../schemas/post.schema";

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

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: CreatePostInput) => createPost(post),
    onSuccess: (data) => {
      console.log("Post created successfully", data);
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
};
