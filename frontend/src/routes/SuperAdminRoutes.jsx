import { Navigate, Route } from "react-router-dom"
import SuperAdminLayout from "../components/layout/SuperAdminLayout/SuperAdminLayout"
import SuperAdminDashboard from "../pages/dashboard/SuperAdmin/SuperAdminDashboard/SuperAdminDashboard"
import SuperAdminSocieties from "../pages/dashboard/SuperAdmin/SuperAdminSocieties/SuperAdminSocieties"
import SuperAdminUsers from "../pages/dashboard/SuperAdmin/SuperAdminUsers/SuperAdminUsers"

function SuperAdminRoutes() {
  return (
    <Route>
        <Route path="/home" element={<Navigate to="/superadmin/dashboard" replace />} />
        <Route path="/superadmin" element={<SuperAdminLayout />}>
            <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
            <Route path="/superadmin/societies" element={<SuperAdminSocieties />} />
            <Route path="/superadmin/users" element={<SuperAdminUsers />} />
        </Route>
    </Route>
  )
}

export default SuperAdminRoutes