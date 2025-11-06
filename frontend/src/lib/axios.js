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
    // 1. localStorage માંથી active society ID મેળવો.
    const activeSocietyId = localStorage.getItem("activeSocietyId");

    // 2. જો ID હોય, તો તેને Society-ID header માં જોડો.
    if (activeSocietyId) {
      config.headers["Society-ID"] = activeSocietyId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
