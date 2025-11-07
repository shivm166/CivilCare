import React from "react";
import { Navigate } from "react-router-dom";

// This page is mostly redundant now, as the core routing logic
// and redirects are handled in ProtectedRoutes.jsx and SocietyContext.jsx.
// It can simply redirect to the main user dashboard.
const HomePage = () => {
  return <Navigate to="/user/dashboard" replace />;
};

export default HomePage;
