// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
  },
  USERS: {
    BASE: "/users",
    BY_ID: (id: string) => `/users/${id}`,
  },
  TODOS: {
    BASE: "/todos",
    BY_ID: (id: string) => `/todos/${id}`,
  },
};

// Application constants
export const APP_CONSTANTS = {
  PAGE_SIZE: 10,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_FILE_TYPES: ["image/jpeg", "image/png", "image/gif"],
};

// Add more constants as needed
