import { useQueryClient,useMutation } from "@tanstack/react-query";
import { assignResidentToUnit, createUnit, deleteUnit, updateUnit } from "../../api/services/unit.api";
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
