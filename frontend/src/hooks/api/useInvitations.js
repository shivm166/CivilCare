import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMyInvitations,
  acceptInvitation,
  rejectInvitation,
  getSentInvitations,
} from "../../api/services/invitation.api";
import toast from "react-hot-toast";

// Hook for user to get their invitations
export const useMyInvitations = () => {
  return useQuery({
    queryKey: ["myInvitations"],
    queryFn: getMyInvitations,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

// Hook to accept invitation
export const useAcceptInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId) => acceptInvitation(invitationId),
    onSuccess: (data) => {
      toast.success(data.message || "Invitation accepted!");
      queryClient.invalidateQueries(["myInvitations"]);
      queryClient.invalidateQueries(["societies"]); // Refresh societies list
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to accept invitation");
    },
  });
};

// Hook to reject invitation
export const useRejectInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId) => rejectInvitation(invitationId),
    onSuccess: (data) => {
      toast.success(data.message || "Invitation rejected");
      queryClient.invalidateQueries(["myInvitations"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to reject invitation");
    },
  });
};

// Hook for admin to get sent invitations
export const useSentInvitations = (societyId) => {
  return useQuery({
    queryKey: ["sentInvitations", societyId],
    queryFn: () => getSentInvitations(societyId),
    enabled: !!societyId,
  });
};
