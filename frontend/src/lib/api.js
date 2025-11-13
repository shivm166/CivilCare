import { axiosInstance } from "./axios";

// ✅ Get currently logged-in user's profile
export const getProfile = async () => {
  try {
    const response = await axiosInstance.get("/user/profile");
    return response.data; // expects { success: true, user: {...} }
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

// ✅ Update profile (name only editable)
export const updateProfile = async (profileData) => {
  try {
    const response = await axiosInstance.put("/user/profile", profileData);
    return response.data; // expects { success, message, user }
  } catch (error) {
    console.log("Error in updating profile", error);
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

// ✅ Logout API
export const logout = async () => {
  try {
    const response = await axiosInstance.post("/user/logout");
    return response.data;
  } catch (error) {
    console.log("Error in logout", error);
  }
};
// ==================== REQUEST APIs ====================

// Search society by JoiningCode ⬅️ CHANGED
export const searchSocietyByCode = async (joiningCode) => {
  try {
    const response = await axiosInstance.get(
      `/request/society/search/${joiningCode}`
    );
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

// Super Admin API: stats
export const getSuperAdminStats = async () => {
  try {
    const res = await axiosInstance.get("/superadmin/v1/stats");
    return res.data;
  } catch (error) {
    console.error("Error fetching superadmin stats", error);
    throw error;
  }
};

// Get all societies (superadmin)
export const getAllSocieties = async () => {
  try {
    const res = await axiosInstance.get("/superadmin/v1/society");
    return res.data;
  } catch (error) {
    console.error("Error fetching societies", error);
    throw error;
  }
};

// Delete society
export const deleteSocietyById = async (id) => {
  try {
    const res = await axiosInstance.delete(`superadmin/v1/society/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting society", error);
    throw error;
  }
};

// Get all users (superadmin)
export const getAllUsers = async () => {
  try {
    const res = await axiosInstance.get("superadmin/v1/user");
    return res.data; // expect either { users: [...] } or [...]
  } catch (error) {
    console.error("Error fetching users", error);
    throw error;
  }
};

export const createComplaint = async (formdata) => {
  try {
    const res = await axiosInstance.post(
      "/complaint/createComplaint",
      formdata
    );
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching users", error);
    throw error;
  }
};

export const getMyComplaint = async () => {
  try {
    const res = await axiosInstance.get("complaint/getMyComplaints");
    return res.data;
  } catch (error) {
    console.error("Error fetching users", error);
    throw error;
  }
};

export const getAllComplaints = async () => {
  try {
    const res = await axiosInstance.get("/complaint/getAllComplaints");
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error(
      "Error fetching all complaints:",
      error.response?.data || error
    );
    throw error.response?.data || error;
  }
};

// 4. UPDATE COMPLAINT STATUS (Admin)
export const updateComplaintStatus = async (id, status) => {
  try {
    const res = await axiosInstance.patch(
      `/complaint/updateComplaint/${id}/status`,
      { status }
    );
    return res.data;
  } catch (error) {
    console.error("Error updating status:", error.response?.data || error);
    throw error.response?.data || error;
  }
};
export * from "./memberApi";
export * from "./activationApi";
export {
  getMyInvitations,
  acceptInvitation,
  rejectInvitation,
  getSentInvitations,
} from "./invitationApi";
