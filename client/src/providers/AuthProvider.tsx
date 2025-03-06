import React, { createContext, useContext, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import apiClient from "@/lib/api-client";

// Define the context type
type AuthContextType = {
  isLoading: boolean;
  isAuthenticated: boolean;
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  isLoading: true,
  isAuthenticated: false,
});

// Custom hook to use the auth context
export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isLoaded, isSignedIn, getToken } = useAuth();

  useEffect(() => {
    // Setup an axios interceptor to add the token to every request
    const setupAuthInterceptor = async () => {
      // Only setup when Clerk is loaded
      if (!isLoaded) return;

      // Add a request interceptor
      const interceptorId = apiClient.interceptors.request.use(
        async (config) => {
          if (isSignedIn) {
            const token = await getToken();

            if (token) {
              config.headers.Authorization = `Bearer ${token}`;
            }
          }
          return config;
        }
      );

      // Clean up function to remove the interceptor when the component unmounts
      // or when the dependencies change
      return () => {
        apiClient.interceptors.request.eject(interceptorId);
      };
    };

    const cleanup = setupAuthInterceptor();
    return () => {
      cleanup.then((cleanupFn) => cleanupFn && cleanupFn());
    };
  }, [isLoaded, isSignedIn, getToken]);

  // The value to provide through the context
  const contextValue: AuthContextType = {
    isLoading: !isLoaded,
    isAuthenticated: isLoaded && isSignedIn === true,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
