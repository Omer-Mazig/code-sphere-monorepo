import { useUser, useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { authApi } from "@/lib/api-client";

export function useAuthSync() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { getToken, isSignedIn, isLoaded: isAuthLoaded } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSynced, setIsSynced] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Get and set token
  useEffect(() => {
    const setupToken = async () => {
      if (isAuthLoaded && isSignedIn) {
        try {
          const token = await getToken();
          setAuthToken(token);

          // Store token in localStorage for API client use
          if (token) {
            window.localStorage.setItem("__clerk_db_jwt", token);
          }
        } catch (error) {
          console.error("Error getting token:", error);
        }
      } else if (isAuthLoaded && !isSignedIn) {
        // Clean up token if user is not signed in
        setAuthToken(null);
        window.localStorage.removeItem("__clerk_db_jwt");
      }
    };

    setupToken();
  }, [getToken, isSignedIn, isAuthLoaded]);

  // Sync user to backend
  useEffect(() => {
    // Only try to sync if the user is loaded and signed in
    if (!isUserLoaded || !isAuthLoaded || !isSignedIn || !user || !authToken) {
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
  }, [
    user,
    isUserLoaded,
    isAuthLoaded,
    isSignedIn,
    isSynced,
    isSyncing,
    authToken,
  ]);

  return {
    isSyncing,
    isSynced,
    error,
    token: authToken,
    isAuthenticated: isSignedIn && !!authToken,
  };
}
