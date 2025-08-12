import axios from 'axios';

// Create an Axios instance with default settings
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Make sure this is set in your .env file
  headers: {
    'Content-Type': 'application/json', // Default content type for API requests
  },
  withCredentials: true, // Ensure credentials (cookies) are sent if needed
});

// Add a request interceptor to attach the token to every request
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");
    if (token) {
      // Attach the token to the Authorization header if it exists
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
