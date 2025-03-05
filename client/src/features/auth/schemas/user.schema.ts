import { z } from "zod";

// Schema for a Clerk user
export const userSchema = z.object({
  id: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  email: z.string().email().optional(),
  imageUrl: z.string().nullable(),
  username: z.string().nullable(),
});

// Schema for a list of users
export const usersResponseSchema = z.array(userSchema);

// Types derived from schemas
export type User = z.infer<typeof userSchema>;
export type UsersResponse = z.infer<typeof usersResponseSchema>;
