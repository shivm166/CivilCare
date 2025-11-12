import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyComplaints,
  getSocietyComplaints,
  postComplaint,
} from "../lib/api";
import { data } from "react-router-dom";

// hooks/useComplaints.js
export const useComplaints = (arg1, arg2) => {
  const societyId = typeof arg1 === "object" ? arg1.societyId : arg1;
  const params = typeof arg1 === "object" ? arg1.params || {} : arg2 || {};

  return useQuery({
    queryKey: ["complaints", { societyId, ...params }],
    queryFn: () => getMyComplaints(societyId, params),
    // remove `enabled` so it runs even if societyId is falsy
    // enabled: true (default)
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

export const useSocietyComplaints = (societyId) => {
  const {
    data: allSocietyComplaints,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["societyComplaints", societyId],
    queryFn: () => getSocietyComplaints(societyId),
    enabled: !!societyId,
  });

  return { data: allSocietyComplaints, isLoading, isError };
};
