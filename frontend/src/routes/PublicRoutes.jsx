import { Route, Navigate } from "react-router-dom";
import LandingPage from "../pages/public/Landing/LandingPage";
import Login from "../pages/auth/Login/Login";
import Signup from "../pages/auth/SIgnup/Signup";
import PublicLayout from "../components/layout/PublicLayout/PublicLayout";

const PublicRoutes = ({ isAuthenticated, authUser }) => {
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
      <Route index element={<LandingPage />} />

      <Route
        path="/login"
        element={
          !isAuthenticated ? (
            <Login />
          ) : (
            <Navigate to={redirectPath} replace />
          )
        }
      />
      <Route
        path="/signup"
        element={
          !isAuthenticated ? (
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