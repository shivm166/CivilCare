import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getSocietyMembers,
  addExistingMember,
  inviteNewMember,
  removeMember,
  searchUserByEmail,
} from "../lib/api";
import toast from "react-hot-toast";

export const useMembers = (societyId) => {
  const queryClient = useQueryClient();

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

  const addMemberMutation = useMutation({
    mutationFn: (userData) => addExistingMember(societyId, userData),
    onSuccess: (data) => {
      toast.success(data.message || "Member added successfully");
      queryClient.invalidateQueries(["societyMembers", societyId]);
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed to add member"),
  });

  const inviteMemberMutation = useMutation({
    mutationFn: (userData) => inviteNewMember(societyId, userData),
    onSuccess: (data) => {
      toast.success(data.message || "Invitation sent successfully");
      queryClient.invalidateQueries(["societyMembers", societyId]);
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed to send invitation"),
  });

  const removeMemberMutation = useMutation({
    mutationFn: (memberId) => removeMember(societyId, memberId),
    onSuccess: (data) => {
      toast.success(data.message || "Member removed successfully");
      queryClient.invalidateQueries(["societyMembers", societyId]);
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || "Failed to remove member"),
  });

  return {
    members: membersData?.members || [],
    membersCount: membersData?.count || 0,
    isMembersLoading,
    membersError,
    refetchMembers,
    addMember: addMemberMutation.mutate,
    inviteMember: inviteMemberMutation.mutate,
    removeMember: removeMemberMutation.mutate,
    isRemovingMember: removeMemberMutation.isPending,
  };
};

export const useSearchUserByEmail = () => {
  return useMutation({
    mutationFn: (email) => searchUserByEmail(email),
  });
};
