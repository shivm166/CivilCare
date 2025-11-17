// Get all buildings in society
import { axiosInstance } from "../axios";
export const getAllBuildings = async () => {
  try {
    const response = await axiosInstance.get("/admin/v1/building");
    return response.data;
  } catch (error) {
    console.error("Error fetching buildings:", error);
    throw error;
  }
};

// Get building by ID with units
export const getBuildingById = async (buildingId) => {
  try {
    const response = await axiosInstance.get(
      `/admin/v1/building/${buildingId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching building:", error);
    throw error;
  }
};

// Create new building
export const createBuilding = async (buildingData) => {
  try {
    const response = await axiosInstance.post(
      "/admin/v1/building",
      buildingData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating building:", error);
    throw error;
  }
};

// Update building
export const updateBuilding = async (buildingId, buildingData) => {
  try {
    const response = await axiosInstance.patch(
      `/admin/v1/building/${buildingId}`,
      buildingData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating building:", error);
    throw error;
  }
};

// Delete building
export const deleteBuilding = async (buildingId) => {
  try {
    const response = await axiosInstance.delete(
      `/admin/v1/building/${buildingId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting building:", error);
    throw error;
  }
};

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
