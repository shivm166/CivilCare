// frontend/src/routes/PublicRoutes.jsx

import { Route, Navigate } from "react-router-dom";
import LandingPage from "../pages/public/Landing/LandingPage";
import Login from "../pages/auth/Login/Login";
import Signup from "../pages/auth/SIgnup/Signup";
import PublicLayout from "../components/layout/PublicLayout/PublicLayout";
import PageLoader from "../pages/error/PageLoader"; // New Import

// [FIXED LINE]: Accept isLoading as a prop
const PublicRoutes = ({ isAuthenticated, authUser, isLoading }) => {
  // Determine redirect based on user role
  const getRedirectPath = () => {
    if (!authUser) return "/login";
    return authUser.globalRole === "super_admin"
      ? "/super-admin/dashboard"
      : "/user/dashboard";
  };

  const redirectPath = getRedirectPath();

  return (
    <Route path="/" element={<PublicLayout />}>
      {/* Landing Page renders immediately (unblocked) */}
      <Route index element={<LandingPage />} />

      <Route
        path="/login"
        element={
          // [FIXED LOGIC]: Show loader while loading OR redirect if authenticated
          isLoading ? (
            <PageLoader />
          ) : !isAuthenticated ? (
            <Login />
          ) : (
            <Navigate to={redirectPath} replace />
          )
        }
      />
      <Route
        path="/signup"
        element={
          // [FIXED LOGIC]: Show loader while loading OR redirect if authenticated
          isLoading ? (
            <PageLoader />
          ) : !isAuthenticated ? (
            <Signup />
          ) : (
            <Navigate to={redirectPath} replace />
          )
        }
      />
    </Route>
  );
};

export default PublicRoutes;
