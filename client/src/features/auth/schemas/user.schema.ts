import { z } from "zod";

// Schema for a user
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  clerkId: z.string(),
  isAdmin: z.boolean().optional(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
});

// Schema for a list of users
export const usersResponseSchema = z.array(userSchema);

// Types derived from schemas
export type User = z.infer<typeof userSchema>;
export type UsersResponse = z.infer<typeof usersResponseSchema>;
