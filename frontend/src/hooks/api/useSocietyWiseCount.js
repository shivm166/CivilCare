import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "http://localhost:4001/api/admin";

const apiClient = axios.create({
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
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

const getSocietyStats = async () => {
  try {
    const response = await apiClient.get("/society-stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching society stats:", error);
    throw error;
  }
};

export const useSocietyWiseUserCount = () => {
  return useQuery({
    queryKey: ["societyStats"],
    queryFn: getSocietyStats,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    onError: (error) => {
      console.error("Failed to fetch society stats:", error);
    },
  });
};
