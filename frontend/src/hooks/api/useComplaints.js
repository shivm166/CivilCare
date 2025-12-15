// src/hooks/api/useComplaints.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  createComplaint,
  getMyComplaints as apiGetMyComplaints,
  getAllComplaints as apiGetAllComplaints,
  updateComplaintStatus as apiUpdateComplaintStatus,
} from "../../api/services/complaint.api";

// Get my complaints
export const useGetMyComplaints = (societyId) => {
  return useQuery({
    queryKey: ["myComplaints", societyId],
    queryFn: () => apiGetMyComplaints(societyId),
    select: (res) => res.data ?? res,
    staleTime: 1000 * 60, // 1 min
  });
};

// Get all complaints (admin)
export const useGetAllComplaints = (societyId) => {
  return useQuery({
    queryKey: ["allComplaints", societyId],
    queryFn: () => apiGetAllComplaints(societyId),
    select: (res) => res.data ?? res,
    enabled: typeof societyId !== "undefined" && societyId !== null,
    staleTime: 1000 * 60,
  });
};

// Create complaint //user
export const useCreateComplaint = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createComplaint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myComplaints"] });
      queryClient.invalidateQueries({ queryKey: ["allComplaints"] });
      toast.success("Complaint created");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to create complaint");
    },
  });
};

// Update complaint status
export const useUpdateComplaintStatus = (options = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, status }) => apiUpdateComplaintStatus(id, status),

    onMutate: async ({ id, status }) => {
      if (options.onMutate) options.onMutate({ id, status });

      await queryClient.cancelQueries({ queryKey: ["allComplaints"] });
      await queryClient.cancelQueries({ queryKey: ["myComplaints"] });

      const previousAll = queryClient.getQueryData(["allComplaints"]);
      const previousMine = queryClient.getQueryData(["myComplaints"]);

      const updater = (old) => {
        if (!old) return old;
        let list = Array.isArray(old)
          ? old
          : old.data
          ? old.data
          : old.data?.data
          ? old.data.data
          : null;

        if (!list && old?.data && Array.isArray(old.data)) list = old.data;
        if (!list) return old;

        const newList = list.map((c) => (c._id === id ? { ...c, status } : c));

        if (Array.isArray(old)) return newList;
        if (old.data) return { ...old, data: newList };
        return newList;
      };

      try {
        queryClient.setQueryData(["allComplaints"], (old) => updater(old));
        queryClient.setQueryData(["myComplaints"], (old) => updater(old));
      } catch (e) {
        console.log(e);
      }

      return { previousAll, previousMine };
    },

    onError: (err, variables, context) => {
      if (context?.previousAll)
        queryClient.setQueryData(["allComplaints"], context.previousAll);
      if (context?.previousMine)
        queryClient.setQueryData(["myComplaints"], context.previousMine);

      toast.error(err?.response?.data?.message || "Failed to update status");
      if (options.onError) options.onError(err);
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["allComplaints"] });
      queryClient.invalidateQueries({ queryKey: ["myComplaints"] });
      toast.success("Status updated successfully");
      if (options.onSuccess) options.onSuccess(data);
    },

    onSettled: () => {
      if (options.onSettled) options.onSettled();
    },
  });

  return {
    updateStatus: mutation.mutateAsync,
    isUpdating: mutation.isLoading,
    updateError: mutation.error,
  };
};
