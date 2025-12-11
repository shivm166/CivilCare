import { Route, Navigate } from "react-router-dom";
import LandingPage from "../pages/public/Landing/LandingPage";
import Login from "../pages/auth/Login/Login";
import Signup from "../pages/auth/SIgnup/Signup";
import PublicLayout from "../components/layout/PublicLayout/PublicLayout";
import PageLoader from "../pages/error/PageLoader";
import ForgotPassword from "../pages/auth/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword/ResetPassword";

const PublicRoutes = ({ isAuthenticated, authUser, isLoading }) => {
  const getRedirectPath = () => {
    if (!authUser) return "/login";
    return authUser.globalRole === "super_admin"
      ? "/super-admin/dashboard"
      : "/user/dashboard";
  };

  const redirectPath = getRedirectPath();

  // if (isLoading) {
  //   return <PageLoader />;
  // }

  return (
    <Route path="/" element={<PublicLayout />}>
      <Route index element={<LandingPage />} />

      <Route
        path="/login"
        element={
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
          isLoading ? (
            <PageLoader />
          ) : !isAuthenticated ? (
            <Signup />
          ) : (
            <Navigate to={redirectPath} replace />
          )
        }
      />
      <Route
        path="/forgot-password"
        element={
          !isAuthenticated ? (
            <ForgotPassword />
          ) : (
            <Navigate to={redirectPath} replace />
          )
        }
      />
      <Route
        path="/reset-password"
        element={
          !isAuthenticated ? (
            <ResetPassword />
          ) : (
            <Navigate to={redirectPath} replace />
          )
        }
      />
    </Route>
  );
};

export default PublicRoutes;
