import { Routes, Route } from "react-router-dom";

import useAuthUser from "./hooks/useAuthUser.js";
import { Toaster } from "react-hot-toast";
import PublicRoutes from "./routes/PublicRoutes.jsx";
import ProtectedRoutes from "./routes/ProtectedRoutes.jsx";
import PageLoader from "./components/common/PageLoader.jsx";

// ✅ ADD THIS IMPORT
import ActivateAccountPage from "./pages/activation/ActivateAccountPage";

const App = () => {
  const { isLoading, authUser } = useAuthUser();
  const isAuthenticated = Boolean(authUser);

  if (isLoading) {
    return <div>{<PageLoader />}</div>;
  }

  return (
    <>
      <div className="font-serif" data-theme="light">
        <Routes>
          {/* ✅ ADD ACTIVATION ROUTE (public, before other routes) */}
          <Route path="/activate-account" element={<ActivateAccountPage />} />

          {PublicRoutes({ isAuthenticated })}

          {ProtectedRoutes({ authUser })}
        </Routes>
        <Toaster />
      </div>
    </>
  );
};

export default App;
