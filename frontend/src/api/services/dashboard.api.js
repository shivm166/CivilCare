import axiosInstance from "./axiosInstance";

export const getDashboardCounts = async () => {
  const res = await axiosInstance.get("/dashboard/counts");
  return res.data;
};
