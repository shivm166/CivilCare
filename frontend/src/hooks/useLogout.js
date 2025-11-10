import React from "react";
import { logout } from "../lib/api.js";

const useLogout = () => {
  const logoutUser = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  };

  return { logoutUser };
};

export default useLogout;
