import { z } from "zod";
import { userSchema } from "../../auth/schemas/user.schema";

// Extended user schema for profile data
export const profileSchema = userSchema.extend({
  displayName: z.string().optional(),
  username: z.string().optional(),
  bio: z.string().optional(),
  avatarUrl: z.string().optional(),
  coverImageUrl: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional(),
  followersCount: z.number().default(0),
  followingCount: z.number().default(0),
  skills: z.array(z.string()).optional(),
  isFollowing: z.boolean().optional(),
});

// Schema for profile update
export const updateProfileSchema = z.object({
  displayName: z.string().min(2).optional(),
  username: z.string().min(3).optional(),
  bio: z.string().max(160).optional(),
  location: z.string().optional(),
  website: z.string().url().optional(),
  skills: z.array(z.string()).optional(),
});

// Schema for following/unfollowing
export const followSchema = z.object({
  userId: z.string(),
});

// Types derived from schemas
export type Profile = z.infer<typeof profileSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type FollowInput = z.infer<typeof followSchema>;
