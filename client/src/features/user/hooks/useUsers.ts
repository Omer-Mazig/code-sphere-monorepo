import { useQuery } from "@tanstack/react-query";
import {
  getUsers,
  getUserById,
  getCurrentUserProfile,
  getCurrentUserProfileComplete,
  getUserProfileComplete,
} from "../api/users.api";

// Query key factory for users
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: Record<string, unknown> = {}) =>
    [...userKeys.lists(), filters] as const,
  search: (query: string) => [...userKeys.lists(), "search", query] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  me: () => [...userKeys.all, "me"] as const,
};

/**
 * Hook to fetch all users
 */
export const useGetUsers = () => {
  return useQuery({
    queryKey: userKeys.list(),
    queryFn: () => getUsers(),
  });
};

/**
 * Hook to fetch a user by id
 */
export const useGetUser = (id: string) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
};

/**
 * Hook to fetch current user's profile
 */
export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: () => getCurrentUserProfile(),
  });
};

/**
 * Hook to fetch current user's profile with posts and likes in a single call
 */
export const useGetCurrentUserComplete = () => {
  return useQuery({
    queryKey: [...userKeys.me(), "complete"],
    queryFn: () => getCurrentUserProfileComplete(),
  });
};

/**
 * Hook to fetch user profile with complete data
 */
export const useGetUserProfileComplete = (userId: string) => {
  return useQuery({
    queryKey: [...userKeys.detail(userId), "complete"],
    queryFn: () => getUserProfileComplete(userId),
    enabled: !!userId,
  });
};
