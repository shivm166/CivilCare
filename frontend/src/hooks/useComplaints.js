// src/hooks/useComplaints.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createComplaint,
  getAllComplaints,
  getMyComplaint,
  updateComplaintStatus,
} from "../lib/api";

// 1. CREATE COMPLAINT
export const useCreateComplaint = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createComplaint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myComplaints"] });
    },
  });

  return {
    createComplaint: mutation.mutate,
    isCreating: mutation.isPending,
    createError: mutation.error,
  };
};

// 2. GET MY COMPLAINTS
export const useGetMyComplaints = () => {
  return useQuery({
    queryKey: ["myComplaints"],
    queryFn: getMyComplaint,
    select: (data) => data.data, // Extract `data.data` from response
    staleTime: 1000 * 60, // 1 minute
  });
};

// hooks/useComplaints.js
export const useGetAllComplaints = () => {
  return useQuery({
    queryKey: ["allComplaints"],
    queryFn: getAllComplaints,
    select: (data) => data.data,
    enabled: false, // ફક્ત admin page પર જ ચાલે
    staleTime: 1000 * 30,
  });
};

// hooks/useComplaints.js
export const useUpdateComplaintStatus = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, status }) => updateComplaintStatus(id, status),
    onSuccess: (data) => {
      // Update both lists
      queryClient.setQueryData(["allComplaints"], (old) =>
        old?.map((c) => (c._id === data.data._id ? data.data : c))
      );
      queryClient.setQueryData(["myComplaints"], (old) =>
        old?.map((c) => (c._id === data.data._id ? data.data : c))
      );
    },
  });

  return {
    updateStatus: mutation.mutate,
    isUpdating: mutation.isPending,
    updateError: mutation.error,
  };
};
