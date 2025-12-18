import axios from "axios";
import { isTokenExpired, clearAuthData } from "../utils/tokenUtils";

const API_BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Attach Authorization header from localStorage if present
// Also check if token is expired before making request
axiosClient.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("aira_token");
    if (token) {
      // Check if token is expired
      if (isTokenExpired(token)) {
        // Token expired - clear auth data and redirect to login
        clearAuthData();
        
        // Redirect to login (trigger app reload)
        window.location.href = '/';
        
        // Reject the request
        return Promise.reject(new Error('Token expired'));
      }
      
      // Token is valid - attach to request
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    console.error('Error in request interceptor:', e);
  }
  return config;
});

// Handle 401 Unauthorized responses (expired or invalid token)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired on backend
      clearAuthData();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
