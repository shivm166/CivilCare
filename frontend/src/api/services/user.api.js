import { axiosInstance } from "../axios";

export const updateProfile = async (profileData) => {
  try {
    const response = await axiosInstance.put("/user/profile", profileData);
    // FIX: Return the entire response.data object, which contains { success, data, meta }
    return response.data;
  } catch (error) {
    console.log("Error in updating profile", error);
    throw error;
  }
};

export const getAllUsers = async () => {
  const res = await axiosInstance.get("/user");
  return res.data;
};
