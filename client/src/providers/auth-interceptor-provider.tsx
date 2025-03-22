import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import apiClient from "@/lib/api-client";

type AuthInterceptorContextType = {
  isInterceptorReady: boolean;
};

const AuthInterceptorContext = createContext<AuthInterceptorContextType>({
  isInterceptorReady: false,
});

export const useAuthInterceptor = () => {
  const context = useContext(AuthInterceptorContext);
  if (!context) {
    throw new Error(
      "useAuthInterceptor must be used within an AuthInterceptorProvider"
    );
  }
  return context;
};

const AuthInterceptorProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
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

  const contextValue: AuthInterceptorContextType = {
    isInterceptorReady,
  };

  return (
    <AuthInterceptorContext.Provider value={contextValue}>
      {children}
    </AuthInterceptorContext.Provider>
  );
};

export default AuthInterceptorProvider;
