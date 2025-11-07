import { Routes } from "react-router-dom";

import useAuthUser from "./hooks/useAuthUser.js";
import { Toaster } from "react-hot-toast";
import PublicRoutes from "./routes/PublicRoutes.jsx";
import ProtectedRoutes from "./routes/ProtectedRoutes.jsx";

const App = () => {
  const { isLoading, authUser } = useAuthUser();
  const isAuthenticated = Boolean(authUser);

  if (isLoading) {
    return <div>Loading user authentication...</div>;
  }

  return (
    <>
      <div className="font-serif" data-theme="light">
        <Routes>
          {PublicRoutes({ isAuthenticated })}

          {ProtectedRoutes({ isAuthenticated })}
        </Routes>
        <Toaster />
      </div>
    </>
  );
};

export default App;
