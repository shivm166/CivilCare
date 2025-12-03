import React, { lazy, Suspense } from "react";
import { Route, Navigate, Outlet } from "react-router-dom";
import { useSocietyContext, SocietyProvider } from "../contexts/SocietyContext";
import PageLoader from "../pages/error/PageLoader";

// Lazy imports
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
const RaiseComplaintPage = lazy(() =>
  import("../pages/dashboard/User/Complaints/RaiseComplaintPage")
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
const ParkingManagement = lazy(() =>
  import("../pages/dashboard/Admin/ParkingManagement/ParkingManagement")
);
const UserParkingPage = lazy(() =>
  import("../pages/dashboard/User/Parking/UserParkingPage")
);
const MaintenanceRules = lazy(() =>
  import("../pages/dashboard/Admin/MaintenanceRulesPages/MaintenanceRules")
);

const AdminMaintenancePage = lazy(() =>
  import("../pages/dashboard/Admin/MaintenanceManagement/MaintenancePage")
);
const UserMaintenancePage = lazy(() =>
  import("../pages/dashboard/User/Maintenance/MaintenancePage")
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

const SocietyChecker = ({ children, authUser }) => {
  const { societies, isSocietiesLoading } = useSocietyContext();

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  if (isSocietiesLoading) {
    return <PageLoader />;
  }

  const hasSociety = societies && societies.length > 0;
  const currentPath = window.location.pathname;

  if (!hasSociety) {
    const allowedPaths = [
      "/user/dashboard",
      "/user/notifications",
      "/user/profile",
      "/user/raise-complaint",
      "/admin/dashboard",
      "/admin/notifications",
      "/admin/profile",
    ];
    if (!allowedPaths.some((path) => currentPath.startsWith(path))) {
      return <Navigate to="/user/dashboard" replace />;
    }
  }

  return children;
};

const ProtectedRoutes = ({ authUser, isLoading }) => {
  if (!authUser) {
    return <Route path="*" element={<Navigate to="/login" replace />} />;
  }
  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <Route
      path="/"
      element={
        <SocietyProvider>
          <Suspense fallback={<PageLoader />}>
            <Layout />
          </Suspense>
        </SocietyProvider>
      }
    >
      <Route index element={<Navigate to="/user/dashboard" replace />} />

      {/* ================= ADMIN ROUTES ================= */}
      <Route
        path="/admin"
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
          path="maintenance"
          element={
            <Suspense fallback={<PageLoader />}>
              <AdminMaintenancePage />
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

        {/* ✅ MAINTENANCE RULES - MOVE INSIDE ADMIN SECTION */}
        <Route
          path="maintenance-rules"
          element={
            <Suspense fallback={<PageLoader />}>
              <MaintenanceRules />
            </Suspense>
          }
        />

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
      </Route>

      {/* ================= USER ROUTES ================= */}
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

        <Route
          path="parking"
          element={
            <Suspense fallback={<PageLoader />}>
              <UserParkingPage />
            </Suspense>
          }
        />

        <Route
          path="maintenance"
          element={
            <Suspense fallback={<PageLoader />}>
              <UserMaintenancePage />
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

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/user/dashboard" replace />} />
    </Route>
  );
};

export default ProtectedRoutes;
