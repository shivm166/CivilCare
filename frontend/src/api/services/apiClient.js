import axios from "axios"; // Galti 1: { axiosInstance } ki jagah 'axios' import karein

const API_URL = "http://localhost:4001/api";

const apiClient = axios.create({
  // Galti 1: 'axiosInstance' ki jagah 'axios' ka istemal karein
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
  
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

// Galti 2: Aap yeh line bhool gaye aakhir mein
export default apiClient;
