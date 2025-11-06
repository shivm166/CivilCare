import HomePage from "../pages/home/HomePage.jsx";
import Layout from "../components/layout/Layout.jsx";
import { Route, Navigate } from "react-router-dom";
import { SocietyProvider } from "../context/SocietyContext.jsx";

const ProtectedRoutes = ({ isAuthenticated }) => {
  return (
    <Route
      element={
        isAuthenticated ? (
          <SocietyProvider>
            <Layout />
          </SocietyProvider>
        ) : (
          <Navigate to="/login" replace />
        )
      }
    >
      <Route path="/home" element={<HomePage />} />
      {/* અન્ય કોઈ Protected રૂટ્સ અહીં ઉમેરો */}
    </Route>
  );
};

export default ProtectedRoutes;
