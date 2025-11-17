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

// hooks/useComplaints.js
export const useUpdateComplaintStatus = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, status }) => updateComplaintStatus(id, status),

    onSuccess: (data) => {
      // The updated complaint
      const updated = data.data;

      // 🔥 Update ALL versions of cached complaints
      queryClient.invalidateQueries({ queryKey: ["allComplaints"] });
      queryClient.invalidateQueries({ queryKey: ["myComplaints"] });
    },
  });

  return {
    updateStatus: mutation.mutate,
    isUpdating: mutation.isPending,
    updateError: mutation.error,
  };
};
