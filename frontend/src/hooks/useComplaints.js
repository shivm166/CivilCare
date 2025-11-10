import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getComplaints, postComplaint } from "../lib/api";

// 🔹 Fetch all complaints for a society
export const useComplaints = (societyId) =>
  useQuery({
    queryKey: ["complaints", societyId],
    queryFn: () => getComplaints(societyId),
    enabled: !!societyId, // only run if societyId exists
  });

// 🔹 Create new complaint
export const useCreateComplaint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postComplaint,
    onSuccess: (_, vars) => {
      // Refresh complaints list after adding new one
      queryClient.invalidateQueries(["complaints", vars.society]);
    },
  });
};
