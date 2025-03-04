import axios from "axios";
import { getClerkTokenSync } from "@/hooks/use-clerk-token";

// Create a base API client
const apiClient = axios.create({
  baseURL: "http://localhost:3000/api", // Updated with /api prefix
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Ensure cookies are sent with requests
});

// Debug function to log API requests
const logRequest = (config) => {
  console.debug(
    `🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
    config
  );
  return config;
};

// Debug function to log API responses
const logResponse = (response) => {
  console.debug(
    `✅ API Response: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`,
    response.data
  );
  return response;
};

// Add request interceptor for authentication and logging
apiClient.interceptors.request.use(
  async (config) => {
    // Log the request for debugging
    logRequest(config);

    try {
      // Get the token using our helper function
      const token = getClerkTokenSync();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.debug("🔐 Auth token attached to request");
      } else {
        // Fallback to window.__clerk if available
        // @ts-ignore - clerk object is injected by Clerk
        const clerkObj = window.__clerk;
        if (clerkObj && clerkObj.session) {
          try {
            const sessionToken = await clerkObj.session.getToken();
            if (sessionToken) {
              config.headers.Authorization = `Bearer ${sessionToken}`;
              console.debug("🔐 Fallback auth token attached to request");
            }
          } catch (error) {
            console.error("Error getting Clerk session token:", error);
          }
        } else {
          console.debug("⚠️ No auth token available for request");
        }
      }
    } catch (error) {
      console.error("Error setting auth token:", error);
    }

    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for handling errors and logging
apiClient.interceptors.response.use(
  (response) => {
    // Log successful response
    logResponse(response);
    return response;
  },
  (error) => {
    // Log error details for debugging
    if (error.response) {
      console.error(
        `❌ API Error ${error.response.status}: ${error.config.method?.toUpperCase()} ${error.config.url}`,
        error.response.data
      );

      if (error.response.status === 401) {
        // Handle unauthorized errors
        console.error(
          "Unauthorized - You need to be logged in to access this resource"
        );
      } else if (error.response.status === 404) {
        // Handle not found errors
        console.error("Resource not found - The requested item doesn't exist");
      } else if (error.response.status === 500) {
        // Handle server errors
        console.error(
          "Server error - There was a problem processing your request"
        );
      }
    } else if (error.request) {
      // Handle network errors
      console.error(
        "Network error - Unable to connect to the server",
        error.request
      );
    } else {
      // Handle other errors
      console.error("Error", error.message);
    }

    return Promise.reject(error);
  }
);

// Auth-related API calls
export const authApi = {
  // Sync user to database after login with Clerk
  syncUser: async (userData: {
    id: string;
    firstName?: string;
    lastName?: string;
    primaryEmail: string;
  }) => {
    try {
      const response = await apiClient.post("/auth/sync-user", userData);
      return response.data;
    } catch (error) {
      console.error("Error syncing user:", error);
      throw error;
    }
  },
};

export default apiClient;
