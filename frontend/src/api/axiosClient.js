import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Attach Authorization header from localStorage if present
axiosClient.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("aira_token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore
  }
  return config;
});

export default axiosClient;
