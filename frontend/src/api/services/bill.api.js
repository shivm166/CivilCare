import { axiosInstance } from "../axios";

// ==================== ADMIN BILL APIs ====================

// Generate monthly bills
export const generateMonthlyBills = async (billingData) => {
  try {
    const response = await axiosInstance.post(
      "/maintenance/bills/generate", // ✅ Removed /admin prefix
      billingData
    );
    return { data: response.data.data, message: response.data.meta.message };
  } catch (error) {
    console.error("Error generating bills:", error);
    throw {
      message: error.response?.data?.meta?.message || "Failed to generate bills",
    };
  }
};

// Get all bills (admin)
export const getAllBills = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/maintenance/bills", { // ✅ Removed /admin prefix
      params,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching bills:", error);
    throw error;
  }
};

// Get bill by ID
export const getBillById = async (billId) => {
  try {
    const response = await axiosInstance.get(
      `/maintenance/bills/${billId}` // ✅ Removed /admin prefix
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching bill:", error);
    throw error;
  }
};

// Get member payment status
export const getMemberPaymentStatus = async (params = {}) => {
  try {
    const response = await axiosInstance.get(
      "/maintenance/bills/members/status", // ✅ Removed /admin prefix
      { params }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching member payment status:", error);
    throw error;
  }
};

// ==================== FUND APIs ====================

// Get fund summary
export const getFundSummary = async () => {
  try {
    const response = await axiosInstance.get("/maintenance/bills/funds/summary"); // ✅ Removed /admin prefix
    return response.data.data;
  } catch (error) {
    console.error("Error fetching fund summary:", error);
    throw error;
  }
};

// Get all transactions
export const getAllTransactions = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/maintenance/bills/funds/transactions", { // ✅ Removed /admin prefix
      params,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

// Withdraw funds
export const withdrawFunds = async (withdrawalData) => {
  try {
    const response = await axiosInstance.post(
      "/maintenance/bills/funds/withdraw", // ✅ Removed /admin prefix
      withdrawalData
    );
    return { data: response.data.data, message: response.data.meta.message };
  } catch (error) {
    console.error("Error withdrawing funds:", error);
    throw {
      message: error.response?.data?.meta?.message || "Failed to withdraw funds",
    };
  }
};

// ==================== USER PAYMENT APIs ====================

// Get my bills
export const getMyBills = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/maintenance/user/my-bills", { // ✅ Removed /admin prefix
      params,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching my bills:", error);
    throw error;
  }
};

// Get current month bill
export const getCurrentBill = async () => {
  try {
    const response = await axiosInstance.get("/maintenance/user/current-bill"); // ✅ Removed /admin prefix
    return response.data.data;
  } catch (error) {
    console.error("Error fetching current bill:", error);
    throw error;
  }
};

// Process payment
export const processPayment = async (paymentData) => {
  try {
    const response = await axiosInstance.post(
      "/maintenance/user/pay", // ✅ Removed /admin prefix
      paymentData
    );
    return { data: response.data.data, message: response.data.meta.message };
  } catch (error) {
    console.error("Error processing payment:", error);
    throw {
      message: error.response?.data?.meta?.message || "Payment failed",
    };
  }
};

// Get payment history
export const getMyPaymentHistory = async () => {
  try {
    const response = await axiosInstance.get("/maintenance/user/payment-history"); // ✅ Removed /admin prefix
    return response.data.data;
  } catch (error) {
    console.error("Error fetching payment history:", error);
    throw error;
  }
};

// Get user fund summary
export const getUserFundSummary = async () => {
  try {
    const response = await axiosInstance.get("/maintenance/user/funds"); // ✅ Removed /admin prefix
    return response.data.data;
  } catch (error) {
    console.error("Error fetching user fund summary:", error);
    throw error;
  }
};
