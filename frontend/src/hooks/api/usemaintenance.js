import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  createMaintenanceRule,
  getAllMaintenanceRules,
  getMaintenanceRuleById,
  updateMaintenanceRule,
  deleteMaintenanceRule,
  toggleRuleStatus,
  generateMonthlyBills,
  getAllMaintenanceBills,
  getMaintenanceBillById,
  getFundsSummary,
  getMyMaintenanceBills,
  payMaintenanceBill,
  getMyPaymentHistory,
  getMyApplicableMaintenance,
} from "../../api/services/maintenance.api";


// Get all maintenance rules
export const useMaintenanceRules = (params = {}) => {
  return useQuery({
    queryKey: ["maintenance-rules", params],
    queryFn: () => getAllMaintenanceRules(params),
  });
};

// Get maintenance rule by ID
export const useMaintenanceRule = (ruleId) => {
  return useQuery({
    queryKey: ["maintenance-rule", ruleId],
    queryFn: () => getMaintenanceRuleById(ruleId),
    enabled: !!ruleId,
  });
};

// Create maintenance rule
export const useCreateMaintenanceRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMaintenanceRule,
    onSuccess: (data) => {
      toast.success(data.message || "Rule created successfully");
      queryClient.invalidateQueries({ queryKey: ["maintenance-rules"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create rule");
    },
  });
};

// Update maintenance rule
export const useUpdateMaintenanceRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ruleId, ruleData }) =>
      updateMaintenanceRule(ruleId, ruleData),
    onSuccess: (data) => {
      toast.success(data.message || "Rule updated successfully");
      queryClient.invalidateQueries({ queryKey: ["maintenance-rules"] });
      queryClient.invalidateQueries({ queryKey: ["maintenance-rule"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update rule");
    },
  });
};

// Delete maintenance rule
export const useDeleteMaintenanceRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMaintenanceRule,
    onSuccess: (data) => {
      toast.success(data.message || "Rule deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["maintenance-rules"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete rule");
    },
  });
};

// Toggle rule status
export const useToggleRuleStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleRuleStatus,
    onSuccess: (data) => {
      toast.success(data.message || "Rule status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["maintenance-rules"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to toggle rule status");
    },
  });
};

// ==================== BILL HOOKS ====================

// Generate monthly bills
export const useGenerateMonthlyBills = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generateMonthlyBills,
    onSuccess: (data) => {
      toast.success(data.message || "Bills generated successfully");
      queryClient.invalidateQueries({ queryKey: ["maintenance-bills"] });
      queryClient.invalidateQueries({ queryKey: ["funds-summary"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to generate bills");
    },
  });
};

// Get all maintenance bills (admin)
export const useMaintenanceBills = (params = {}) => {
  return useQuery({
    queryKey: ["maintenance-bills", params],
    queryFn: () => getAllMaintenanceBills(params),
  });
};

// Get maintenance bill by ID
export const useMaintenanceBill = (billId) => {
  return useQuery({
    queryKey: ["maintenance-bill", billId],
    queryFn: () => getMaintenanceBillById(billId),
    enabled: !!billId,
  });
};

// ==================== FUNDS HOOKS ====================

// Get funds summary
export const useFundsSummary = () => {
  return useQuery({
    queryKey: ["funds-summary"],
    queryFn: getFundsSummary,
  });
};

// ==================== USER HOOKS ====================

// Get my maintenance bills
export const useMyMaintenanceBills = (params = {}) => {
  return useQuery({
    queryKey: ["my-maintenance-bills", params],
    queryFn: () => getMyMaintenanceBills(params),
  });
};

// Pay maintenance bill
export const usePayMaintenanceBill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ billId, paymentData }) => payMaintenanceBill(billId, paymentData),
    onSuccess: (data) => {
      toast.success(data.message || "Payment successful");
      queryClient.invalidateQueries({ queryKey: ["my-maintenance-bills"] });
      queryClient.invalidateQueries({ queryKey: ["my-payment-history"] });
      queryClient.invalidateQueries({ queryKey: ["maintenance-bills"] });
      queryClient.invalidateQueries({ queryKey: ["funds-summary"] });
    },
    onError: (error) => {
      toast.error(error.message || "Payment failed");
    },
  });
};

// Get my payment history
export const useMyPaymentHistory = () => {
  return useQuery({
    queryKey: ["my-payment-history"],
    queryFn: getMyPaymentHistory,
  });
};

// ==================== ALIAS EXPORTS (for page compatibility) ====================

// Alias for MaintenanceRules.jsx compatibility
export const useToggleMaintenanceRuleStatus = useToggleRuleStatus;

// Alias for FundsManagement.jsx compatibility
export const useMaintenanceFunds = useFundsSummary;

// ✅ NEW: Get applicable maintenance (before bills are generated)
export const useMyApplicableMaintenance = () => {
  return useQuery({
    queryKey: ["my-applicable-maintenance"],
    queryFn: getMyApplicableMaintenance,
  });
};
