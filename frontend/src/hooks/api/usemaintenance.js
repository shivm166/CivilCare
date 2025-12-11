import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
<<<<<<< HEAD
  createRule,
  deleteRule,
  updateRule,
  getAllRules,
  getUserBills,
  payMaintenanceBill,
  getAllBills,
  getUnitsBySociety,
  generateBill,
=======
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
>>>>>>> c9b2c6c07f1b3465b52e0deee538f8086a7897dc
} from "../../api/services/maintenance.api";

// ==================== RULE HOOKS ====================

// Get all maintenance rules
export const useMaintenanceRules = (params = {}) => {
  return useQuery({
<<<<<<< HEAD
    queryKey: ["maintenance-rules", societyId],
    queryFn: async () => {
      const raw = await getAllRules();
      return raw;
    },
    enabled: !!societyId,
    select: (raw) => {
      if (!raw) return [];
      if (Array.isArray(raw)) return raw;
      if (Array.isArray(raw.maintenanceRules)) return raw.maintenanceRules;
      if (Array.isArray(raw.data?.maintenanceRules)) return raw.data.maintenanceRules;
      if (Array.isArray(raw.data)) return raw.data;
      if (Array.isArray(raw.rules)) return raw.rules;
      if (Array.isArray(raw.data?.rules)) return raw.data.rules;
      return [];
    },
=======
    queryKey: ["maintenance-rules", params],
    queryFn: () => getAllMaintenanceRules(params),
>>>>>>> c9b2c6c07f1b3465b52e0deee538f8086a7897dc
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
<<<<<<< HEAD
    mutationFn: createRule,
    onSuccess: () => {
      toast.success("Rule created successfully");
      queryClient.invalidateQueries({
        predicate: (q) => q.queryKey?.[0] === "maintenance-rules",
      });
=======
    mutationFn: createMaintenanceRule,
    onSuccess: (data) => {
      toast.success(data.message || "Rule created successfully");
      queryClient.invalidateQueries({ queryKey: ["maintenance-rules"] });
>>>>>>> c9b2c6c07f1b3465b52e0deee538f8086a7897dc
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
<<<<<<< HEAD
    mutationFn: ({ id, ...data }) => updateRule(id, data),
    onSuccess: () => {
      toast.success("Rule updated successfully");
      queryClient.invalidateQueries({
        predicate: (q) => q.queryKey?.[0] === "maintenance-rules",
      });
=======
    mutationFn: ({ ruleId, ruleData }) =>
      updateMaintenanceRule(ruleId, ruleData),
    onSuccess: (data) => {
      toast.success(data.message || "Rule updated successfully");
      queryClient.invalidateQueries({ queryKey: ["maintenance-rules"] });
      queryClient.invalidateQueries({ queryKey: ["maintenance-rule"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update rule");
>>>>>>> c9b2c6c07f1b3465b52e0deee538f8086a7897dc
    },
  });
};

// Delete maintenance rule
export const useDeleteMaintenanceRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
<<<<<<< HEAD
    mutationFn: (id) => deleteRule(id),
    onSuccess: () => {
      toast.success("Rule deleted");
      queryClient.invalidateQueries({
        predicate: (q) => q.queryKey?.[0] === "maintenance-rules",
      });
=======
    mutationFn: deleteMaintenanceRule,
    onSuccess: (data) => {
      toast.success(data.message || "Rule deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["maintenance-rules"] });
>>>>>>> c9b2c6c07f1b3465b52e0deee538f8086a7897dc
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
    mutationFn: ({ billId, paymentData }) =>
      payMaintenanceBill(billId, paymentData),
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

export const useGetAllMaintenanceBills = (societyId) => {
  return useQuery({
    queryKey: ["maintenance-bills", societyId],
    queryFn: getAllBills,
    enabled: !!societyId,
    refetchInterval: 60000,
    select: (data) => data?.bills || data?.data?.bills || data || [],
  });
};

export const useGetUnitsForBillGeneration = (societyId) => {
  return useQuery({
    queryKey: ["maintenance-units-for-bill", societyId],
    queryFn: getUnitsBySociety,
    enabled: !!societyId,
    select: (data) => data?.units || data?.data?.units || data || [],
  });
};

export const useGenerateMaintenanceBill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: generateBill,
    onSuccess: () => {
      toast.success("Bill generated successfully!");
      queryClient.invalidateQueries({
        predicate: (q) => q.queryKey?.[0] === "maintenance-bills",
      });
    },
    onError: (err) =>
      toast.error(
        err.response?.data?.meta?.message || "Failed to generate bill"
      ),
  });
};

export const useGetUserMaintenanceBills = (societyId) => {
  return useQuery({
    queryKey: ["user-maintenance-bills", societyId],
    queryFn: getUserBills,
    enabled: !!societyId,
    refetchInterval: 60000,
    select: (data) => data?.bills || data?.data?.bills || data || [],
  });
};

export const usePayMaintenanceBill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: payMaintenanceBill,
    onSuccess: () => {
      toast.success("Payment recorded successfully!");
      queryClient.invalidateQueries({
        predicate: (q) =>
          q.queryKey?.[0] === "user-maintenance-bills" ||
          q.queryKey?.[0] === "maintenance-bills",
      });
    },
    onError: (err) =>
      toast.error(err.response?.data?.meta?.message || "Payment failed"),
  });
};
