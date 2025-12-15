// src/api/services/complaint.api.js
import { axiosInstance } from "../axios"; 
export const createComplaint = async (formdata) => {
  const res = await axiosInstance.post("/complaint/createComplaint", formdata);
  return res.data;
};

export const getMyComplaints = async (societyId) => {
  const url = societyId ? `/complaint/getMyComplaints?societyId=${societyId}` : "/complaint/getMyComplaints";
  const res = await axiosInstance.get(url);
  return res.data;
};

export const getAllComplaints = async (societyId) => {
  const url = societyId ? `/complaint/getAllComplaints?societyId=${societyId}` : "/complaint/getAllComplaints";
  const res = await axiosInstance.get(url);
  return res.data;
};

export const updateComplaintStatus = async (id, status) => {
  const res = await axiosInstance.patch(`/complaint/updateComplaint/${id}/status`, { status });
  return res.data;
};
