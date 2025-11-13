import { Route, Navigate, Outlet } from "react-router-dom";
import {
  SocietyProvider,
  useSocietyContext,
} from "../context/SocietyContext.jsx";
import Layout from "../components/layout/Layout.jsx";
import SocietyOnboarding from "../pages/onboarding/SocietyOnboarding.jsx";
import ProfilePage from "../pages/features/ProfilePage.jsx";
import AnnouncementsPage from "../pages/features/AnnouncementsPage.jsx";
import ComplaintsPage from "../pages/features/ComplaintsPage.jsx";
import ResidentsPage from "../pages/features/ResidentsPage.jsx";
import NotificationsPage from "../pages/features/NotificationsPage.jsx";
import RaiseComplaintPage from "../pages/features/RaiseComplaintPage.jsx";
import AdminDashboard from "../pages/features/AdminDashboard.jsx";
import UserDashboard from "../pages/features/UserDashboard.jsx";
import SuperAdminRoutes from "./SuperAdminRoutes.jsx";

// ✅ UPDATED: Component to check if user has society (with proper auth check)
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
    const allowedPaths = ["/user/dashboard", "/user/notifications", "/user/profile"];
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

  return <UserDashboard />;
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
          <Route path="announcements" element={<AnnouncementsPage />} />
          <Route path="complaints" element={<ComplaintsPage />} />
          <Route path="residents" element={<ResidentsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="profile" element={<ProfilePage />} />
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
          <Route path="announcements" element={<AnnouncementsPage />} />
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
