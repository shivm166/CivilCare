import { axiosInstance } from "../axios";

export const getSocieties = async () => {
  try {
    const response = await axiosInstance.get("/user/societies");
    return response.data.societies;
  } catch (error) {
    console.log("Error in getting societies", error);
    throw error;
  }
};

export const createSociety = async (societyData) => {
  try {
    const response = await axiosInstance.post("/society/add", societyData);
    return response.data;
  } catch (error) {
    console.log("Error in creating society", error);
    throw error;
  }
};

export const searchSocietyByCode = async (joiningCode) => {
  try {
    const response = await axiosInstance.get(
      `/request/society/search/${joiningCode}`
    );
    return response.data;
  } catch (error) {
    console.log("Error in searching society", error);
    throw error;
  }
};

// ✅ ADD THIS NEW FUNCTION
export const getSocietyById = async (societyId) => {
  try {
    const response = await axiosInstance.get(`/society/${societyId}`);
    return response.data;
  } catch (error) {
    console.log("Error in getting society details", error);
    throw error;
  }
};