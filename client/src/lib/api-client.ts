import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

// Create a base API client
const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Ensure cookies are sent with requests
});

// Add response interceptor for error handling and response unwrapping
apiClient.interceptors.response.use(
  (response) => {
    // Check if the response follows our standard format
    const data = response.data;
    if (
      data &&
      typeof data === "object" &&
      "success" in data &&
      "data" in data
    ) {
      // This is our standardized response format
      if (!data.success) {
        // If the backend says the request was not successful, convert it to an error
        return Promise.reject({
          response: {
            status: data.status,
            data: {
              message: data.message || "Request failed",
              errors: data.errors,
            },
          },
        });
      }

      // If successful, return only the data portion for backward compatibility
      return { ...response, data: data.data };
    }

    // If it's not in our standard format, return as is (for backward compatibility)
    return response;
  },
  (error) => {
    // Handle common errors here
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("API Error:", error.response.status, error.response.data);

      // Handle authentication errors
      if (error.response.status === 401) {
        // Redirect to login or show auth error
        console.error("Authentication error - please log in again");
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Network Error:", error.request);
      // Add status 0 for server down cases
      error.response = {
        status: 0,
        data: {
          message: "Server is down or unreachable",
          errors: ["Network error - no response received from server"],
        },
      };
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Request Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
