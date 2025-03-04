import { useQuery } from "@tanstack/react-query";
import { profileApi } from "../api/users.api";

// Query key factory for posts
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: { sort?: string; tag?: string } = {}) =>
    [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

/**
 * Hook to fetch a post by id
 */
export const useGetUser = (id: string) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => profileApi.getUserById(id),
    enabled: !!id, // Only run the query if we have an id
  });
};
