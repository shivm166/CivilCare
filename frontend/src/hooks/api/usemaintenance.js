import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMaintenanceRules,
  createMaintenanceRule,
  updateMaintenanceRule,
  deleteMaintenanceRule,
} from "../../api/services/maintenance.api";
import toast from "react-hot-toast";

export const useGetMaintenanceRules = (societyId) => {
  return useQuery({
    queryKey: ["maintenance-rules", societyId],
    queryFn: getMaintenanceRules,
    enabled: !!societyId,
  });
};

export const useCreateMaintenanceRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMaintenanceRule,
    onSuccess: () => {
      toast.success("Rule created successfully");
      queryClient.invalidateQueries({ queryKey: ["maintenance-rules"] });
    },
    onError: (err) =>
      toast.error(err.response?.data?.meta?.message || "Failed to create rule"),
  });
};

export const useUpdateMaintenanceRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMaintenanceRule,
    onSuccess: () => {
      toast.success("Rule updated successfully");
      queryClient.invalidateQueries({ queryKey: ["maintenance-rules"] });
    },
    onError: (err) => toast.error("Failed to update rule"),
  });
};

export const useDeleteMaintenanceRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMaintenanceRule,
    onSuccess: () => {
      toast.success("Rule deleted");
      queryClient.invalidateQueries({ queryKey: ["maintenance-rules"] });
    },
    onError: (err) => toast.error("Failed to delete rule"),
  });
};
