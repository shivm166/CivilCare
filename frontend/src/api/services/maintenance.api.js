import apiClient from "./apiClient";

const BASE_URL = "/api/maintenance";

export const getMaintenanceRules = async () => {
  const response = await apiClient.get(BASE_URL);
  return response.data;
};

export const createMaintenanceRule = async (data) => {
  const response = await apiClient.post(BASE_URL, data);
  return response.data;
};

export const updateMaintenanceRule = async (id, data) => {
  const response = await apiClient.put(`${BASE_URL}/${id}`, data);
  return response.data;
};

export const deleteMaintenanceRule = async (id) => {
  const response = await apiClient.delete(`${BASE_URL}/${id}`);
  return response.data;
};
