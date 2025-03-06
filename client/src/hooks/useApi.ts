import apiClient from "@/lib/api-client";
import { AxiosRequestConfig } from "axios";
import { useAuthContext } from "@/providers/AuthProvider";

/**
 * Custom hook that provides API methods
 * Now uses the global auth interceptor from AuthProvider
 */
export function useApi() {
  const { isAuthenticated } = useAuthContext();

  /**
   * Helper method to make API requests
   * The token is automatically added by the interceptor in AuthProvider
   */
  const request = async <T>(
    method: "get" | "post" | "put" | "delete" | "patch",
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    // Make the request with the appropriate method
    // Auth token is automatically added by the interceptor
    switch (method) {
      case "get":
        return apiClient.get<T>(url, config).then((res) => res.data);
      case "post":
        return apiClient.post<T>(url, data, config).then((res) => res.data);
      case "put":
        return apiClient.put<T>(url, data, config).then((res) => res.data);
      case "delete":
        return apiClient.delete<T>(url, config).then((res) => res.data);
      case "patch":
        return apiClient.patch<T>(url, data, config).then((res) => res.data);
    }
  };

  // Return an object with all the methods and auth status
  return {
    isAuthenticated,

    get: <T>(url: string, config?: AxiosRequestConfig) =>
      request<T>("get", url, undefined, config),

    post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
      request<T>("post", url, data, config),

    put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
      request<T>("put", url, data, config),

    delete: <T>(url: string, config?: AxiosRequestConfig) =>
      request<T>("delete", url, undefined, config),

    patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
      request<T>("patch", url, data, config),
  };
}

// For backward compatibility
export const useAuthenticatedApi = useApi;
