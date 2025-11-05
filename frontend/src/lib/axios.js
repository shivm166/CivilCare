import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:4001/api",
  withCredentials: true, // ✅ important to allow cookies
  headers: {
    "Content-Type": "application/json",
  },
});
