// frontend/src/routes/SuperAdminRoutes.jsx (MODIFIED FOR LAZY LOADING)

import { Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import PageLoader from "../pages/error/PageLoader";

// Lazy loading all Super Admin components
const SuperAdminLayout = lazy(() =>
  import("../components/layout/SuperAdminLayout/SuperAdminLayout")
);
const SuperAdminDashboard = lazy(() =>
  import(
    "../pages/dashboard/SuperAdmin/SuperAdminDashboard/SuperAdminDashboard"
  )
);
const SuperAdminSocieties = lazy(() =>
  import(
    "../pages/dashboard/SuperAdmin/SuperAdminSocieties/SuperAdminSocieties"
  )
);
const SuperAdminUsers = lazy(() =>
  import("../pages/dashboard/SuperAdmin/SuperAdminUsers/SuperAdminUsers")
);

// Define a consistent fallback component for cleaner code
const SuspenseFallback = (
  <div className="p-6 h-full flex justify-center items-center">
    <PageLoader />
  </div>
);

function SuperAdminRoutes() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route index element={<Navigate to="/super-admin/dashboard" replace />} />

      {/* Super Admin Layout is lazy-loaded */}
      <Route
        element={
          <Suspense fallback={SuspenseFallback}>
            <SuperAdminLayout />
          </Suspense>
        }
      >
        <Route
          path="dashboard"
          element={
            <Suspense fallback={SuspenseFallback}>
              <SuperAdminDashboard />
            </Suspense>
          }
        />
        <Route
          path="societies"
          element={
            <Suspense fallback={SuspenseFallback}>
              <SuperAdminSocieties />
            </Suspense>
          }
        />
        <Route
          path="users"
          element={
            <Suspense fallback={SuspenseFallback}>
              <SuperAdminUsers />
            </Suspense>
          }
        />

        {/* Catch-all redirect for super admin */}
        <Route
          path="*"
          element={<Navigate to="/super-admin/dashboard" replace />}
        />
      </Route>
    </Routes>
  );
}

export default SuperAdminRoutes;
