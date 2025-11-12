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
import BuildingManagement from "../pages/admin/BuildingManagement.jsx";

const SocietyChecker = ({ children }) => {
  const { societies, isSocietiesLoading } = useSocietyContext();
  if (isSocietiesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{<PageLoader />}</p>
        </div>
      </div>
    );
  }

  if (societies.length === 0) {
    return <Navigate to="/onboarding" replace />;
  }
  return children;
};

const ProtectedRoutes = ({ authUser }) => {
  const isAuthenticated = Boolean(authUser);
  const isSuperAdmin = authUser?.globalRole === "super_admin";

  return (
    <>
      {!isAuthenticated ? (
        <Route path="*" element={<Navigate to="/login" replace />} />
      ) : !isSuperAdmin ? (
        <Route
          element={
            <SocietyProvider>
              <Layout />
            </SocietyProvider>
          }
        >
          <Route index element={<Navigate to="/user/dashboard" replace />} />
          <Route
            path="/home"
            element={<Navigate to="/user/dashboard" replace />}
          />

          <Route path="/onboarding" element={<SocietyOnboarding />} />

          <Route
            path="/admin"
            element={
              <SocietyChecker>
                <Outlet />
              </SocietyChecker>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="announcements" element={<AnnouncementsPage />} />
            <Route path="complaints" element={<ComplaintsPage />} />
            <Route path="residents" element={<ResidentsPage />} />
            <Route path="buildings" element={<BuildingManagement />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route
              path="*"
              element={<Navigate to="/admin/dashboard" replace />}
            />
          </Route>

          <Route
            path="/user"
            element={
              <SocietyChecker>
                <Outlet />
              </SocietyChecker>
            }
          >
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="raise-complaint" element={<RaiseComplaintPage />} />
            <Route path="announcements" element={<AnnouncementsPage />} />
            <Route path="residents" element={<ResidentsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route
              path="*"
              element={<Navigate to="/user/dashboard" replace />}
            />
          </Route>

          <Route path="*" element={<Navigate to="/user/dashboard" replace />} />
        </Route>
      ) : (
        SuperAdminRoutes()
      )}
    </>
  );
};

export default ProtectedRoutes;
