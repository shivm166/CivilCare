import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAnnouncement,
  getAllAnnouncementsAdmin,
  updateAnnouncement,
  deleteAnnouncement,
  replyToComment,
  getUserAnnouncements,
  addComment,
} from "../../api/services/announcement.api";

// ==================== ADMIN HOOKS ====================

export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAnnouncements"] });
      queryClient.invalidateQueries({ queryKey: ["userAnnouncements"] });
    },
  });

  return {
    createAnnouncement: mutation.mutate,
    isCreating: mutation.isPending,
    createError: mutation.error,
  };
};

export const useGetAdminAnnouncements = (societyId) => {
  return useQuery({
    queryKey: ["adminAnnouncements", societyId],
    queryFn: getAllAnnouncementsAdmin,
    select: (data) => data.data,
    enabled: !!societyId,
  });
};

export const useUpdateAnnouncement = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, formData }) => updateAnnouncement(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAnnouncements"] });
      queryClient.invalidateQueries({ queryKey: ["userAnnouncements"] });
    },
  });

  return {
    updateAnnouncement: mutation.mutate,
    isUpdating: mutation.isPending,
    updateError: mutation.error,
  };
};

export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAnnouncements"] });
      queryClient.invalidateQueries({ queryKey: ["userAnnouncements"] });
    },
  });

  return {
    deleteAnnouncement: mutation.mutate,
    isDeleting: mutation.isPending,
    deleteError: mutation.error,
  };
};

export const useReplyToComment = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ announcementId, commentId, reply }) =>
      replyToComment(announcementId, commentId, reply),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAnnouncements"] });
      queryClient.invalidateQueries({ queryKey: ["userAnnouncements"] });
    },
  });

  return {
    replyToComment: mutation.mutate,
    isReplying: mutation.isPending,
    replyError: mutation.error,
  };
};

// ==================== USER HOOKS ====================

export const useGetUserAnnouncements = (societyId) => {
  return useQuery({
    queryKey: ["userAnnouncements", societyId],
    queryFn: getUserAnnouncements,
    select: (data) => data.data,
    enabled: !!societyId,
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, comment }) => addComment(id, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userAnnouncements"] });
      queryClient.invalidateQueries({ queryKey: ["adminAnnouncements"] });
    },
  });

  return {
    addComment: mutation.mutate,
    isCommenting: mutation.isPending,
    commentError: mutation.error,
  };
};
