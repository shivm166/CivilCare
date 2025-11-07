import HomePage from "../pages/home/HomePage.jsx";
import SocietyOnboarding from "../pages/onboarding/SocietyOnboarding.jsx";
import Layout from "../components/layout/Layout.jsx";
import { Route, Navigate } from "react-router-dom";
import {
  SocietyProvider,
  useSocietyContext,
} from "../context/SocietyContext.jsx";

// Wrapper component to check society status
const SocietyChecker = ({ children }) => {
  const { societies, isSocietiesLoading } = useSocietyContext();

  if (isSocietiesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user has no societies, redirect to onboarding
  if (societies.length === 0) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

const ProtectedRoutes = ({ isAuthenticated }) => {
  return (
    <>
      {!isAuthenticated ? (
        <Route path="*" element={<Navigate to="/login" replace />} />
      ) : (
        <Route
          element={
            <SocietyProvider>
              <Layout />
            </SocietyProvider>
          }
        >
          {/* Onboarding Route - No society check */}
          <Route path="/onboarding" element={<SocietyOnboarding />} />

          {/* Protected routes - Check if user has societies */}
          <Route
            path="/home"
            element={
              <SocietyChecker>
                <HomePage />
              </SocietyChecker>
            }
          />

          {/* Add other protected routes here with SocietyChecker wrapper */}
        </Route>
      )}
    </>
  );
};

export default ProtectedRoutes;
