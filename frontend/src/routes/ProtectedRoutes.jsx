// frontend/src/routes/ProtectedRoutes.jsx (Optimized for Code Splitting)
import React, { lazy, Suspense } from "react";
import { Route, Navigate, Outlet } from "react-router-dom";
import { useSocietyContext, SocietyProvider } from "../contexts/SocietyContext";

import PageLoader from "../pages/error/PageLoader";

// 1. Lazy load all large feature components
const SocietyOnboarding = lazy(() =>
  import("../pages/onboarding/SocietyOnboarding")
);
const AdminDashboard = lazy(() =>
  import("../pages/dashboard/Admin/AdminDashboard/AdminDashboard")
);
const ResidentDashboard = lazy(() =>
  import("../pages/dashboard/User/UserDashboard/ResidentDashboard")
);
const Layout = lazy(() => import("../components/layout/Layout"));
const ComplaintsPage = lazy(() =>
  import("../pages/dashboard/Admin/ComplaintsManagement/ComplaintsPage")
);
const ResidentsPage = lazy(() =>
  import("../pages/dashboard/Admin/ResidentManagement/ResidentsPage")
);
const NotificationsPage = lazy(() =>
  import("../pages/dashboard/Admin/Notification/NotificationsPage")
);
const ProfilePage = lazy(() =>
  import("../pages/dashboard/User/Profile/ProfilePage")
);
const RaiseComplaintPage = lazy(() =>
  import("../pages/dashboard/User/Complaints/RaiseComplaintPage")
);
const AdminAnnouncementPage = lazy(() =>
  import("../pages/dashboard/Admin/AnnouncementsManagement/AnnouncementPage")
);
const UserAnnouncementPage = lazy(() =>
  import("../pages/dashboard/User/Announcements/AnnouncementPage")
);
const BuildingManagement = lazy(() =>
  import("../pages/dashboard/Admin/BuildingManagement/BuildingManagement")
);
const BuildingUnitsPage = lazy(() =>
  import("../pages/dashboard/Admin/BuildingManagement/BuildingUnitsPage")
);
const UnitDetailPage = lazy(() =>
  import("../pages/dashboard/Admin/UnitManagement/UnitDetailPage")
);
// ✨ ADD THESE PARKING IMPORTS
const ParkingManagement = lazy(() =>
  import("../pages/dashboard/Admin/ParkingManagement/ParkingManagement")
);
const UserParkingPage = lazy(() =>
  import("../pages/dashboard/User/Parking/UserParkingPage")
);

// 2. Dashboard wrapper handles conditional rendering & wraps component in Suspense
const DashboardWrapper = () => {
  const { societies, activeRole, isSocietiesLoading } = useSocietyContext();

  if (isSocietiesLoading) {
    return <PageLoader />;
  }

  const hasSociety = societies && societies.length > 0;

  if (!hasSociety) {
    return (
      <Suspense fallback={<PageLoader />}>
        <SocietyOnboarding />
      </Suspense>
    );
  }

  if (activeRole === "admin") {
    return (
      <Suspense fallback={<PageLoader />}>
        <AdminDashboard />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <ResidentDashboard />
    </Suspense>
  );
};

// 3. Society Checker Wrapper provides context and basic access control
const SocietyChecker = ({ children, authUser }) => {
  const { societies, isSocietiesLoading, activeRole } = useSocietyContext();

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  if (isSocietiesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600"></div>
      </div>
    );
  }

  const hasSociety = societies && societies.length > 0;
  const currentPath = window.location.pathname;

  if (!hasSociety) {
    const allowedPaths = [
      "/user/dashboard",
      "/user/notifications",
      "/user/profile",
    ];
    if (!allowedPaths.some((path) => currentPath.startsWith(path))) {
      return <Navigate to="/user/dashboard" replace />;
    }
  }

  return children;
};

const ProtectedRoutes = ({ authUser }) => {
  if (!authUser) {
    return <Route path="*" element={<Navigate to="/login" replace />} />;
  }

  return (
    // Top-level route for layout and context provider
    <Route
      path="/"
      element={
        <SocietyProvider>
          {/* Wrap Layout in Suspense as it's lazy-loaded */}
          <Suspense fallback={<PageLoader />}>
            <Layout />
          </Suspense>
        </SocietyProvider>
      }
    >
      <Route index element={<Navigate to="/user/dashboard" replace />} />

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
        {/* Wrap all feature routes in Suspense directly inside the element prop */}
        <Route
          path="announcements"
          element={
            <Suspense fallback={<PageLoader />}>
              <AdminAnnouncementPage />
            </Suspense>
          }
        />
        <Route
          path="buildings"
          element={
            <Suspense fallback={<PageLoader />}>
              <BuildingManagement />
            </Suspense>
          }
        />
        <Route
          path="complaints"
          element={
            <Suspense fallback={<PageLoader />}>
              <ComplaintsPage />
            </Suspense>
          }
        />
        <Route
          path="residents"
          element={
            <Suspense fallback={<PageLoader />}>
              <ResidentsPage />
            </Suspense>
          }
        />
        {/* ✨ ADD THIS PARKING ROUTE */}
        <Route
          path="parking"
          element={
            <Suspense fallback={<PageLoader />}>
              <ParkingManagement />
            </Suspense>
          }
        />
        <Route
          path="notifications"
          element={
            <Suspense fallback={<PageLoader />}>
              <NotificationsPage />
            </Suspense>
          }
        />
        <Route
          path="profile"
          element={
            <Suspense fallback={<PageLoader />}>
              <ProfilePage />
            </Suspense>
          }
        />
        <Route
          path="buildings/:buildingId/units"
          element={
            <Suspense fallback={<PageLoader />}>
              <BuildingUnitsPage />
            </Suspense>
          }
        />
        <Route
          path="buildings/:buildingId/units/:unitId"
          element={
            <Suspense fallback={<PageLoader />}>
              <UnitDetailPage />
            </Suspense>
          }
        />
      </Route>

      {/* User/Resident Routes */}
      <Route
        path="/user"
        element={
          <SocietyChecker authUser={authUser}>
            <Outlet />
          </SocietyChecker>
        }
      >
        <Route path="dashboard" element={<DashboardWrapper />} />
        <Route
          path="announcements"
          element={
            <Suspense fallback={<PageLoader />}>
              <UserAnnouncementPage />
            </Suspense>
          }
        />
        <Route
          path="raise-complaint"
          element={
            <Suspense fallback={<PageLoader />}>
              <RaiseComplaintPage />
            </Suspense>
          }
        />
        {/* ✨ ADD THIS PARKING ROUTE */}
        <Route
          path="parking"
          element={
            <Suspense fallback={<PageLoader />}>
              <UserParkingPage />
            </Suspense>
          }
        />
        <Route
          path="residents"
          element={
            <Suspense fallback={<PageLoader />}>
              <ResidentsPage />
            </Suspense>
          }
        />
        <Route
          path="notifications"
          element={
            <Suspense fallback={<PageLoader />}>
              <NotificationsPage />
            </Suspense>
          }
        />
        <Route
          path="profile"
          element={
            <Suspense fallback={<PageLoader />}>
              <ProfilePage />
            </Suspense>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/user/dashboard" replace />} />
    </Route>
  );
};

export default ProtectedRoutes;
