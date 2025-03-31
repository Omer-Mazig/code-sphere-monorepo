import apiClient from "@/lib/api-client";
import {
  Comment,
  CreateCommentInput,
  UpdateCommentInput,
  commentSchema,
  commentsListSchema,
} from "../schemas/comment.schema";
import { paginationSchema } from "shared/schemas/pagination.schema";

/**
 * Fetch comments for a post
 */
export const getPostComments = async (postId: string): Promise<Comment[]> => {
  const response = await apiClient.get(`/comments?postId=${postId}`);
  try {
    return commentsListSchema.parse(response.data.data);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error parsing comments:", error);
    }
    throw error;
  }
};

/**
 * Get likes for a post with pagination
 */
export const getPostCommentsForDialog = async (
  postId: string,
  page = 1,
  limit = 10
) => {
  const response = await apiClient.get(
    `/comments?postId=${postId}&page=${page}&limit=${limit}`
  );

  const { items, pagination } = response.data.data;

  try {
    const parsedLikes = commentsListSchema.parse(items);
    const parsedPagination = paginationSchema.parse(pagination);

    return {
      items: parsedLikes,
      pagination: parsedPagination,
    };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
      console.log(response.data.data);
    }
    throw error;
  }
};

/**
 * Fetch replies for a comment
 */
export const getCommentReplies = async (
  commentId: string
): Promise<Comment[]> => {
  const response = await apiClient.get(`/comments?parentId=${commentId}`);
  return commentsListSchema.parse(response.data);
};

/**
 * Fetch a comment by ID
 */
export const getCommentById = async (id: string): Promise<Comment> => {
  const response = await apiClient.get(`/comments/${id}`);
  return commentSchema.parse(response.data);
};

/**
 * Create a new comment on a post
 */
export const createComment = async (
  data: CreateCommentInput
): Promise<Comment> => {
  const response = await apiClient.post("/comments", data);
  return commentSchema.parse(response.data);
};

/**
 * Create a reply to a comment
 */
export const createReply = async (
  data: CreateCommentInput
): Promise<Comment> => {
  const response = await apiClient.post("/comments", data);
  return commentSchema.parse(response.data);
};

/**
 * Update a comment
 */
export const updateComment = async (
  id: string,
  data: UpdateCommentInput
): Promise<Comment> => {
  const response = await apiClient.patch(`/comments/${id}`, data);
  return commentSchema.parse(response.data);
};

/**
 * Delete a comment
 */
export const deleteComment = async (id: string): Promise<void> => {
  await apiClient.delete(`/comments/${id}`);
};
