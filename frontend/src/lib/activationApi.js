import { axiosInstance } from "./axios";

// ==================== ACTIVATION APIs ====================

// Activate invited user account
export const activateAccount = async (activationData) => {
  try {
    const response = await axiosInstance.post("/activation/activate", activationData);
    return response.data;
  } catch (error) {
    console.log("Error activating account", error);
    throw error;
  }
};

// Verify invitation token
export const verifyInvitationToken = async (token) => {
  try {
    const response = await axiosInstance.get(`/activation/verify/${token}`);
    return response.data;
  } catch (error) {
    console.log("Error verifying token", error);
    throw error;
  }
};

// Resend invitation
export const resendInvitation = async (email) => {
  try {
    const response = await axiosInstance.post("/activation/resend", { email });
    return response.data;
  } catch (error) {
    console.log("Error resending invitation", error);
    throw error;
  }
};
