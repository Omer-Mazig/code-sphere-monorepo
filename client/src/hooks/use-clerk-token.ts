import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

export const useClerkToken = () => {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      if (isLoaded && isSignedIn) {
        try {
          const sessionToken = await getToken();
          setToken(sessionToken);
        } catch (error) {
          console.error("Error fetching Clerk token:", error);
          setToken(null);
        }
      } else if (isLoaded && !isSignedIn) {
        // User is not signed in
        setToken(null);
      }
      setIsLoading(false);
    };

    fetchToken();
  }, [getToken, isSignedIn, isLoaded]);

  return { token, isLoading, isAuthenticated: isSignedIn };
};

// Helper function to get the token synchronously from local storage
// Used for non-React contexts like API client interceptors
export const getClerkTokenSync = (): string | null => {
  try {
    // Try to get from localStorage first (this is a fallback)
    return window.localStorage.getItem("__clerk_db_jwt");
  } catch (error) {
    console.error("Error retrieving Clerk token:", error);
    return null;
  }
};
