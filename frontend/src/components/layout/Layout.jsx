// frontend/src/components/layout/Layout.jsx (DEPRECATED/REPLACED by DashboardLayout.jsx)
// We keep it as a simple redirector to maintain the outer Route structure in ProtectedRoutes.jsx

import { Outlet } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";

const Layout = () => {
  return <DashboardLayout />;
};

export default Layout;
