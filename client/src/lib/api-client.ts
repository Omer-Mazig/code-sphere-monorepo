import axios from "axios";

// Create a base API client
const apiClient = axios.create({
  baseURL: "http://localhost:3000", // Update with your server URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth token here when you implement authentication
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors here
    if (error.response) {
      if (error.response.status === 401) {
        // Handle unauthorized errors
        console.error("Unauthorized");
      } else if (error.response.status === 404) {
        // Handle not found errors
        console.error("Resource not found");
      } else if (error.response.status >= 500) {
        // Handle server errors
        console.error("Server error");
      }
    } else if (error.request) {
      // Handle network errors
      console.error("Network error");
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
