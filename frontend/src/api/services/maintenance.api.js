import { axiosInstance } from "../axios";

const BASE_URL = "/maintenance-rules";

export const getMaintenanceRules = async () => {
  const { data } = await axiosInstance.get(BASE_URL);
  return data.data; // Returns array of rules
};

export const createMaintenanceRule = async (ruleData) => {
  const { data } = await axiosInstance.post(BASE_URL, ruleData);
  return data.data;
};

export const updateMaintenanceRule = async ({ id, ...ruleData }) => {
  const { data } = await axiosInstance.put(`${BASE_URL}/${id}`, ruleData);
  return data.data;
};

export const deleteMaintenanceRule = async (id) => {
  const { data } = await axiosInstance.delete(`${BASE_URL}/${id}`);
  return data.data;
};
