import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:4001/api",
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
