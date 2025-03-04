import { useAuthSync } from "@/hooks/use-auth-sync";

/**
 * This component syncs the current Clerk user with our database
 * It should be rendered when a user is signed in
 */
export function UserSyncWrapper() {
  // This hook will automatically sync the user data with our database
  // and handle token management
  const { isSyncing, error, token } = useAuthSync();

  // Log any errors
  if (error) {
    console.error("Error syncing user:", error);
  }

  // This component doesn't render anything visible
  return null;
}
