import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";
import HomePage from "./pages/home/HomePage.jsx";
import PublicLayout from "./components/layout/PublicLayout.jsx";
import LandingPage from "./pages/landing/LandingPage.jsx";
import Login from "./pages/login/Login.jsx";
import Signup from "./pages/signup/Signup.jsx";
import useAuthUser from "./hooks/useAuthUser.js";
import { Toaster } from "react-hot-toast";
import { SocietyProvider } from "./context/SocietyContext.jsx";

const App = () => {
  const { isLoading, authUser } = useAuthUser();
  const isAuthenticated = Boolean(authUser);

  if (isLoading) {
    return <div>Loading user authentication...</div>;
  }

  return (
    <>
      <Routes>
        {/* 1. Public Routes (Landing, Login, Signup) */}

        <Route path="/" element={<PublicLayout />}>
          <Route index element={<LandingPage />} />

          <Route
            path="/login"
            element={
              !isAuthenticated ? <Login /> : <Navigate to="/home" replace />
            }
          />
          <Route
            path="/signup"
            element={
              !isAuthenticated ? <Signup /> : <Navigate to="/home" replace />
            }
          />
        </Route>

        {/* 2. Protected Routes  */}

        <Route
          element={
            isAuthenticated ? (
              <SocietyProvider>
                <Layout />{" "}
              </SocietyProvider>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route path="/home" element={<HomePage />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
};

export default App;
