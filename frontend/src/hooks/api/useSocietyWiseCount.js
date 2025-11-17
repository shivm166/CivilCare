import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "http://localhost:4001/api/admin";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const getSocietyStats = async (societyId = null) => {
  const params = societyId ? { societyId } : {};
  const response = await apiClient.get("/society-stats", { params });
  return response.data;
};

export const useSocietyWiseUserCount = (societyId = null) => {
  return useQuery({
    queryKey: ["societyStats", societyId],
    queryFn: () => getSocietyStats(societyId),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  });
};
