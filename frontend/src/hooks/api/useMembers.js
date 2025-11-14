import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addExistingMember,
  getSocietyMembers,
  inviteNewMember,
  removeMember,
  searchUserByEmail, // ✅ UPDATED
} from "../../api/services/member.api";
import toast from "react-hot-toast";

// Main hook for member management
export const useMembers = (societyId) => {
  const queryClient = useQueryClient();

  // Get all members
  const {
    data: membersData,
    isLoading: isMembersLoading,
    error: membersError,
    refetch: refetchMembers,
  } = useQuery({
    queryKey: ["societyMembers", societyId],
    queryFn: () => getSocietyMembers(societyId),
    enabled: !!societyId,
  });

  // Add existing member
  const addMemberMutation = useMutation({
    mutationFn: (userData) => addExistingMember(societyId, userData),
    onSuccess: (data) => {
      toast.success(data.message || "Member added successfully");
      queryClient.invalidateQueries(["societyMembers", societyId]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add member");
    },
  });

  // Invite new member
  const inviteMemberMutation = useMutation({
    mutationFn: (userData) => inviteNewMember(societyId, userData),
    onSuccess: (data) => {
      toast.success(data.message || "Invitation sent successfully");
      queryClient.invalidateQueries(["societyMembers", societyId]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to send invitation");
    },
  });

  // Remove member
  const removeMemberMutation = useMutation({
    mutationFn: (memberId) => removeMember(societyId, memberId),
    onSuccess: (data) => {
      toast.success(data.message || "Member removed successfully");
      queryClient.invalidateQueries(["societyMembers", societyId]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to remove member");
    },
  });

  return {
    members: membersData?.members || [],
    membersCount: membersData?.count || 0,
    isMembersLoading,
    membersError,
    refetchMembers,
    addMember: addMemberMutation.mutate,
    isAddingMember: addMemberMutation.isPending,
    inviteMember: inviteMemberMutation.mutate,
    isInvitingMember: inviteMemberMutation.isPending,
    removeMember: removeMemberMutation.mutate,
    isRemovingMember: removeMemberMutation.isPending,
  };
};

// ✅ UPDATED: Hook for searching user by exact email
export const useSearchUserByEmail = () => {
  return useMutation({
    mutationFn: (email) => searchUserByEmail(email),
  });
};
