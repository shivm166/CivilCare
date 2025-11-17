import axios from "axios";

// Base URL ko /api par rakhein, /admin par nahi.
// Isse aap /api/user/me jaisi doosri calls bhi kar payenge.
const API_URL = "http://localhost:4001/api";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor jo har request ke saath token bhejega
apiClient.interceptors.request.use(
  (config) => {
    // Key ka naam ('token') wahi hona chahiye jo login mein set kiya tha
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
