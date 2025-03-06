import axios from "axios";

// Create a base API client
const apiClient = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Ensure cookies are sent with requests
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
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
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Request Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
