// frontend/src/routes/ProtectedRoutes.jsx
import HomePage from "../pages/home/HomePage.jsx";
import SocietyOnboarding from "../pages/onboarding/SocietyOnboarding.jsx";
import DashboardLayout from "../components/layout/DashboardLayout.jsx"; // Renamed/Updated layout
import { Route, Navigate } from "react-router-dom";
import {
  SocietyProvider,
  useSocietyContext,
} from "../context/SocietyContext.jsx";
import BillingPage from "../pages/features/BillingPage.jsx";
import MaintenancePage from "../pages/features/MaintenancePage.jsx";
import NoticeBoardPage from "../pages/features/NoticeBoardPage.jsx";
import VisitorPage from "../pages/features/VisitorPage.jsx";

// Wrapper component to check society status
const SocietyChecker = ({ children }) => {
  const { societies, isSocietiesLoading } = useSocietyContext();

  if (isSocietiesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
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
        <Route path="*" element={<Navigate to="/login" replace />} />
      ) : (
        <Route
          element={
            <SocietyProvider>
              <SocietyChecker>
                <DashboardLayout /> {/* Using the new DashboardLayout */}
              </SocietyChecker>
            </SocietyProvider>
          }
        >
          {/* Onboarding Route - No society check wrapper is needed here as it's outside the SocietyChecker in the outer Route element*/}
          <Route path="/onboarding" element={<SocietyOnboarding />} />

          {/* Default Route redirects to /app/dashboard based on role */}
          <Route path="/home" element={<HomePage />} />

          {/* Core Protected App Routes (Role-based components are handled inside DashboardLayout/Homepage redirects) */}
          <Route path="/app">
            {/* Dashboard: Renders the correct Admin/Resident dashboard based on Outlet context */}
            <Route path="dashboard" element={<HomePage />} />
            <Route index element={<Navigate to="dashboard" replace />} />

            {/* Other Feature Pages (Access controlled by Sidebar.jsx) */}
            <Route path="billing" element={<BillingPage />} />
            <Route path="maintenance" element={<MaintenancePage />} />
            <Route path="notice-board" element={<NoticeBoardPage />} />
            <Route path="visitor-management" element={<VisitorPage />} />

            {/* Placeholder Pages for Admin/Resident specific navigation */}
            <Route
              path="residents"
              element={<h1>Admin: Residents Management Page</h1>}
            />
            <Route
              path="settings"
              element={<h1>Admin: Global Settings Page</h1>}
            />
            <Route
              path="profile"
              element={<h1>Resident: User Profile Page</h1>}
            />

            {/* Catch-all for /app/* */}
            <Route
              path="*"
              element={<Navigate to="/app/dashboard" replace />}
            />
          </Route>
        </Route>
      )}
    </>
  );
};

export default ProtectedRoutes;
