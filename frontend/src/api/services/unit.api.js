import { axiosInstance } from "../axios";

// ==================== UNIT APIs ====================

// Create unit in building
export const createUnit = async (buildingId, unitData) => {
  try {
    const response = await axiosInstance.post(
      `/admin/v1/building/${buildingId}/unit`,
      unitData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating unit:", error);
    throw error;
  }
};

// Get all units in building
export const getUnitsInBuilding = async (buildingId) => {
  try {
    const response = await axiosInstance.get(
      `/admin/v1/building/${buildingId}/unit`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching units:", error);
    throw error;
  }
};

// Update unit
export const updateUnit = async (unitId, unitData) => {
  try {
    const response = await axiosInstance.patch(
      `/admin/v1/unit/${unitId}`,
      unitData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating unit:", error);
    throw error;
  }
};

// Delete unit
export const deleteUnit = async (unitId) => {
  try {
    const response = await axiosInstance.delete(
      `/admin/v1/unit/${unitId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting unit:", error);
    throw error;
  }
};

// Assign resident to unit
export const assignResidentToUnit = async (unitId, assignmentData) => {
  try {
    const response = await axiosInstance.post(
      `/admin/v1/unit/${unitId}/assign-resident`,
      assignmentData
    );
    return response.data;
  } catch (error) {
    console.error("Error assigning resident:", error);
    throw error;
  }
};

// Get unit by ID
export const getUnitById = async (unitId) => {
  try {
    const response = await axiosInstance.get(`/admin/v1/unit/${unitId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching unit:", error);
    throw error;
  }
};
