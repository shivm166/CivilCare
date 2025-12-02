import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import {
  assignResidentToUnit,
  createUnit,
  deleteUnit,
  updateUnit,
  getUnitById,
} from "../../api/services/unit.api";
import toast from "react-hot-toast";
import { axiosInstance } from "../../api/axios";
// ==================== UNIT HOOKS ====================

// Create unit
export const useCreateUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ buildingId, data }) => createUnit(buildingId, data),
    onSuccess: (data) => {
      toast.success(data.message || "Unit created successfully");
      queryClient.invalidateQueries(["building"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create unit");
    },
  });
};

// Update unit
export const useUpdateUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ unitId, data }) => updateUnit(unitId, data),
    onSuccess: (data) => {
      toast.success(data.message || "Unit updated successfully");
      queryClient.invalidateQueries(["buildings"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update unit");
    },
  });
};

// Delete unit
export const useDeleteUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUnit,
    onSuccess: (data) => {
      toast.success(data.message || "Unit deleted successfully");
      queryClient.invalidateQueries(["building"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete unit");
    },
  });
};

// Assign resident to unit
export const useAssignResident = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ unitId, data }) => assignResidentToUnit(unitId, data),
    onSuccess: (data) => {
      toast.success(data.message || "Resident assigned successfully");
      queryClient.invalidateQueries(["building"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to assign resident");
    },
  });
};

// Get unit by ID
export const useUnitById = (unitId) => {
  return useQuery({
    queryKey: ["unit", unitId],
    queryFn: () => getUnitById(unitId),
    enabled: !!unitId,
  });
};

export const getUnitsBySociety = async () => {
  try {
    const response = await axiosInstance.get(`/admin/v1/unit`);
    // Assuming the response structure returns the array of units in response.data.data
    return response.data.data;
  } catch (error) {
    console.error("Error fetching units by society:", error);
    throw error;
  }
};

export const useUnitsBySociety = () => {
  return useQuery({
    queryKey: ["unitsBySociety"],
    queryFn: getUnitsBySociety,
    select: (data) => data.units || data,
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to fetch units");
    },
  });
};
