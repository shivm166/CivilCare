import { axiosInstance } from "./axios";

export const getAuthUser = async () => {
  try {
    const response = await axiosInstance.get("/user/me");
    return response.data;
  } catch (error) {
    console.log("Error in authentication", error);
    return null;
  }
};

export const signup = async (signUpData) => {
  try {
    const response = await axiosInstance.post("/user/signup", signUpData);
    return response.data;
  } catch (error) {
    console.log("Error in signup", error);
    return null;
  }
};

export const login = async (loginData) => {
  const response = await axiosInstance.post("/user/login", loginData);
  return response.data;
};
