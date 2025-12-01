// Get all buildings in society
import { axiosInstance } from "../axios";
export const getAllBuildings = async () => {
  try {
    const response = await axiosInstance.get("/admin/v1/building");
    return response.data.data;
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
    return response.data.data;
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
    return response.data.data;
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
    return response.data.data;
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
    return response.data.data;
  } catch (error) {
    console.error("Error deleting building:", error);
    throw error;
  }
};