import { axiosInstance } from "../axios";

export const getSuperAdminStats = async () => {
  try {
    const res = await axiosInstance.get("/superadmin/v1/stats");
    return res.data;
  } catch (error) {
    console.error("Error fetching superadmin stats", error);
    throw error;
  }
};

// Get all societies (superadmin)
export const getAllSocieties = async () => {
  try {
    const res = await axiosInstance.get("/superadmin/v1/society");
    return res.data;
  } catch (error) {
    console.error("Error fetching societies", error);
    throw error;
  }
};

// Delete society
export const deleteSocietyById = async (id) => {
  try {
    const res = await axiosInstance.delete(`superadmin/v1/society/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting society", error);
    throw error;
  }
};

// Get all users (superadmin)
export const getAllUsers = async () => {
  try {
    const res = await axiosInstance.get("superadmin/v1/user");
    return res.data; // expect either { users: [...] } or [...]
  } catch (error) {
    console.error("Error fetching users", error);
    throw error;
  }
};
