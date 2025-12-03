import { axiosInstance } from "../axios";

export const createRule = async (ruleData) => {
  const res = await axiosInstance.post("/admin/v1/maintenance/rule", ruleData);
  return res.data;
};

export const getAllRules = async () => {
  const res = await axiosInstance.get("/admin/v1/maintenance/rule");
  return res.data;
};

export const getRuleById = async (id) => {
  const res = await axiosInstance.get(`/admin/v1/maintenance/rule/${id}`);
  return res.data;
};

export const updateRule = async (id, data) => {
  const res = await axiosInstance.put(`/admin/v1/maintenance/rule/${id}`, data);
  return res.data;
};

export const deleteRule = async (id) => {
  const res = await axiosInstance.delete(`/admin/v1/maintenance/rule/${id}`);
  return res.data;
};

export const generateBill = async (billData) => {
  const res = await axiosInstance.post("/admin/v1/maintenance/bill", billData);
  return res.data;
};

export const getAllBills = async () => {
  const res = await axiosInstance.get("/admin/v1/maintenance/bill");
  return res.data;
};

export const getBillById = async (id) => {
  const res = await axiosInstance.get(`/admin/v1/maintenance/bill/${id}`);
  return res.data;
};

export const deleteBill = async (id) => {
  const res = await axiosInstance.delete(`/admin/v1/maintenance/bill/${id}`);
  return res.data;
};

export const getUserBills = async () => {
  const res = await axiosInstance.get("/user/v1/maintenance/bills");
  return res.data;
};

export const payMaintenanceBill = async (paymentData) => {
  const res = await axiosInstance.post(
    "/user/v1/maintenance/payment",
    paymentData
  );
  return res.data;
};

export const getAllPayments = async () => {
  const res = await axiosInstance.get("/admin/v1/maintenance/payment");
  return res.data;
};

export const getPaymentsByBill = async (billId) => {
  const res = await axiosInstance.get(
    `/admin/v1/maintenance/payment/${billId}`
  );
  return res.data;
};

export const getPaymentById = async (id) => {
  const res = await axiosInstance.get(
    `/admin/v1/maintenance/payment/view/${id}`
  );
  return res.data;
};

export const deletePayment = async (id) => {
  const res = await axiosInstance.delete(
    `/admin/v1/maintenance/payment/delete/${id}`
  );
  return res.data;
};

export const getUnitsBySociety = async () => {
  const res = await axiosInstance.get("/admin/v1/maintenance/units");
  return res.data;
};
