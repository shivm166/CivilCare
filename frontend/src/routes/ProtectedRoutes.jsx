import { Route, Navigate, Outlet } from "react-router-dom";
import {
  SocietyProvider,
  useSocietyContext,
} from "../context/SocietyContext.jsx";
import Layout from "../components/layout/Layout.jsx";
import SocietyOnboarding from "../pages/onboarding/SocietyOnboarding.jsx";
import ProfilePage from "../pages/features/ProfilePage.jsx";

// --- Placeholder Components (New) ---
const AdminDashboard = () => (
  <div className="text-3xl font-bold">Admin Dashboard: Welcome Admin!</div>
);
const UserDashboard = () => (
  <div className="text-3xl font-bold">User Dashboard: Your Home Screen</div>
);
const RaiseComplaintPage = () => (
  <div className="text-xl font-semibold">Raise a Complaint (User)</div>
);

// Wrapper component to check society status
const SocietyChecker = ({ children }) => {
  const { societies, isSocietiesLoading } = useSocietyContext();

  // Loading state is handled inside the context now, but keeping a fallback
  if (isSocietiesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading society context...</p>
        </div>
      </div>
    );
  }

  // If user has no societies, redirect to onboarding
  if (societies.length === 0) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

const ProtectedRoutes = ({ isAuthenticated }) => {
  return (
    <>
      {!isAuthenticated ? (
        // Catch all other paths and redirect to login
        <Route path="*" element={<Navigate to="/login" replace />} />
      ) : (
        // All authenticated routes live here
        <Route
          element={
            <SocietyProvider>
              <Layout />
            </SocietyProvider>
          }
        >
          {/* Base URL Fallback for authenticated user */}
          <Route index element={<Navigate to="/user/dashboard" replace />} />
          <Route
            path="/home"
            element={<Navigate to="/user/dashboard" replace />}
          />

          {/* Onboarding Route - Accessible when no societies are active */}
          <Route path="/onboarding" element={<SocietyOnboarding />} />

          {/* --- Admin Routes --- */}
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
      )}
    </>
  );
};

export default ProtectedRoutes;
