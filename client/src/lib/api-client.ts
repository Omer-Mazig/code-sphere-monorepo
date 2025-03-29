import axios, { AxiosResponse, AxiosError } from "axios";

const baseURL = import.meta.env.VITE_API_URL;

// Create a base API client
const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Ensure cookies are sent with requests
});

/**
 * Processes successful responses to handle API-specific success/error statuses
 */
const handleSuccessResponse = (
  response: AxiosResponse
): AxiosResponse | Promise<never> => {
  const data = response.data;

  // Check if response follows our standard format
  if (data && typeof data === "object" && "success" in data && "data" in data) {
    // Convert API-level failures to errors even if HTTP status was successful
    if (!data.success) {
      const error = {
        response: {
          status: data.status,
          data: {
            message: data.message || "Request failed",
            errors: data.errors,
          },
        },
      };
      return Promise.reject(error);
    }
  }

  return response;
};

/**
 * Handles server responses with error status codes
 */
const handleServerError = (error: AxiosError): AxiosError => {
  console.error("API Error:", error.response?.status, error.response?.data);

  // Handle specific error types
  if (error.response?.status === 401) {
    console.error("Authentication error - please log in again");
    // Here you could redirect to login or dispatch auth events
  }

  return error;
};

/**
 * Handles network errors (server unreachable)
 */
const handleNetworkError = (error: AxiosError): AxiosError => {
  console.error("Network Error:", error.request);

  // Create consistent error format for network failures
  error.response = {
    status: 0,
    data: {
      message: "Server is down or unreachable",
      errors: ["Network error - no response received from server"],
    },
  } as any;

  return error;
};

/**
 * Handles request setup errors
 */
const handleRequestError = (error: AxiosError): AxiosError => {
  console.error("Request Error:", error.message);
  return error;
};

// Add response interceptors
apiClient.interceptors.response.use(
  handleSuccessResponse,
  (error: AxiosError) => {
    // Process error based on type
    if (error.response) {
      // Server responded with error status
      handleServerError(error);
    } else if (error.request) {
      // No response received (network error)
      handleNetworkError(error);
    } else {
      // Error in request setup
      handleRequestError(error);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
