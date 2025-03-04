import { ReactNode, useEffect } from "react";
import { useAuthSync } from "@/hooks/use-auth-sync";
import { useAuth } from "@clerk/clerk-react";

interface AuthSyncProviderProps {
  children: ReactNode;
}

export function AuthSyncProvider({ children }: AuthSyncProviderProps) {
  const { isSyncing, error } = useAuthSync();
  const { isLoaded: isAuthLoaded } = useAuth();

  // Log any sync errors
  useEffect(() => {
    if (error) {
      console.error("Auth sync error:", error);
    }
  }, [error]);

  if (!isAuthLoaded) {
    return (
      <div className="flex justify-center p-8">Loading authentication...</div>
    );
  }

  // We don't need to block rendering once auth is loaded, even if syncing
  // is still in progress - the API client will handle retries if needed
  return <>{children}</>;
}
