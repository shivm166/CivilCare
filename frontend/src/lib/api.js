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

// ==================== REQUEST APIs ====================

// Search society by JoiningCode ⬅️ CHANGED
export const searchSocietyByCode = async (joiningCode) => {
  try {
    const response = await axiosInstance.get(`/request/society/search/${joiningCode}`);
    return response.data;
  } catch (error) {
    console.log("Error in searching society", error);
    throw error;
  }
};

// Send join request
export const sendJoinRequest = async (requestData) => {
  try {
    const response = await axiosInstance.post("/request/send", requestData);
    return response.data;
  } catch (error) {
    console.log("Error in sending join request", error);
    throw error;
  }
};

// Get user's own requests
export const getMyRequests = async () => {
  try {
    const response = await axiosInstance.get("/request/my-requests");
    return response.data;
  } catch (error) {
    console.log("Error in getting my requests", error);
    throw error;
  }
};

// Get all requests for a society (admin only)
export const getAllRequestsForSociety = async (societyId) => {
  try {
    const response = await axiosInstance.get(
      `/request/society/${societyId}/requests`
    );
    return response.data;
  } catch (error) {
    console.log("Error in getting society requests", error);
    throw error;
  }
};

// Accept a join request (admin only)
export const acceptRequest = async (requestId) => {
  try {
    const response = await axiosInstance.patch(
      `/request/${requestId}/accept`
    );
    return response.data;
  } catch (error) {
    console.log("Error in accepting request", error);
    throw error;
  }
};

// Reject a join request (admin only)
export const rejectRequest = async (requestId) => {
  try {
    const response = await axiosInstance.patch(
      `/request/${requestId}/reject`
    );
    return response.data;
  } catch (error) {
    console.log("Error in rejecting request", error);
    throw error;
  }
};
