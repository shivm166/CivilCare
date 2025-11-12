import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserComplaints, postComplaint } from "../lib/api";

// 🔹 Fetch all complaints for a society
export const useComplaints = (arg1, arg2) => {
  const societyId = typeof arg1 === "object" ? arg1.societyId : arg1;
  const params = typeof arg1 === "object" ? arg1.params || {} : arg2 || {};

  return useQuery({
    queryKey: ["complaints", { societyId, ...params }],
    queryFn: () => getUserComplaints(societyId, params),
    enabled: !!societyId,
  });
};

export const useCreateComplaint = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: postComplaint,
    onSuccess: (_res, vars) => {
      // refresh all complaint lists (any filters) for this user
      qc.invalidateQueries({ queryKey: ["complaints"] });
      // or more targeted if you prefer:
      // qc.invalidateQueries({ queryKey: ["complaints", { societyId: vars.society }] });
    },
  });
};
