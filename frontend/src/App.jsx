import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";
import HomePage from "./pages/home/HomePage.jsx";
import PublicLayout from "./components/layout/PublicLayout.jsx";
import LandingPage from "./pages/landing/LandingPage.jsx";
import Login from "./pages/login/Login.jsx";
import Signup from "./pages/signup/Signup.jsx";
import useAuthUser from "./hooks/useAuthUser.js";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { isLoading, authUser } = useAuthUser();
  const isAuthenticated = Boolean(authUser);

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        <Route element={<Layout />}>
          <Route path="/home" element={<HomePage />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
