import { Routes, Route } from "react-router-dom";

import { Toaster } from "react-hot-toast";
import useAuthUser from "./hooks/api/auth/useAuthUser";
import ActivateAccountPage from "./pages/auth/ActivateAccount/ActivateAccountPage";
import PublicRoutes from "./routes/PublicRoutes";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import PageLoader from "./pages/error/PageLoader";

const App = () => {
  const { isLoading, authUser } = useAuthUser();
  const isAuthenticated = Boolean(authUser);

  if (isLoading) {
    return <div>{<PageLoader />}</div>;
  }

  return (
    <>
      <div className="font-sans" data-theme="light">
        <Routes>
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
