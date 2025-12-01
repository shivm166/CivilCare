import axios from "axios";

// let baseURL = "http://localhost:4001/api";
// if (import.meta.env.VITE_ENVIRONMENT == "production") {
//   baseURL = import.meta.env.VITE_BACKEND_URL + "/api";
// }

const baseURL =
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

axiosInstance.interceptors.request.use(
  (config) => {
    // 1 Get active society ID from localStorage
    const activeSocietyId = localStorage.getItem("activeSocietyId");

    if (activeSocietyId) {
      config.headers["Society-ID"] = activeSocietyId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
