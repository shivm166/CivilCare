import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import {
  createBuilding,
  deleteBuilding,
  getAllBuildings,
  getBuildingById,
  updateBuilding,
} from "../../api/services/building.api";

// ==================== BUILDING HOOKS ====================

// Get all buildings
export const useBuildings = () => {
  return useQuery({
    queryKey: ["buildings"],
    queryFn: getAllBuildings,
  });
};

// Get building by ID
export const useBuildingById = (buildingId) => {
  return useQuery({
    queryKey: ["building", buildingId],
    queryFn: () => getBuildingById(buildingId),
    enabled: !!buildingId,
  });
};

// Create building
export const useCreateBuilding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBuilding,
    onSuccess: (data) => {
      toast.success(data.message || "Building created successfully");
      queryClient.invalidateQueries(["buildings"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create building");
    },
  });
};

// Update building
export const useUpdateBuilding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ buildingId, data }) => updateBuilding(buildingId, data),
    onSuccess: (data) => {
      toast.success(data.message || "Building updated successfully");
      queryClient.invalidateQueries(["buildings"]);
      queryClient.invalidateQueries(["building"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update building");
    },
  });
};

// Delete building
export const useDeleteBuilding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBuilding,
    onSuccess: (data) => {
      toast.success(data.message || "Building deleted successfully");
      queryClient.invalidateQueries(["buildings"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete building");
    },
  });
};
