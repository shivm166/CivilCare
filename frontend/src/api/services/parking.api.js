import { axiosInstance } from "../axios";

// ==================== PARKING APIs ====================

// Allocate unit-based parking
export const allocateUnitParking = async (parkingData) => {
  try {
    const response = await axiosInstance.post(
      "/parking/unit-parking",
      parkingData
    );
    // ✅ Backend uses sendSuccessResponse which returns { success, data, meta }
    return { data: response.data.data, message: response.data.meta.message };
  } catch (error) {
    console.error("Error allocating unit parking:", error);
    throw { message: error.response?.data?.meta?.message || "Failed to allocate parking" };
  }
};

// Allocate general parking
export const allocateGeneralParking = async (parkingData) => {
  try {
    const response = await axiosInstance.post(
      "/parking/general-parking",
      parkingData
    );
    return { data: response.data.data, message: response.data.meta.message };
  } catch (error) {
    console.error("Error allocating general parking:", error);
    throw { message: error.response?.data?.meta?.message || "Failed to allocate parking" };
  }
};

// Get all parkings
export const getAllParkings = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/parking", { params });
    return response.data.data; // Returns { parkings, count }
  } catch (error) {
    console.error("Error fetching parkings:", error);
    throw error;
  }
};

// Get parking by ID
export const getParkingById = async (parkingId) => {
  try {
    const response = await axiosInstance.get(`/parking/${parkingId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching parking:", error);
    throw error;
  }
};

// Update parking
export const updateParking = async (parkingId, parkingData) => {
  try {
    const response = await axiosInstance.put(
      `/parking/${parkingId}`,
      parkingData
    );
    return { data: response.data.data, message: response.data.meta.message };
  } catch (error) {
    console.error("Error updating parking:", error);
    throw { message: error.response?.data?.meta?.message || "Failed to update parking" };
  }
};

// Delete parking
export const deleteParking = async (parkingId) => {
  try {
    const response = await axiosInstance.delete(`/parking/${parkingId}`);
    return { message: response.data.meta.message };
  } catch (error) {
    console.error("Error deleting parking:", error);
    throw { message: error.response?.data?.meta?.message || "Failed to delete parking" };
  }
};

// Get my parking (for logged-in user)
export const getMyParking = async () => {
  try {
    const response = await axiosInstance.get("/parking/user/my-parking");
    return response.data.data; // Returns { parkings, count }
  } catch (error) {
    console.error("Error fetching my parking:", error);
    throw error;
  }
};
