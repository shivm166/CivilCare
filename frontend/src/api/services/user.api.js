import { axiosInstance } from "../axios";

export const updateProfile = async (profileData) => {
  try {
    const response = await axiosInstance.put("/user/profile", profileData);
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
