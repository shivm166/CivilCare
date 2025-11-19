import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createComplaint,
  getAllComplaints,
  getMyComplaint,
  updateComplaintStatus,
} from "../../api/services/complaint.api";

// 1. CREATE COMPLAINT
export const useCreateComplaint = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createComplaint,
    onSuccess: () => {
      // ✅ FIX: Invalidate both myComplaints and allComplaints
      queryClient.invalidateQueries({ queryKey: ["myComplaints"] });
      queryClient.invalidateQueries({ queryKey: ["allComplaints"] });
    },
  });

  return {
    createComplaint: mutation.mutate,
    isCreating: mutation.isPending,
    createError: mutation.error,
  };
};

// 2. GET MY COMPLAINTS
// ✅ FIX: Accept societyId to control 'enabled' status
export const useGetMyComplaints = (societyId) => {
  return useQuery({
    // ✅ FIX: Add societyId to queryKey so it refetches if society changes
    queryKey: ["myComplaints", societyId],
    queryFn: getMyComplaint,
    select: (data) => data.data, // Extract `data.data` from response
  });
};

// hooks/useComplaints.js
// ✅ FIX: Accept societyId to control 'enabled' status
export const useGetAllComplaints = (societyId) => {
  return useQuery({
    // ✅ FIX: Add societyId to queryKey
    queryKey: ["allComplaints", societyId],
    queryFn: getAllComplaints,
    select: (data) => data.data,
    // ✅ FIX: Only enable this query if we HAVE a societyId
    enabled: !!societyId,
    staleTime: 1000 * 30,
  });
};

export const useUpdateComplaintStatus = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, status }) => updateComplaintStatus(id, status),

    onSuccess: (data) => {
      // The updated complaint object returned by the backend
      const updated = data.data;

      // Helper function to find and update the item in a list
      const updateList = (oldData) => {
        if (Array.isArray(oldData)) {
          return oldData.map((complaint) =>
            complaint._id === updated._id ? updated : complaint
          );
        }
        return oldData; // Return old data if it's not an array
      };

      // 🔥 FIX: Manual cache update using setQueriesData to prevent full reload.
      // This searches for the list and updates the specific complaint object in the array.

      // 1. Manually update allComplaints cache for all variants (with or without societyId)
      queryClient.setQueriesData(
        { queryKey: ["allComplaints"], exact: false },
        updateList
      );

      // 2. Manually update myComplaints cache for all variants (with or without societyId)
      queryClient.setQueriesData(
        { queryKey: ["myComplaints"], exact: false },
        updateList
      );
    },
  });

  return {
    updateStatus: mutation.mutate,
    isUpdating: mutation.isPending,
    updateError: mutation.error,
  };
};
