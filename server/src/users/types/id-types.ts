/**
 * Type safety utilities for distinguishing between different types of IDs
 */

export type InternalUserId = string & { __brand: 'InternalUserId' };
export type ClerkUserId = string & { __brand: 'ClerkUserId' };

/**
 * Type guard functions
 */
export function asInternalId(id: string): InternalUserId {
  return id as InternalUserId;
}

export function asClerkId(id: string): ClerkUserId {
  return id as ClerkUserId;
}

/**
 * Type assertions - these throw errors if the format is invalid
 */
export function validateInternalId(id: string): InternalUserId {
  // UUID validation can be added here if needed
  if (!id || typeof id !== 'string') {
    throw new Error('Invalid internal user ID format');
  }
  return id as InternalUserId;
}

export function validateClerkId(id: string): ClerkUserId {
  if (!id || typeof id !== 'string') {
    throw new Error('Invalid Clerk user ID format');
  }
  // Add additional Clerk ID format validation if needed
  return id as ClerkUserId;
}
