// frontend/src/hooks/useComplaints.js

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyComplaints,
  postComplaint,
  adminListComplaints,
  adminUpdateComplaint,
} from "../lib/api";
import toast from "react-hot-toast";
import { useSocietyContext } from "../context/SocietyContext"; // Import needed for useUpdateComplaint's context

// 🔹 Fetch all complaints for a user (Renamed/Aliased from useComplaints)
export const useUserComplaints = (arg1, arg2) => {
  const societyId = typeof arg1 === "object" ? arg1.societyId : arg1;
  const params = typeof arg1 === "object" ? arg1.params || {} : arg2 || {};

  return useQuery({
    queryKey: ["complaints", { societyId, ...params }],
    queryFn: () => getMyComplaints(societyId, params), // getMyComplaints doesn't need args on FE, but keeping the signature
    enabled: true, // Always enabled if authenticated
  });
};

export const useCreateComplaint = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: postComplaint,
    onSuccess: (_res, vars) => {
      toast.success("Complaint raised successfully! 🎉");
      // refresh all complaint lists for this user
      qc.invalidateQueries({ queryKey: ["complaints"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to raise complaint");
    },
  });
};

// 🔹 Fetch all complaints for a society (FOR ADMIN LIST)
export const useAdminComplaints = (societyId, params = {}) => {
  return useQuery({
    queryKey: ["adminComplaints", societyId, params],
    queryFn: () => adminListComplaints({ societyId, params }),
    enabled: !!societyId,
    refetchInterval: 30000,
    placeholderData: { data: [], pagination: { total: 0 } },
  });
};

// 🔹 Update complaint status or priority (FOR ADMIN)
export const useUpdateComplaint = (societyId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ complaintId, payload }) =>
      adminUpdateComplaint({ complaintId, societyId, payload }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["adminComplaints", societyId] });
      // Also invalidate the specific user's complaints if needed
      qc.invalidateQueries({ queryKey: ["complaints"] });
      toast.success("Complaint updated successfully! ✅");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update complaint"
      );
    },
  });
};

// Export useComplaints as an alias to useUserComplaints for compatibility
export { useUserComplaints as useComplaints };
