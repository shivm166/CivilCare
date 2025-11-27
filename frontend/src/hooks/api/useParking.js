import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  allocateUnitParking,
  allocateGeneralParking,
  getAllParkings,
  getParkingById,
  updateParking,
  deleteParking,
  getMyParking,
} from "../../api/services/parking.api";

// Get all parkings
export const useParkings = (params = {}) => {
  return useQuery({
    queryKey: ["parkings", params],
    queryFn: () => getAllParkings(params),
    // ✅ REMOVED select - parking.api.js already returns data.data
  });
};

// Get parking by ID
export const useParking = (parkingId) => {
  return useQuery({
    queryKey: ["parking", parkingId],
    queryFn: () => getParkingById(parkingId),
    enabled: !!parkingId,
    // ✅ REMOVED select
  });
};

// Get my parking
export const useMyParking = () => {
  return useQuery({
    queryKey: ["my-parking"],
    queryFn: getMyParking,
    // ✅ REMOVED select
  });
};

// Allocate unit-based parking
export const useAllocateUnitParking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: allocateUnitParking,
    onSuccess: (data) => {
      // ✅ FIXED: Backend returns data.message, not data.meta.message
      toast.success(data.message || "Unit parking allocated successfully");
      queryClient.invalidateQueries({ queryKey: ["parkings"] });
    },
    onError: (error) => {
      // ✅ FIXED: Error structure
      toast.error(error.message || "Failed to allocate parking");
    },
  });
};

// Allocate general parking
export const useAllocateGeneralParking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: allocateGeneralParking,
    onSuccess: (data) => {
      // ✅ FIXED
      toast.success(data.message || "General parking allocated successfully");
      queryClient.invalidateQueries({ queryKey: ["parkings"] });
    },
    onError: (error) => {
      // ✅ FIXED
      toast.error(error.message || "Failed to allocate parking");
    },
  });
};

// Update parking
export const useUpdateParking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ parkingId, parkingData }) =>
      updateParking(parkingId, parkingData),
    onSuccess: (data) => {
      toast.success(data.message || "Parking updated successfully");
      queryClient.invalidateQueries({ queryKey: ["parkings"] });
      queryClient.invalidateQueries({ queryKey: ["parking"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update parking");
    },
  });
};

// Delete parking
export const useDeleteParking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteParking,
    onSuccess: (data) => {
      toast.success(data.message || "Parking deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["parkings"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete parking");
    },
  });
};
