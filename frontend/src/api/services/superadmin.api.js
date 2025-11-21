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

export const getSocietyById = async (id) => {
  try {
    const res = await axiosInstance.get(`/superadmin/v1/society/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching society", error);
    throw error;
  }
}

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

export const createSociety = async (societyData) => {
  try {
    const res = await axiosInstance.post("/superadmin/v1/society", societyData);
    return res.data;
  } catch (error) {
    console.error("Error creating society", error);
    throw error;
  }
};

export const updateSociety = async (id, societyData) => {
  try {
    const res = await axiosInstance.patch(`/superadmin/v1/society/${id}`, societyData);
    return res.data;
  } catch (error) {
    console.error("Error updating society", error);
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

export const getUserById = async (id) => {
  try {
    const res = await axiosInstance.get(`/superadmin/v1/user/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching user", error);
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const res = await axiosInstance.patch(`/superadmin/v1/user/${id}`, userData);
    return res.data;
  } catch (error) {
    console.error("Error updating user", error);
    throw error;
  }
};

export const deleteUserById = async (id) => {
  try {
    const res = await axiosInstance.delete(`/superadmin/v1/user/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting user", error);
    throw error;
  }
};