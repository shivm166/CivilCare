import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  generateMonthlyBills,
  getAllBills,
  getBillById,
  getMemberPaymentStatus,
  getFundSummary,
  getAllTransactions,
  withdrawFunds,
  getMyBills,
  getCurrentBill,
  processPayment,
  getMyPaymentHistory,
  getUserFundSummary,
} from "../../api/services/bill.api";

// ==================== ADMIN HOOKS ====================

// Generate bills
export const useGenerateBills = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: generateMonthlyBills,
    onSuccess: (data) => {
      toast.success(data.message || "Bills generated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-bills"] });
      queryClient.invalidateQueries({ queryKey: ["fund-summary"] });
      queryClient.invalidateQueries({ queryKey: ["member-payment-status"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to generate bills");
    },
  });
};

// Get all bills (admin)
export const useAdminBills = (params = {}) => {
  return useQuery({
    queryKey: ["admin-bills", params],
    queryFn: () => getAllBills(params),
  });
};

// Get bill by ID
export const useBillById = (billId) => {
  return useQuery({
    queryKey: ["bill", billId],
    queryFn: () => getBillById(billId),
    enabled: !!billId,
  });
};

// Get member payment status
export const useMemberPaymentStatus = (params = {}) => {
  return useQuery({
    queryKey: ["member-payment-status", params],
    queryFn: () => getMemberPaymentStatus(params),
  });
};

// Get fund summary (admin)
export const useFundSummary = () => {
  return useQuery({
    queryKey: ["fund-summary"],
    queryFn: getFundSummary,
  });
};

// Get all transactions
export const useTransactions = (params = {}) => {
  return useQuery({
    queryKey: ["transactions", params],
    queryFn: () => getAllTransactions(params),
  });
};

// Withdraw funds
export const useWithdrawFunds = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: withdrawFunds,
    onSuccess: (data) => {
      toast.success(data.message || "Funds withdrawn successfully");
      queryClient.invalidateQueries({ queryKey: ["fund-summary"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to withdraw funds");
    },
  });
};

// ==================== USER HOOKS ====================

// Get my bills
export const useMyBills = (params = {}) => {
  return useQuery({
    queryKey: ["my-bills", params],
    queryFn: () => getMyBills(params),
  });
};

// Get current bill
export const useCurrentBill = () => {
  return useQuery({
    queryKey: ["current-bill"],
    queryFn: getCurrentBill,
  });
};

// Process payment
export const useProcessPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: processPayment,
    onSuccess: (data) => {
      toast.success(data.message || "Payment successful");
      queryClient.invalidateQueries({ queryKey: ["my-bills"] });
      queryClient.invalidateQueries({ queryKey: ["current-bill"] });
      queryClient.invalidateQueries({ queryKey: ["payment-history"] });
      queryClient.invalidateQueries({ queryKey: ["user-fund-summary"] });
    },
    onError: (error) => {
      toast.error(error.message || "Payment failed");
    },
  });
};

// Get payment history
export const usePaymentHistory = () => {
  return useQuery({
    queryKey: ["payment-history"],
    queryFn: getMyPaymentHistory,
  });
};

// Get fund summary (user)
export const useUserFundSummary = () => {
  return useQuery({
    queryKey: ["user-fund-summary"],
    queryFn: getUserFundSummary,
  });
};
