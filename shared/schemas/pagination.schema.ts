import { z } from "zod";

export const paginationSchema = z.object({
  total: z.number(),
  page: z.number().min(1),
  limit: z.number().min(1).max(50),
  lastPage: z.number().min(1),
  hasMore: z.boolean(),
  nextPage: z.number().nullable(),
});

export type Pagination = z.infer<typeof paginationSchema>;

export type PaginatedResponse<T> = {
  items: T[];
  pagination: Pagination;
};
