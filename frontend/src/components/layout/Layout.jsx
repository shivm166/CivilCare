import { Outlet } from "react-router-dom";
import RoleSocietySwitcher from "../role-based/RoleSocietySwitcher/RoleSocietySwitcher";
import { User } from "lucide-react";
import Sidebar from "./Sidebar/Sidebar";
import { useSocietyContext } from "../../contexts/SocietyContext";

const Layout = () => {
  const { activeRole } = useSocietyContext();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header
          //  className="w-full h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm"

          className="w-full h-16 bg-white border-b border-gray-200 
flex items-center justify-between px-6 pl-16 sticky top-0 z-20 shadow-sm" // ---- css to gape between header and sidebar ----
        >
          <h1 className="text-xl font-bold text-gray-800">
            {activeRole === "admin" ? "" : ""}
          </h1>

          <div className="flex items-center space-x-4">
            <RoleSocietySwitcher />

            {/* <a
              href={`/${activeRole === "admin" ? "admin" : "user"}/profile`}
              className="btn btn-ghost btn-circle bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <User className="w-5 h-5 text-gray-600" />
            </a> */}
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="p-6 h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
