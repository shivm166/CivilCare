// /frontend/src/hooks/api/useMaintenance.js

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createMaintenanceRule,
  getMaintenanceRules,
  updateMaintenanceRule,
  deleteMaintenanceRule,
  generateMaintenanceBill,
  getAdminMaintenanceBills,
  getUserMaintenanceBills,
  payMaintenanceBill,
} from "../../api/services/maintenance.api";

// Query keys for caching
const QUERY_KEYS = {
  RULES: "maintenanceRules",
  ADMIN_BILLS: "adminMaintenanceBills",
  USER_BILLS: "userMaintenanceBills",
};

// --- ADMIN HOOKS ---

export const useMaintenanceRules = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.RULES],
    queryFn: getMaintenanceRules,
    select: (data) => data.data.maintenanceRules, // Adjust based on your response structure
  });
};

export const useCreateRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMaintenanceRule,
    // On success, invalidate the rules query to refetch the list
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RULES] });
    },
  });
};

export const useUpdateRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => updateMaintenanceRule(data.id, data.ruleData),
    // On success, invalidate the rules query
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RULES] });
    },
  });
};

export const useDeleteRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMaintenanceRule,
    // On success, invalidate the rules query
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RULES] });
    },
  });
};

export const useGenerateBill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: generateMaintenanceBill,
    // On success, invalidate the admin bills query to show the new bill
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_BILLS] });
    },
  });
};

export const useAdminMaintenanceBills = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN_BILLS],
    queryFn: getAdminMaintenanceBills,
    select: (data) => data.data.bills,
  });
};

// --- USER HOOKS ---

export const useUserMaintenanceBills = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.USER_BILLS],
    queryFn: getUserMaintenanceBills,
    select: (data) => data.data.bills,
  });
};

// Hook for user to pay a bill
export const usePayMaintenance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: payMaintenanceBill,
    onSuccess: (response) => {
      const updatedBill = response.data.updatedBill;

      // Update the cache for the user's bill list immediately
      // without a full refetch for a smoother UX.
      queryClient.setQueryData([QUERY_KEYS.USER_BILLS], (oldBills) => {
        if (!oldBills) return [];
        return oldBills.map((bill) =>
          bill._id === updatedBill._id ? updatedBill : bill
        );
      });

      // Invalidate the admin list as well, as its data changed
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_BILLS] });
    },
  });
};
