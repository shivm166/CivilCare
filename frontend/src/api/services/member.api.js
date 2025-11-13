import { axiosInstance } from "../axios";
export const searchUserByEmail = async (email) => {
  try {
    const response = await axiosInstance.get(
      `/member/search-by-email?email=${encodeURIComponent(email)}`
    );
    return response.data;
  } catch (error) {
    console.log("Error searching user by email", error);
    throw error;
  }
};

// Get all members of a society
export const getSocietyMembers = async (societyId) => {
  try {
    const response = await axiosInstance.get(`/member/${societyId}/members`);
    return response.data;
  } catch (error) {
    console.log("Error fetching society members", error);
    throw error;
  }
};

// Add existing user to society
export const addExistingMember = async (societyId, userData) => {
  try {
    const response = await axiosInstance.post(
      `/member/${societyId}/members/add`,
      userData
    );
    return response.data;
  } catch (error) {
    console.log("Error adding member", error);
    throw error;
  }
};

// Invite new user to society
export const inviteNewMember = async (societyId, userData) => {
  try {
    const response = await axiosInstance.post(
      `/member/${societyId}/members/invite`,
      userData
    );
    return response.data;
  } catch (error) {
    console.log("Error inviting member", error);
    throw error;
  }
};

// Remove member from society
export const removeMember = async (societyId, memberId) => {
  try {
    const response = await axiosInstance.delete(
      `/member/${societyId}/members/${memberId}`
    );
    return response.data;
  } catch (error) {
    console.log("Error removing member", error);
    throw error;
  }
};

// Update member role
export const updateMemberRole = async (societyId, memberId, roleData) => {
  try {
    const response = await axiosInstance.patch(
      `/member/${societyId}/members/${memberId}/role`,
      roleData
    );
    return response.data;
  } catch (error) {
    console.log("Error updating member role", error);
    throw error;
  }
};
