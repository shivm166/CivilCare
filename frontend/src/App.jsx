import { Routes } from "react-router-dom";

import useAuthUser from "./hooks/useAuthUser.js";
import { Toaster } from "react-hot-toast";
import PublicRoutes from "./routes/PublicRoutes.jsx";
import ProtectedRoutes from "./routes/ProtectedRoutes.jsx";
import PageLoader from "./components/common/PageLoader.jsx";

const App = () => {
  const { isLoading, authUser } = useAuthUser();
  const isAuthenticated = Boolean(authUser);

  if (isLoading) {
    // return <h1>dhruuv</h1>;
    return <div>{<PageLoader />}</div>;
  }

  return (
    <>
      <div className="font-serif" data-theme="light">
        <Routes>
          {PublicRoutes({ isAuthenticated })}

          {ProtectedRoutes({ authUser })}
        </Routes>
        <Toaster />
      </div>
    </>
  );
};

export default App;
