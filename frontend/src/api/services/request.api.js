import { axiosInstance } from "../axios";
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
    const response = await axiosInstance.patch(`/request/${requestId}/accept`);
    return response.data;
  } catch (error) {
    console.log("Error in accepting request", error);
    throw error;
  }
};

// Reject a join request (admin only)
export const rejectRequest = async (requestId) => {
  try {
    const response = await axiosInstance.patch(`/request/${requestId}/reject`);
    return response.data;
  } catch (error) {
    console.log("Error in rejecting request", error);
    throw error;
  }
};
