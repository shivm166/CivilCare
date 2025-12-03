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

export const useGetMaintenanceRules = (societyId) => {
  return useQuery({
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
  });
};

export const useCreateMaintenanceRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRule,
    onSuccess: () => {
      toast.success("Rule created successfully");
      queryClient.invalidateQueries({
        predicate: (q) => q.queryKey?.[0] === "maintenance-rules",
      });
    },
    onError: (err) =>
      toast.error(err.response?.data?.meta?.message || "Failed to create rule"),
  });
};

export const useUpdateMaintenanceRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => updateRule(id, data),
    onSuccess: () => {
      toast.success("Rule updated successfully");
      queryClient.invalidateQueries({
        predicate: (q) => q.queryKey?.[0] === "maintenance-rules",
      });
    },
    onError: (err) => toast.error("Failed to update rule"),
  });
};

export const useDeleteMaintenanceRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteRule(id),
    onSuccess: () => {
      toast.success("Rule deleted");
      queryClient.invalidateQueries({
        predicate: (q) => q.queryKey?.[0] === "maintenance-rules",
      });
    },
    onError: (err) => toast.error("Failed to delete rule"),
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
