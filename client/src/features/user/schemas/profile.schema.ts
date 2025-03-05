import { z } from "zod";
import { userSchema } from "../../auth/schemas/user.schema";

// We no longer need to extend userSchema since it already contains basic profile fields
// from Clerk. We'll create a separate schema for additional profile data.
export const profileSchema = userSchema.extend({
  bio: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional(),
  followersCount: z.number().default(0),
  followingCount: z.number().default(0),
  skills: z.array(z.string()).optional(),
  isFollowing: z.boolean().optional(),
});

// Schema for list of profiles
export const profilesResponseSchema = z.array(profileSchema);

// Schema for profile update
export const updateProfileSchema = z.object({
  bio: z.string().max(160).optional(),
  location: z.string().optional(),
  website: z.string().url().optional(),
  skills: z.array(z.string()).optional(),
});

// Schema for following/unfollowing
export const followSchema = z.object({
  followingClerkId: z.string(),
});

// Types derived from schemas
export type Profile = z.infer<typeof profileSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type FollowInput = z.infer<typeof followSchema>;
