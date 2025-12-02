// /frontend/src/api/services/maintenance.api.js

import { axiosInstance } from "../axios";

const MAINTENANCE_API_BASE = "/admin/v1/maintenance";
const USER_MAINTENANCE_API_BASE = "/user/v1/maintenance";
// POST /admin/v1/maintenance/rule
export const createMaintenanceRule = (ruleData) =>
  axiosInstance.post(`${MAINTENANCE_API_BASE}/rule`, ruleData);

// GET /admin/v1/maintenance/rule
export const getMaintenanceRules = () =>
  axiosInstance.get(`${MAINTENANCE_API_BASE}/rule`);

// PUT /admin/v1/maintenance/rule/:id
export const updateMaintenanceRule = (id, ruleData) =>
  axiosInstance.put(`${MAINTENANCE_API_BASE}/rule/${id}`, ruleData);

// DELETE /admin/v1/maintenance/rule/:id
export const deleteMaintenanceRule = (id) =>
  axiosInstance.delete(`${MAINTENANCE_API_BASE}/rule/${id}`);

// POST /admin/v1/maintenance/bill
export const generateMaintenanceBill = (billData) =>
  axiosInstance.post(`${MAINTENANCE_API_BASE}/bill`, billData);

// GET /admin/v1/maintenance/bill
export const getAdminMaintenanceBills = () =>
  axiosInstance.get(`${MAINTENANCE_API_BASE}/bill`);

// --- USER API CALLS ---

// GET /user/v1/maintenance/bill (User's records)
export const getUserMaintenanceBills = () =>
  axiosInstance.get(`${USER_MAINTENANCE_API_BASE}/bill`);

// POST /user/v1/maintenance/payment (User pays)
export const payMaintenanceBill = (paymentData) =>
  axiosInstance.post(`${USER_MAINTENANCE_API_BASE}/payment`, paymentData);
