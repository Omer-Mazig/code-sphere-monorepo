import { useMutation } from "@tanstack/react-query";

import { useQueryClient } from "@tanstack/react-query";
import { postQueries } from "./post-queries";
import { CreatePostInput, UpdatePostInput } from "../../schemas/post.schema";
import { createPost, updatePost } from "../../api/posts.api";

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
