import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_BASE_URL = "/api/maintenance-rules";

// Fetch all maintenance rules for a society
export const useGetMaintenanceRules = (societyId) => {
  return useQuery({
    queryKey: ["maintenance-rules", societyId],
    queryFn: async () => {
      const { data } = await axios.get(API_BASE_URL);
      return data;
    },
    enabled: !!societyId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Create new maintenance rule
export const useCreateMaintenanceRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ruleData) => {
      const { data } = await axios.post(API_BASE_URL, ruleData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance-rules"] });
    },
  });
};

// Update maintenance rule
export const useUpdateMaintenanceRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...ruleData }) => {
      const { data } = await axios.put(`${API_BASE_URL}/${id}`, ruleData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance-rules"] });
    },
  });
};

// Delete maintenance rule
export const useDeleteMaintenanceRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axios.delete(`${API_BASE_URL}/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance-rules"] });
    },
  });
};

