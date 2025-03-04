import { useSyncUser } from "@/hooks/use-sync-user";

/**
 * This component syncs the current Clerk user with our database
 * It should be rendered when a user is signed in
 */
export function UserSyncWrapper() {
  // This hook will automatically sync the user data with our database
  const { isSyncing, error } = useSyncUser();

  // This component doesn't render anything visible
  return null;
}
