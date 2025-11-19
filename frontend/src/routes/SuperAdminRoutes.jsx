import { Navigate, Route, Routes } from "react-router-dom";
import SuperAdminLayout from "../components/layout/SuperAdminLayout/SuperAdminLayout";
import SuperAdminDashboard from "../pages/dashboard/SuperAdmin/SuperAdminDashboard/SuperAdminDashboard";
import SuperAdminSocieties from "../pages/dashboard/SuperAdmin/SuperAdminSocieties/SuperAdminSocieties";
import SuperAdminUsers from "../pages/dashboard/SuperAdmin/SuperAdminUsers/SuperAdminUsers";

function SuperAdminRoutes() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route index element={<Navigate to="/super-admin/dashboard" replace />} />
      
      {/* Super Admin Layout with nested routes */}
      <Route element={<SuperAdminLayout />}>
        <Route path="dashboard" element={<SuperAdminDashboard />} />
        <Route path="societies" element={<SuperAdminSocieties />} />
        <Route path="users" element={<SuperAdminUsers />} />
        
        {/* Catch-all redirect for super admin */}
        <Route path="*" element={<Navigate to="/super-admin/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default SuperAdminRoutes;