import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from "../api/posts.api";

import { CreatePostInput, UpdatePostInput } from "../schemas/post.schema";
import { getUserPosts, getUserLikedPosts } from "@/features/user/api/users.api";
import { useAuthContext } from "@/providers/auth-provider";

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
export const useGetPosts = (
  sort?: string,
  tag?: string,
  limit: number = 10
) => {
  const { isLoading: isAuthLoading, isInterceptorReady } = useAuthContext();

  return useInfiniteQuery({
    queryKey: postKeys.list({ sort, tag }),
    queryFn: ({ pageParam = 1 }) => getPosts(sort, tag, pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextPage : undefined,
    // Only start the query once auth has been checked AND interceptor is ready
    enabled: !isAuthLoading && isInterceptorReady,
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
    // Only run the query if we have an id, auth is checked, and interceptor is ready
    enabled: !!id && !isAuthLoading && isInterceptorReady,
  });
};

/**
 * Hook to create a post
 */
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostInput) => createPost(data),
    onSuccess: () => {
      // Invalidate the posts list query to refetch posts
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
};

/**
 * Hook to update a post
 */
export const useUpdatePost = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePostInput) => updatePost(id, data),
    onSuccess: (updatedPost) => {
      // Update the cache for this specific post
      queryClient.setQueryData(postKeys.detail(id), updatedPost);
      // Invalidate the posts list query to refetch posts
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
};

/**
 * Hook to delete a post
 */
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePost(id),
    onSuccess: (_data, id) => {
      // Remove the post from the cache
      queryClient.removeQueries({ queryKey: postKeys.detail(id) });
      // Invalidate the posts list query to refetch posts
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
};

/**
 * Hook to fetch posts by a user with infinite scrolling
 */
export const useGetUserPosts = (userId: string, limit: number = 10) => {
  const { isLoading: isAuthLoading, isInterceptorReady } = useAuthContext();

  return useInfiniteQuery({
    queryKey: postKeys.userPosts(userId),
    queryFn: ({ pageParam = 1 }) => getUserPosts(userId, pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextPage : undefined,
    enabled: !!userId && !isAuthLoading && isInterceptorReady,
  });
};

/**
 * Hook to fetch liked posts by a user with infinite scrolling
 */
export const useGetUserLikedPosts = (userId: string, limit: number = 10) => {
  const { isLoading: isAuthLoading, isInterceptorReady } = useAuthContext();

  return useInfiniteQuery({
    queryKey: postKeys.userLikedPosts(userId),
    queryFn: ({ pageParam = 1 }) => getUserLikedPosts(userId, pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextPage : undefined,
    enabled: !!userId && !isAuthLoading && isInterceptorReady,
  });
};
