import { Route, Navigate } from "react-router-dom";
import LandingPage from "../pages/public/Landing/LandingPage";
import Login from "../pages/auth/Login/Login";
import Signup from "../pages/auth/SIgnup/Signup";
import PublicLayout from "../components/layout/PublicLayout/PublicLayout";
const PublicRoutes = ({ isAuthenticated }) => {
  return (
    <Route path="/" element={<PublicLayout />}>
      <Route index element={<LandingPage />} />

      <Route
        path="/login"
        element={!isAuthenticated ? <Login /> : <Navigate to="/home" replace />}
      />
      <Route
        path="/signup"
        element={
          !isAuthenticated ? <Signup /> : <Navigate to="/home" replace />
        }
      />
    </Route>
  );
};

export default PublicRoutes;
