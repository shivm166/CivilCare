import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createRule,
  deleteRule,
  updateRule,
  getAllRules,
  getUserBills,
  payMaintenanceBill,
  getAllBills,
  getUnitsBySociety,
  generateBill,
} from "../../api/services/maintenance.api";
import toast from "react-hot-toast";

// Rule Management Hooks (Unchanged)
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

// =========================================================
// ADMIN: BILLS & UNITS HOOKS
// =========================================================

export const useGetAllMaintenanceBills = (societyId) => {
  return useQuery({
    queryKey: ["maintenance-bills", societyId],
    queryFn: getAllBills,
    enabled: !!societyId,
    refetchInterval: 60000,
    select: (data) => data?.bills || data?.data?.bills || [],
  });
};

export const useGetUnitsForBillGeneration = (societyId) => {
  return useQuery({
    queryKey: ["maintenance-units-for-bill", societyId],
    queryFn: getUnitsBySociety,
    enabled: !!societyId,
    select: (data) => data?.units || data?.data?.units || [],
  });
};

export const useGenerateMaintenanceBill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: generateBill,
    onSuccess: () => {
      toast.success("Bill generated successfully!");
      queryClient.invalidateQueries({ queryKey: ["maintenance-bills"] });
    },
    onError: (err) =>
      toast.error(
        err.response?.data?.meta?.message || "Failed to generate bill"
      ),
  });
};

// =========================================================
// USER: BILLS & PAYMENTS HOOKS (Unchanged from previous step)
// =========================================================

export const useGetUserMaintenanceBills = (societyId) => {
  return useQuery({
    queryKey: ["user-maintenance-bills", societyId],
    queryFn: getUserBills,
    enabled: !!societyId,
    refetchInterval: 60000,
  });
};

export const usePayMaintenanceBill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: payMaintenanceBill,
    onSuccess: (data) => {
      toast.success("Payment recorded successfully!");
      queryClient.invalidateQueries({ queryKey: ["user-maintenance-bills"] });
      queryClient.invalidateQueries({ queryKey: ["maintenance-bills"] });
    },
    onError: (err) =>
      toast.error(err.response?.data?.meta?.message || "Payment failed"),
  });
};
