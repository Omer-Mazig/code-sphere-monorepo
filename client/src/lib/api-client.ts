import axios from "axios";

// Create a base API client
const apiClient = axios.create({
  baseURL: "http://localhost:3000/api", // Updated with /api prefix
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Ensure cookies are sent with requests
});

// Note: The token is now manually added when needed by components
// using the useAuth hook from Clerk directly

export default apiClient;
