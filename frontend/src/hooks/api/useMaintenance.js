import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createRule,
  deleteRule,
  updateRule,
  getAllRules,
} from "../../api/services/maintenance.api";
import toast from "react-hot-toast";

export const useGetMaintenanceRules = (societyId) => {
  return useQuery({
    queryKey: ["maintenance-rules", societyId],
    queryFn: getAllRules,
    enabled: !!societyId,
  });
};

export const useCreateMaintenanceRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRule,
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
    mutationFn: updateRule,
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
    mutationFn: deleteRule,
    onSuccess: () => {
      toast.success("Rule deleted");
      queryClient.invalidateQueries({ queryKey: ["maintenance-rules"] });
    },
    onError: (err) => toast.error("Failed to delete rule"),
  });
};