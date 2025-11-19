import { Route, Navigate, Outlet } from "react-router-dom";
import { useSocietyContext } from "../contexts/SocietyContext";
import SocietyOnboarding from "../pages/onboarding/SocietyOnboarding";
import AdminDashboard from "../pages/dashboard/Admin/AdminDashboard/AdminDashboard";
import Layout from "../components/layout/Layout";
import ComplaintsPage from "../pages/dashboard/Admin/ComplaintsManagement/ComplaintsPage";
import { SocietyProvider } from "../contexts/SocietyContext";
import SuperAdminRoutes from "./SuperAdminRoutes";
import ResidentsPage from "../pages/dashboard/Admin/ResidentManagement/ResidentsPage";
import NotificationsPage from "../pages/dashboard/Admin/Notification/NotificationsPage";
import ProfilePage from "../pages/dashboard/User/Profile/ProfilePage";
import RaiseComplaintPage from "../pages/dashboard/User/Complaints/RaiseComplaintPage";
import ResidentDashboard from "../pages/dashboard/User/UserDashboard/ResidentDashboard";

// ✅ CORRECT IMPORTS - Two separate announcement pages
import AdminAnnouncementPage from "../pages/dashboard/Admin/AnnouncementsManagement/AnnouncementPage";
import UserAnnouncementPage from "../pages/dashboard/User/Announcements/AnnouncementPage";
import BuildingManagement from "../pages/dashboard/Admin/BuildingManagement/BuildingManagement";
import BuildingUnitsPage from "../pages/dashboard/Admin/BuildingManagement/BuildingUnitsPage";
import UnitDetailPage from "../pages/dashboard/Admin/UnitManagement/UnitDetailPage";

const SocietyChecker = ({ children, authUser }) => {
  const { societies, isSocietiesLoading } = useSocietyContext();

  // ✅ CRITICAL: If no authUser, redirect to login (this was missing!)
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  if (isSocietiesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const hasSociety = societies && societies.length > 0;

  // If no society, only allow dashboard (onboarding), notifications, and profile
  if (!hasSociety) {
    const allowedPaths = [
      "/user/dashboard",
      "/user/notifications",
      "/user/profile",
    ];
    const currentPath = window.location.pathname;

    if (!allowedPaths.includes(currentPath)) {
      return <Navigate to="/user/dashboard" replace />;
    }
  }

  return children;
};

// ✅ Dashboard wrapper to show onboarding when no society
const DashboardWrapper = () => {
  const { societies, activeRole } = useSocietyContext();
  const hasSociety = societies && societies.length > 0;

  // If no society, show onboarding page
  if (!hasSociety) {
    return <SocietyOnboarding />;
  }

  // If has society, show appropriate dashboard based on role
  if (activeRole === "admin") {
    return <AdminDashboard />;
  }

  return <ResidentDashboard />;
};

const ProtectedRoutes = ({ authUser }) => {
  // ✅ CRITICAL: Add auth check at the top level
  if (!authUser) {
    return <Route path="*" element={<Navigate to="/login" replace />} />;
  }

  return (
    <>
      <Route
        path="/"
        element={
          <SocietyProvider>
            <Layout />
          </SocietyProvider>
        }
      >
        {/* Super Admin Routes */}
        {authUser?.globalRole === "super_admin" && (
          <Route path="/super-admin/*" element={<SuperAdminRoutes />} />
        )}

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <SocietyChecker authUser={authUser}>
              <Outlet />
            </SocietyChecker>
          }
        >
          <Route path="dashboard" element={<DashboardWrapper />} />
          {/* ✅ FIXED: Use AdminAnnouncementPage for admin */}
          <Route path="announcements" element={<AdminAnnouncementPage />} />
          <Route path="buildings" element={<BuildingManagement />} />
          <Route path="complaints" element={<ComplaintsPage />} />
          <Route path="residents" element={<ResidentsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="buildings" element={<BuildingManagement />} />
          <Route
            path="buildings/:buildingId/units"
            element={<BuildingUnitsPage />}
          />
          <Route
            path="buildings/:buildingId/units/:unitId"
            element={<UnitDetailPage />}
          />
        </Route>

        {/* User Routes */}
        <Route
          path="/user"
          element={
            <SocietyChecker authUser={authUser}>
              <Outlet />
            </SocietyChecker>
          }
        >
          <Route path="dashboard" element={<DashboardWrapper />} />
          <Route path="announcements" element={<UserAnnouncementPage />} />
          <Route path="raise-complaint" element={<RaiseComplaintPage />} />
          <Route path="residents" element={<ResidentsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Fallback: redirect to appropriate dashboard */}
        <Route
          path="*"
          element={
            <Navigate
              to={
                authUser?.globalRole === "super_admin"
                  ? "/super-admin/dashboard"
                  : "/user/dashboard"
              }
              replace
            />
          }
        />
      </Route>
    </>
  );
};

export default ProtectedRoutes;
