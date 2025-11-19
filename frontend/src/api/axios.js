import axios from "axios";

// let baseURL = "http://localhost:4001/api"
// if (import.meta.env.VITE_ENVIRONMENT == "production"){
//   baseURL = import.meta.env.VITE_BACKEND_URL+"/api"
// }

const BASE_URL =
  import.meta.env.VITE_ENVIRONMENT === "development"
    ? "http://localhost:4001/api"
    : import.meta.env.VITE_BACKEND_URL + "/api";

export const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to attach the active society ID for every request
axiosInstance.interceptors.request.use(
  (config) => {
    // 1. Get active society ID from localStorage
    const activeSocietyId = localStorage.getItem("activeSocietyId");

    // 2. If ID exists, attach it to the Society-ID header
    if (activeSocietyId) {
      config.headers["Society-ID"] = activeSocietyId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
