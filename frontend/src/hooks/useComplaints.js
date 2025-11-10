// hooks/useComplaints.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast"; // optional but recommended
import { getMyComplaints, postComplaint } from "../lib/api";

// Fetch MY complaints (user-specific)
export const useMyComplaints = () => {
  return useQuery({
    queryKey: ["my-complaints"],
    queryFn: getMyComplaints,
    staleTime: 1000 * 60, // 1 min
    select: (data) => data.data || [], // extract array
  });
};

// Create complaint + optimistic update + auto-refetch
export const useCreateComplaint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postComplaint,
    onMutate: async (newComplaint) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["my-complaints"] });

      // Snapshot previous
      const previous = queryClient.getQueryData(["my-complaints"]);

      // Optimistic update
      queryClient.setQueryData(["my-complaints"], (old) => {
        const newData = {
          ...old,
          data: [newComplaint, ...(old?.data || [])],
          count: (old?.count || 0) + 1,
        };
        return newData;
      });

      return { previous };
    },
    onError: (err, newComplaint, context) => {
      queryClient.setQueryData(["my-complaints"], context.previous);
      toast.error("Failed to submit complaint");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["my-complaints"] });
    },
    onSuccess: () => {
      toast.success("Complaint submitted successfully!");
    },
  });
};
