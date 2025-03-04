import { useAuth as useClerkAuth, useUser } from "@clerk/clerk-react";

export function useAuth() {
  const { isSignedIn, isLoaded, signOut } = useClerkAuth();
  const { user } = useUser();

  return {
    isAuthenticated: isSignedIn,
    isLoading: !isLoaded,
    user,
    signOut,
    // Add any other auth-related functionality here
  };
}
