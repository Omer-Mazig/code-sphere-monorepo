import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { authApi } from "@/lib/api-client";

export function useSyncUser() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSynced, setIsSynced] = useState(false);

  useEffect(() => {
    // Only try to sync if the user is loaded and signed in
    if (!isLoaded || !isSignedIn || !user) {
      return;
    }

    // Skip if already synced or syncing
    if (isSynced || isSyncing) {
      return;
    }

    const syncUserToDatabase = async () => {
      try {
        setIsSyncing(true);
        setError(null);

        // Get the primary email
        const primaryEmail = user.primaryEmailAddress?.emailAddress;

        if (!primaryEmail) {
          throw new Error("User has no primary email address");
        }

        // Sync user to database
        await authApi.syncUser({
          id: user.id,
          firstName: user.firstName || undefined,
          lastName: user.lastName || undefined,
          primaryEmail,
        });

        setIsSynced(true);
        console.log("User successfully synced to database");
      } catch (err) {
        console.error("Error syncing user:", err);
        setError(
          err instanceof Error ? err.message : "Unknown error syncing user"
        );
      } finally {
        setIsSyncing(false);
      }
    };

    syncUserToDatabase();
  }, [user, isLoaded, isSignedIn, isSynced, isSyncing]);

  return {
    isSyncing,
    isSynced,
    error,
  };
}
