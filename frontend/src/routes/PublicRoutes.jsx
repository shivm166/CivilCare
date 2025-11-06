import { Route, Navigate } from "react-router-dom";
import PublicLayout from "../components/layout/PublicLayout.jsx";
import LandingPage from "../pages/landing/LandingPage.jsx";
import Login from "../pages/login/Login.jsx";
import Signup from "../pages/signup/Signup.jsx";

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
