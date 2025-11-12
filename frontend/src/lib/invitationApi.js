import { axiosInstance } from "./axios";

// ==================== INVITATION APIs ====================

// Get my invitations (for user)
export const getMyInvitations = async () => {
  try {
    const response = await axiosInstance.get("/invitation/my-invitations");
    return response.data;
  } catch (error) {
    console.log("Error fetching invitations", error);
    throw error;
  }
};

// Accept invitation
export const acceptInvitation = async (invitationId) => {
  try {
    const response = await axiosInstance.post(`/invitation/${invitationId}/accept`);
    return response.data;
  } catch (error) {
    console.log("Error accepting invitation", error);
    throw error;
  }
};

// Reject invitation
export const rejectInvitation = async (invitationId) => {
  try {
    const response = await axiosInstance.post(`/invitation/${invitationId}/reject`);
    return response.data;
  } catch (error) {
    console.log("Error rejecting invitation", error);
    throw error;
  }
};

// Get sent invitations (for admin)
export const getSentInvitations = async (societyId) => {
  try {
    const response = await axiosInstance.get(`/invitation/society/${societyId}/sent`);
    return response.data;
  } catch (error) {
    console.log("Error fetching sent invitations", error);
    throw error;
  }
};
