import axiosInstance from "./axiosInstance";

// Join society using code
export const joinSociety = async (payload) => {
  const res = await axiosInstance.post("/user-society/join", payload);
  return res.data;
};

// Get all users of society
export const getUsersOfSociety = async (societyId) => {
  const res = await axiosInstance.get(`/user-society/society/${societyId}`);
  return res.data;
};

// Get logged in user's society info
export const getMySociety = async () => {
  const res = await axiosInstance.get("/user-society/me");
  return res.data;
};

// Remove user
export const removeUser = async (relationId) => {
  const res = await axiosInstance.delete(`/user-society/${relationId}`);
  return res.data;
};

// Update role
export const updateUserRole = async (relationId, payload) => {
  const res = await axiosInstance.put(
    `/user-society/role/${relationId}`,
    payload
  );
  return res.data;
};
