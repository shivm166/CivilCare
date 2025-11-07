import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";
import RoleSocietySwitcher from "../RoleSocietySwitcher";
import { User } from "lucide-react";
import { useSocietyContext } from "../../context/SocietyContext";

const Layout = () => {
  const { activeRole } = useSocietyContext();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 1. Sidebar (Fixed on the left) */}
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 2. Header (Fixed on top) */}
        <header className="w-full h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm">
          <h1 className="text-xl font-bold text-gray-800">
            {activeRole === "admin" ? "Admin Panel" : "User Panel"}
          </h1>

          {/* Right side: Society/Role Switcher & Profile Link */}
          <div className="flex items-center space-x-4">
            <RoleSocietySwitcher />

            {/* Profile Button (Navigate to the correct role path) */}
            <a
              href={`/${activeRole}/profile`}
              className="btn btn-ghost btn-circle bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <User className="w-5 h-5 text-gray-600" />
            </a>
          </div>
        </header>

        {/* 3. Main Content (Scrollable) */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
