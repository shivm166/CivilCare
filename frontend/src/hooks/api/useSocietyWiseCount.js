// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";

// const API_URL = "http://localhost:4001/api/admin";

// const apiClient = axios.create({
//   baseURL: API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// apiClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// const getSocietyStats = async (societyId = null) => {
//   const params = societyId ? { societyId } : {};
//   const response = await apiClient.get("/society-stats", { params });
//   return response.data;
// };

// export const useSocietyWiseUserCount = (societyId = null) => {
//   return useQuery({
//     queryKey: ["societyStats", societyId],
//     queryFn: () => getSocietyStats(societyId),
//     staleTime: 5 * 60 * 1000,
//     refetchOnWindowFocus: false,
//     retry: 2,
//   });
// };

import { useQuery } from "@tanstack/react-query";
// Purane axios ki jagah naya apiClient import karein
import apiClient from "../../api/apiClient"; // Path ko adjust karein// Path ko adjust karein

// Society Stats fetch karne ka function
const getSocietyStats = async (societyId = null) => {
  const params = societyId ? { societyId } : {};

  // Yahan /admin/ add karein, kyunki hamara baseURL sirf /api tak hai
  const response = await apiClient.get("/admin/society-stats", { params });
  return response.data;
};

// Society Details fetch karne ka function (aapke routes ke hisab se)
const getSocietyDetails = async (societyId) => {
  const response = await apiClient.get(`/admin/society/${societyId}`);
  return response.data;
};

// --- Aapke Hooks ---

export const useSocietyStats = (societyId = null) => {
  return useQuery({
    queryKey: ["societyStats", societyId],
    queryFn: () => getSocietyStats(societyId),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

export const useSocietyDetails = (societyId) => {
  return useQuery({
    queryKey: ["societyDetails", societyId],
    queryFn: () => getSocietyDetails(societyId),
    enabled: !!societyId, // Yeh tabhi run hoga jab societyId maujood ho
  });
};
