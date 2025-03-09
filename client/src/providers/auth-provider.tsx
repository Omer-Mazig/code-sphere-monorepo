import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import apiClient from "@/lib/api-client";

// Define the context type
type AuthContextType = {
  isLoading: boolean;
  isAuthenticated: boolean;
  isInterceptorReady: boolean;
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  isLoading: true,
  isAuthenticated: false,
  isInterceptorReady: false,
});

// Custom hook to use the auth context
export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [isInterceptorReady, setIsInterceptorReady] = useState(false);

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

      // Mark interceptor as ready
      setIsInterceptorReady(true);

      // Clean up function to remove the interceptor when the component unmounts
      return () => {
        apiClient.interceptors.request.eject(interceptorId);
        setIsInterceptorReady(false);
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
    isInterceptorReady,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
