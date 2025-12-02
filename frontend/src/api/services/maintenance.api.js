// maintenance.api.js
import { axiosInstance } from "../axios";

export const createRule = async (ruleData) => {
  try {
    const res = await axiosInstance.post(
      "/admin/v1/maintenance/rule",
      ruleData
    );
    return res.data;
  } catch (error) {
    console.log("Error creating rule", error);
    throw error;
  }
};

export const getAllRules = async () => {
  try {
    const res = await axiosInstance.get("/admin/v1/maintenance/rule");
    return res.data;
  } catch (error) {
    console.log("Error fetching rules", error);
    throw error;
  }
};

export const getRuleById = async (id) => {
  try {
    const res = await axiosInstance.get(`/admin/v1/maintenance/rule/${id}`);
    return res.data;
  } catch (error) {
    console.log("Error fetching rule by ID", error);
    throw error;
  }
};

export const updateRule = async (id, data) => {
  try {
    const res = await axiosInstance.put(
      `/admin/v1/maintenance/rule/${id}`,
      data
    );
    return res.data;
  } catch (error) {
    console.log("Error updating rule", error);
    throw error;
  }
};

export const deleteRule = async (id) => {
  try {
    const res = await axiosInstance.delete(`/admin/v1/maintenance/rule/${id}`);
    return res.data;
  } catch (error) {
    console.log("Error deleting rule", error);
    throw error;
  }
};

/* ============================================================
   ADMIN: BILL APIs
============================================================ */

export const generateBill = async (billData) => {
  try {
    const res = await axiosInstance.post(
      "/admin/v1/maintenance/bill",
      billData
    );
    return res.data;
  } catch (error) {
    console.log("Error generating bill", error);
    throw error;
  }
};

export const getAllBills = async () => {
  try {
    const res = await axiosInstance.get("/admin/v1/maintenance/bill");
    return res.data;
  } catch (error) {
    console.log("Error fetching bills", error);
    throw error;
  }
};

export const getBillById = async (id) => {
  try {
    const res = await axiosInstance.get(`/admin/v1/maintenance/bill/${id}`);
    return res.data;
  } catch (error) {
    console.log("Error fetching bill by ID", error);
    throw error;
  }
};

export const deleteBill = async (id) => {
  try {
    const res = await axiosInstance.delete(`/admin/v1/maintenance/bill/${id}`);
    return res.data;
  } catch (error) {
    console.log("Error deleting bill", error);
    throw error;
  }
};

/* ============================================================
   USER: BILL APIs
============================================================ */

export const getUserBills = async () => {
  try {
    const res = await axiosInstance.get("/user/v1/maintenance/user/bills");
    return res.data;
  } catch (error) {
    console.log("Error fetching user bills", error);
    throw error;
  }
};

/* ============================================================
   PAYMENT APIs (ADMIN + USER)
============================================================ */

export const payMaintenanceBill = async (paymentData) => {
  try {
    const res = await axiosInstance.post(
      "/user/v1/maintenance/payment",
      paymentData
    );
    return res.data;
  } catch (error) {
    console.log("Error paying maintenance bill", error);
    throw error;
  }
};

export const getAllPayments = async () => {
  try {
    const res = await axiosInstance.get("/admin/v1/maintenance/payment");
    return res.data;
  } catch (error) {
    console.log("Error fetching payments", error);
    throw error;
  }
};

export const getPaymentsByBill = async (billId) => {
  try {
    const res = await axiosInstance.get(
      `/admin/v1/maintenance/payment/${billId}`
    );
    return res.data;
  } catch (error) {
    console.log("Error fetching bill payments", error);
    throw error;
  }
};

export const getPaymentById = async (id) => {
  try {
    const res = await axiosInstance.get(
      `/admin/v1/maintenance/payment/view/${id}`
    );
    return res.data;
  } catch (error) {
    console.log("Error fetching payment", error);
    throw error;
  }
};

export const deletePayment = async (id) => {
  try {
    const res = await axiosInstance.delete(
      `/admin/v1/maintenance/payment/delete/${id}`
    );
    return res.data;
  } catch (error) {
    console.log("Error deleting payment", error);
    throw error;
  }
};

/* ============================================================
   ADMIN: UNITS APIs
============================================================ */

export const getUnitsBySociety = async () => {
  try {
    const res = await axiosInstance.get("/admin/v1/maintenance/units");
    return res.data;
  } catch (error) {
    console.log("Error fetching units", error);
    throw error;
  }
};
