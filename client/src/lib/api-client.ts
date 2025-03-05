import axios from "axios";

// Create a base API client
const apiClient = axios.create({
  baseURL: "http://localhost:3000/api", // Updated with /api prefix
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Ensure cookies are sent with requests
});

export default apiClient;
