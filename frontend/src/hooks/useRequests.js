import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllRequestsForSociety,
  acceptRequest,
  rejectRequest,
  getMyRequests,
} from "../lib/api";
import toast from "react-hot-toast";
import { useSocietyContext } from "../context/SocietyContext";

// Get all requests for society (Admin)
export const useGetSocietyRequests = (societyId) => {
  return useQuery({
    queryKey: ["societyRequests", societyId],
    queryFn: () => getAllRequestsForSociety(societyId),
    enabled: !!societyId,
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });
};

// Get user's own requests
export const useGetMyRequests = () => {
  return useQuery({
    queryKey: ["myRequests"],
    queryFn: getMyRequests,
  });
};

// Accept request hook
export const useAcceptRequest = () => {
  const queryClient = useQueryClient();
  const { activeSociety } = useSocietyContext();

  const { mutate: acceptRequestMutation, isPending: isAccepting } = useMutation({
    mutationFn: acceptRequest,
    onSuccess: () => {
      toast.success("Request accepted! User added to society. ✅");
      
      // Invalidate requests to refresh the list
      queryClient.invalidateQueries({
        queryKey: ["societyRequests", activeSociety?.societyId],
      });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Failed to accept request";
      toast.error(errorMessage);
    },
  });

  return { acceptRequestMutation, isAccepting };
};

// Reject request hook
export const useRejectRequest = () => {
  const queryClient = useQueryClient();
  const { activeSociety } = useSocietyContext();

  const { mutate: rejectRequestMutation, isPending: isRejecting } = useMutation({
    mutationFn: rejectRequest,
    onSuccess: () => {
      toast.success("Request rejected. ❌");
      
      // Invalidate requests to refresh the list
      queryClient.invalidateQueries({
        queryKey: ["societyRequests", activeSociety?.societyId],
      });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Failed to reject request";
      toast.error(errorMessage);
    },
  });

  return { rejectRequestMutation, isRejecting };
};
