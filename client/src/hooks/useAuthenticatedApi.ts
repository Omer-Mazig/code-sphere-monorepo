import { useAuth } from "@clerk/clerk-react";
import apiClient from "@/lib/api-client";
import { AxiosRequestConfig } from "axios";

/**
 * Custom hook that provides authenticated API methods
 * Must be used inside a component or another hook
 */
export function useAuthenticatedApi() {
  const { getToken } = useAuth();

  /**
   * Helper method to make authenticated requests
   */
  const authRequest = async <T>(
    method: "get" | "post" | "put" | "delete" | "patch",
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    // Get the token from Clerk
    const token = await getToken();

    // Create a config with the auth header
    const authConfig = {
      ...config,
      headers: {
        ...config?.headers,
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    };

    // Make the request with the appropriate method
    switch (method) {
      case "get":
        return apiClient.get<T>(url, authConfig).then((res) => res.data);
      case "post":
        return apiClient.post<T>(url, data, authConfig).then((res) => res.data);
      case "put":
        return apiClient.put<T>(url, data, authConfig).then((res) => res.data);
      case "delete":
        return apiClient.delete<T>(url, authConfig).then((res) => res.data);
      case "patch":
        return apiClient
          .patch<T>(url, data, authConfig)
          .then((res) => res.data);
    }
  };

  // Return an object with all the methods
  return {
    get: <T>(url: string, config?: AxiosRequestConfig) =>
      authRequest<T>("get", url, undefined, config),

    post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
      authRequest<T>("post", url, data, config),

    put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
      authRequest<T>("put", url, data, config),

    delete: <T>(url: string, config?: AxiosRequestConfig) =>
      authRequest<T>("delete", url, undefined, config),

    patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
      authRequest<T>("patch", url, data, config),
  };
}
