import { axiosInstance } from "../axios";

export const createComplaint = async (formdata) => {
  try {
    const res = await axiosInstance.post(
      "/complaint/createComplaint",
      formdata
    );
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching users", error);
    throw error;
  }
};

export const getMyComplaint = async () => {
  try {
    const res = await axiosInstance.get("complaint/getMyComplaints");
    return res.data;
  } catch (error) {
    console.error("Error fetching users", error);
    throw error;
  }
};

export const getAllComplaints = async () => {
  try {
    const res = await axiosInstance.get("/complaint/getAllComplaints");
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error(
      "Error fetching all complaints:",
      error.response?.data || error
    );
    throw error.response?.data || error;
  }
};

// 4. UPDATE COMPLAINT STATUS (Admin)
export const updateComplaintStatus = async (id, status) => {
  try {
    const res = await axiosInstance.patch(
      `/complaint/updateComplaint/${id}/status`,
      { status }
    );
    return res.data;
  } catch (error) {
    console.error("Error updating status:", error.response?.data || error);
    throw error.response?.data || error;
  }
};
