import { axiosInstance } from "../axios";

// ==================== ADMIN API ====================

export const createAnnouncement = async (formData) => {
  try {
    const res = await axiosInstance.post("/announcement/admin/create", formData);
    return res.data;
  } catch (error) {
    console.error("Error creating announcement:", error);
    throw error.response?.data || error;
  }
};

export const getAllAnnouncementsAdmin = async () => {
  try {
    const res = await axiosInstance.get("/announcement/admin/all");
    return res.data;
  } catch (error) {
    console.error("Error fetching admin announcements:", error);
    throw error.response?.data || error;
  }
};

export const updateAnnouncement = async (id, formData) => {
  try {
    const res = await axiosInstance.patch(
      `/announcement/admin/update/${id}`,
      formData
    );
    return res.data;
  } catch (error) {
    console.error("Error updating announcement:", error);
    throw error.response?.data || error;
  }
};

export const deleteAnnouncement = async (id) => {
  try {
    const res = await axiosInstance.delete(`/announcement/admin/delete/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting announcement:", error);
    throw error.response?.data || error;
  }
};

export const replyToComment = async (announcementId, commentId, reply) => {
  try {
    const res = await axiosInstance.post(
      `/announcement/admin/reply/${announcementId}/${commentId}`,
      { reply }
    );
    return res.data;
  } catch (error) {
    console.error("Error replying to comment:", error);
    throw error.response?.data || error;
  }
};

// ==================== USER API ====================

export const getUserAnnouncements = async () => {
  try {
    const res = await axiosInstance.get("/announcement/user/all");
    return res.data;
  } catch (error) {
    console.error("Error fetching user announcements:", error);
    throw error.response?.data || error;
  }
};

export const addComment = async (id, comment) => {
  try {
    const res = await axiosInstance.post(`/announcement/user/comment/${id}`, {
      comment,
    });
    return res.data;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error.response?.data || error;
  }
};
