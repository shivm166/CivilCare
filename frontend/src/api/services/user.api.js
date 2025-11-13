import { axiosInstance } from "../axios";

export const updateProfile = async (profileData) => {
  try {
    const response = await axiosInstance.put("/user/profile", profileData);
    return response.data; // expects { success, message, user }
  } catch (error) {
    console.log("Error in updating profile", error);
    throw error;
  }
};
