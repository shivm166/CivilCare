import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";
import HomePage from "./pages/home/HomePage.jsx";
import PublicLayout from "./components/layout/PublicLayout.jsx";
import LandingPage from "./pages/landing/LandingPage.jsx";
import Login from "./pages/login/Login.jsx";
import Signup from "./pages/signup/Signup.jsx";
import useAuthUser from "./hooks/useAuthUser.js";
import { Toaster } from "react-hot-toast";
import { SocietyProvider } from "./context/SocietyContext.jsx"; // SocietyProvider Import કરો

const App = () => {
  const { isLoading, authUser } = useAuthUser();
  const isAuthenticated = Boolean(authUser);

  // જો authUser ડેટા લોડ થતો હોય તો Loading state રિટર્ન કરી શકાય
  if (isLoading) {
    return <div>Loading user authentication...</div>;
  }

  return (
    <>
      <Routes>
        {/* ==================================== */}
        {/* 1. Public Routes (Landing, Login, Signup) */}
        {/* ==================================== */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<LandingPage />} />

          {/* જો User લોગિન હોય તો /home પર રીડાયરેક્ટ કરો */}
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

        {/* ==================================== */}
        {/* 2. Protected Routes (Requires Login & SocietyContext) */}
        {/* ==================================== */}
        <Route
          // 💡 Parent Route element માં SocietyProvider અને Layout ને Wrap કરો
          element={
            isAuthenticated ? (
              <SocietyProvider>
                <Layout />{" "}
                {/* <Layout> માં હવે Society Context access કરી શકાશે */}
              </SocietyProvider>
            ) : (
              // જો authenticated ન હોય તો Login પર રીડાયરેક્ટ કરો
              <Navigate to="/login" replace />
            )
          }
        >
          {/* Child Routes આ Parent ના Element (Provider + Layout) નો ઉપયોગ કરશે */}
          <Route path="/home" element={<HomePage />} />
          {/* અહીં અન્ય તમામ Protected Routes ઉમેરો */}
          {/* <Route path="/complaints" element={<ComplaintPage />} /> */}
        </Route>

        {/* ==================================== */}
        {/* 3. Catch-all (Optional) */}
        {/* ==================================== */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
      <Toaster />
    </>
  );
};

export default App;
