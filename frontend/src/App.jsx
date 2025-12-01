import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import useAuthUser from "./hooks/api/auth/useAuthUser";
import PublicRoutes from "./routes/PublicRoutes";
import ProtectedRoutes from "./routes/ProtectedRoutes";

const ActivateAccountPage = lazy(() =>
  import("./pages/auth/ActivateAccount/ActivateAccountPage")
);
const SuperAdminRoutes = lazy(() => import("./routes/SuperAdminRoutes"));
const PageLoader = lazy(() => import("./pages/error/PageLoader"));

const App = () => {
  const { isLoading, authUser } = useAuthUser();
  const isAuthenticated = Boolean(authUser);
  const isSuperAdmin = authUser?.globalRole === "super_admin";

  // if (isLoading) {
  //   return <PageLoader />;
  // }

  return (
    <>
      <div className="font-sans" data-theme="light">
        <Routes>
          {/* Lazy Loaded Component: Wrap in Suspense */}
          <Route
            path="/activate-account"
            element={
              <Suspense fallback={<PageLoader />}>
                <ActivateAccountPage />
              </Suspense>
            }
          />

          {PublicRoutes({ isAuthenticated, authUser, isLoading })}

          {isSuperAdmin ? (
            <>
              <Route
                path="/super-admin/*"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <SuperAdminRoutes />
                  </Suspense>
                }
              />
              <Route
                path="*"
                element={<Navigate to="/super-admin/dashboard" replace />}
              />
            </>
          ) : isAuthenticated ? (
            <>
              {/* Function Call: Returns <Route> element */}
              {ProtectedRoutes({ authUser, isLoading })}
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}
        </Routes>
        <Toaster />
      </div>
    </>
  );
};

export default App;
