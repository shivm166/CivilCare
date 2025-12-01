// frontend/src/routes/ProtectedRoutes.jsx
import React, { lazy, Suspense } from "react";
import { Route, Navigate, Outlet } from "react-router-dom";
import { SocietyProvider, useSocietyContext } from "../contexts/SocietyContext";

import PageLoader from "../pages/error/PageLoader";

// Lazy Loaded Pages
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

// Parking Pages
const ParkingManagement = lazy(() =>
  import("../pages/dashboard/Admin/ParkingManagement/ParkingManagement")
);
const UserParkingPage = lazy(() =>
  import("../pages/dashboard/User/Parking/UserParkingPage")
);

// Admin-only page
const MaintenanceRules = lazy(() => import("../pages/admin/MaintenanceRules"));

// ---------------- Dashboard Wrapper ----------------
const DashboardWrapper = () => {
  const { societies, activeRole, isSocietiesLoading } = useSocietyContext();

  if (isSocietiesLoading) return <PageLoader />;

  const hasSociety = societies && societies.length > 0;

  if (!hasSociety) {
    return (
      <Suspense fallback={<PageLoader />}>
        <SocietyOnboarding />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<PageLoader />}>
      {activeRole === "admin" ? <AdminDashboard /> : <ResidentDashboard />}
    </Suspense>
  );
};

// ---------------- Society Checker ----------------
const SocietyChecker = ({ children, authUser }) => {
  const { societies, isSocietiesLoading } = useSocietyContext();

  if (!authUser) return <Navigate to="/login" replace />;
  if (isSocietiesLoading) return <PageLoader />;

  const hasSociety = societies && societies.length > 0;

  // Allow limited access for users without society
  const current = window.location.pathname;
  const allowedWithoutSociety = ["/user/dashboard", "/user/profile"];

  if (
    !hasSociety &&
    !allowedWithoutSociety.some((p) => current.startsWith(p))
  ) {
    return <Navigate to="/user/dashboard" replace />;
  }

  return children;
};

// ---------------- Protected Routes ----------------
const ProtectedRoutes = ({ authUser, isLoading }) => {
  if (isLoading) return <PageLoader />;
  if (!authUser)
    return <Route path="*" element={<Navigate to="/login" replace />} />;

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
      {/* Default Landing Route */}
      <Route index element={<Navigate to="/user/dashboard" replace />} />

      {/* ---------------- ADMIN ROUTES ---------------- */}
      <Route
        path="admin"
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

        {/* Units */}
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

        {/* Admin only */}
        <Route
          path="maintenance-rules"
          element={
            <Suspense fallback={<PageLoader />}>
              <MaintenanceRules />
            </Suspense>
          }
        />
      </Route>

      {/* ---------------- USER ROUTES ---------------- */}
      <Route
        path="user"
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
