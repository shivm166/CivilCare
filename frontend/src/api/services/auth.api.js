import { axiosInstance } from "../axios";

export const getProfile = async () => {
  try {
    const response = await axiosInstance.get("/user/profile");
    return response.data;
  } catch (error) {
    console.log("Error fetching profile", error);
    throw error;
  }
};

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
    throw error;
  }
};

export const login = async (loginData) => {
  try {
    const response = await axiosInstance.post("/user/login", loginData);
    return response.data;
  } catch (error) {
    console.log("Error in login", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await axiosInstance.post("/user/logout");
    return response.data;
  } catch (error) {
    console.log("Error in logout", error);
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await axiosInstance.post("/user/forgot-password", {
      email,
    });
    return response.data;
  } catch (error) {
    console.log("Error in forgot password", error);
    throw error;
  }
};

export const resetPassword = async (data) => {
  try {
    const response = await axiosInstance.post("/user/reset-password", data);
    return response.data;
  } catch (error) {
    console.log("Error in reset password", error);
    throw error;
  }
};
