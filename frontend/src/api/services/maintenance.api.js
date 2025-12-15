import { axiosInstance } from "../axios";

// ==================== MAINTENANCE RULE APIs ====================

// Create maintenance rule
export const createMaintenanceRule = async (ruleData) => {
  try {
    const response = await axiosInstance.post("/maintenance/rules", ruleData);
    return { data: response.data.data, message: response.data.meta.message };
  } catch (error) {
    console.error("Error creating maintenance rule:", error);
    throw {
      message: error.response?.data?.meta?.message || "Failed to create rule",
    };
  }
};

// Get all maintenance rules
export const getAllMaintenanceRules = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/maintenance/rules", { params });
    return response.data.data; // Returns { rules, count }
  } catch (error) {
    console.error("Error fetching maintenance rules:", error);
    throw error;
  }
};

// Get maintenance rule by ID
export const getMaintenanceRuleById = async (ruleId) => {
  try {
    const response = await axiosInstance.get(`/maintenance/rules/${ruleId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching maintenance rule:", error);
    throw error;
  }
};

// Update maintenance rule
export const updateMaintenanceRule = async (ruleId, ruleData) => {
  try {
    const response = await axiosInstance.put(
      `/maintenance/rules/${ruleId}`,
      ruleData
    );
    return { data: response.data.data, message: response.data.meta.message };
  } catch (error) {
    console.error("Error updating maintenance rule:", error);
    throw {
      message: error.response?.data?.meta?.message || "Failed to update rule",
    };
  }
};

// Delete maintenance rule
export const deleteMaintenanceRule = async (ruleId) => {
  try {
    const response = await axiosInstance.delete(`/maintenance/rules/${ruleId}`);
    return { message: response.data.meta.message };
  } catch (error) {
    console.error("Error deleting maintenance rule:", error);
    throw {
      message: error.response?.data?.meta?.message || "Failed to delete rule",
    };
  }
};

// Toggle rule status
export const toggleRuleStatus = async (ruleId) => {
  try {
    const response = await axiosInstance.patch(
      `/maintenance/rules/${ruleId}/toggle-status`
    );
    return { data: response.data.data, message: response.data.meta.message };
  } catch (error) {
    console.error("Error toggling rule status:", error);
    throw {
      message:
        error.response?.data?.meta?.message || "Failed to toggle rule status",
    };
  }
};

// ==================== MAINTENANCE BILL APIs ====================

// Generate monthly bills
export const generateMonthlyBills = async (billingData) => {
  try {
    const response = await axiosInstance.post(
      "/maintenance/bills/generate",
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
export const getAllMaintenanceBills = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/maintenance/bills", { params });
    return response.data.data; // Returns { bills, count }
  } catch (error) {
    console.error("Error fetching maintenance bills:", error);
    throw error;
  }
};

// Get bill by ID
export const getMaintenanceBillById = async (billId) => {
  try {
    const response = await axiosInstance.get(`/maintenance/bills/${billId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching maintenance bill:", error);
    throw error;
  }
};

// ==================== FUNDS APIs ====================

// Get funds summary
export const getFundsSummary = async () => {
  try {
    const response = await axiosInstance.get("/maintenance/funds/summary");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching funds summary:", error);
    throw error;
  }
};

// ==================== USER MAINTENANCE APIs ====================

// Get my maintenance bills
export const getMyMaintenanceBills = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/maintenance/user/my-bills", {
      params,
    });
    return response.data.data; // Returns { bills, count }
  } catch (error) {
    console.error("Error fetching my maintenance bills:", error);
    throw error;
  }
};

// Pay maintenance bill
export const payMaintenanceBill = async (paymentData) => {
  try {
    const response = await axiosInstance.post(
      "/maintenance/user/pay",
      paymentData
    );
    return { data: response.data.data, message: response.data.meta.message };
  } catch (error) {
    console.error("Error paying maintenance bill:", error);
    throw {
      message: error.response?.data?.meta?.message || "Failed to pay bill",
    };
  }
};

// Get my payment history
export const getMyPaymentHistory = async () => {
  try {
    const response = await axiosInstance.get(
      "/maintenance/user/payment-history"
    );
    return response.data.data; // Returns { payments, count }
  } catch (error) {
    console.error("Error fetching payment history:", error);
    throw error;
  }
};

// ✅ NEW: Get applicable maintenance for current user
export const getMyApplicableMaintenance = async () => {
  try {
    const response = await axiosInstance.get("/maintenance/user/applicable");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching applicable maintenance:", error);
    throw error;
  }
};
