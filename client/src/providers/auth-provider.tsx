import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import apiClient from "@/lib/api-client";

type AuthContextType = {
  isLoading: boolean;
  isAuthenticated: boolean;
  isInterceptorReady: boolean;
};

const AuthContext = createContext<AuthContextType>({
  isLoading: true,
  isAuthenticated: false,
  isInterceptorReady: false,
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [isInterceptorReady, setIsInterceptorReady] = useState(false);

  useEffect(() => {
    const setupAuthInterceptor = async () => {
      if (!isLoaded) return;

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

      setIsInterceptorReady(true);

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
