import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import useAuthUser from "./hooks/api/auth/useAuthUser";
import ActivateAccountPage from "./pages/auth/ActivateAccount/ActivateAccountPage";
import PublicRoutes from "./routes/PublicRoutes";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import SuperAdminRoutes from "./routes/SuperAdminRoutes";
import PageLoader from "./pages/error/PageLoader";

const App = () => {
  const { isLoading, authUser } = useAuthUser();
  const isAuthenticated = Boolean(authUser);
  const isSuperAdmin = authUser?.globalRole === "super_admin";

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <>
      <div className="font-sans" data-theme="light">
        <Routes>
          <Route path="/activate-account" element={<ActivateAccountPage />} />

          {/* Public Routes - Pass authUser as prop */}
          {PublicRoutes({ isAuthenticated, authUser })}

          {/* Super Admin Routes - Completely Separate */}
          {isSuperAdmin ? (
            <>
              <Route path="/super-admin/*" element={<SuperAdminRoutes />} />
              <Route path="*" element={<Navigate to="/super-admin/dashboard" replace />} />
            </>
          ) : isAuthenticated ? (
            <>
              {/* Regular User Routes */}
              {ProtectedRoutes({ authUser })}
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