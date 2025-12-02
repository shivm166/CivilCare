import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createComplaint,
  getAllComplaints,
  getMyComplaint,
  updateComplaintStatus,
} from "../../api/services/complaint.api";

export const useCreateComplaint = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createComplaint,
    onSuccess: () => {
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
//get user complaint
export const useGetMyComplaints = (societyId) => {
  return useQuery({
    queryKey: ["myComplaints", societyId],
    queryFn: getMyComplaint,
    select: (data) => data.data,
  });
};

// hooks/useComplaints.js
export const useGetAllComplaints = (societyId) => {
  return useQuery({
    queryKey: ["allComplaints", societyId],
    queryFn: getAllComplaints,
    select: (data) => data.data,
    enabled: !!societyId,
    staleTime: 1000 * 30,
  });
};

export const useUpdateComplaintStatus = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, status }) => updateComplaintStatus(id, status),

    onSuccess: (data) => {
      const updated = data.data;

      const updateList = (oldData) => {
        const listToUpdate = Array.isArray(oldData) ? oldData : oldData?.data;

        if (Array.isArray(listToUpdate)) {
          const newList = listToUpdate.map((complaint) =>
            complaint._id === updated._id ? updated : complaint
          );

          return Array.isArray(oldData)
            ? newList
            : { ...oldData, data: newList };
        }
        return oldData;
      };

      queryClient.setQueriesData({ queryKey: ["allComplaints"] }, updateList);

      queryClient.setQueriesData({ queryKey: ["myComplaints"] }, updateList);
    },
  });

  return {
    updateStatus: mutation.mutate,
    isUpdating: mutation.isPending,
    updateError: mutation.error,
  };
};
