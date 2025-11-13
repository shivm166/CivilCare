import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSocieties } from "../lib/api";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import PageLoader from "../components/common/PageLoader";

const SocietyContext = createContext(null);

const getAvailableRoles = (roleInSociety) => {
  const roles = [roleInSociety];
  if (roleInSociety === "admin" && !roles.includes("member")) {
    roles.push("member");
  }
  return roles;
};

export const SocietyProvider = ({ children }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeSocietyId, setActiveSocietyId] = useState(
    () => localStorage.getItem("activeSocietyId") || null
  );

  // Store the currently active role for the active society (e.g., 'admin' or 'member')
  const [activeRole, setActiveRole] = useState(
    () => localStorage.getItem("activeRole") || null
  );

  const { data: societiesData, isLoading: isSocietiesLoading } = useQuery({
    queryKey: ["userSocieties"],
    queryFn: getSocieties,
    enabled: true,
  });

  const societies = Array.isArray(societiesData) ? societiesData : [];

  const activeSociety = useMemo(() => {
    const society =
      societies.find((s) => s.societyId === activeSocietyId) || null;

    if (society) {
      // Attach available roles to the active society object
      society.availableRoles = getAvailableRoles(society.role);
    }

    return society;
  }, [societies, activeSocietyId]);

  // Effect to handle default selection and role redirection
  useEffect(() => {
    if (!isSocietiesLoading && societies.length > 0) {
      const defaultId = activeSocietyId || societies[0].societyId;
      const currentSociety = societies.find((s) => s.societyId === defaultId);
      const highestRole = currentSociety ? currentSociety.role : null;

      // Update local storage and states if a society is active but context is not initialized
      if (!activeSocietyId) {
        setActiveSocietyId(defaultId);
        localStorage.setItem("activeSocietyId", defaultId);
      }

      // Set default role to the highest role (admin > member) if not set or invalid
      if (
        highestRole &&
        (!activeRole || !getAvailableRoles(highestRole).includes(activeRole))
      ) {
        setActiveRole(highestRole);
        localStorage.setItem("activeRole", highestRole);

        // Redirect to new dashboard based on highest role
        const defaultPath =
          highestRole === "admin" ? "/admin/dashboard" : "/user/dashboard";
        navigate(defaultPath, { replace: true });
      }
    } else if (!isSocietiesLoading && societies.length === 0) {
      // ✅ Clear storage but don't redirect - let ProtectedRoutes handle it
      localStorage.removeItem("activeSocietyId");
      localStorage.removeItem("activeRole");
      setActiveSocietyId(null);
      setActiveRole(null);
    }
  }, [societies, activeSocietyId, isSocietiesLoading, activeRole, navigate]);

  const switchSociety = (societyId) => {
    const newSociety = societies.find((s) => s.societyId === societyId);
    if (newSociety) {
      const newHighestRole = newSociety.role;

      setActiveSocietyId(societyId);
      localStorage.setItem("activeSocietyId", societyId);

      // Reset role to the highest available role in the new society
      setActiveRole(newHighestRole);
      localStorage.setItem("activeRole", newHighestRole);

      // Navigate to the new role's dashboard
      const newPath =
        newHighestRole === "admin" ? "/admin/dashboard" : "/user/dashboard";
      navigate(newPath);
    }
  };

  const switchRole = (role) => {
    if (activeSociety?.availableRoles?.includes(role) && role !== activeRole) {
      setActiveRole(role);
      localStorage.setItem("activeRole", role);

      // Navigate to the dashboard for the new role
      const newPath = role === "admin" ? "/admin/dashboard" : "/user/dashboard";
      navigate(newPath);
    }
  };

  const contextValue = {
    societies,
    activeSociety,
    activeSocietyId,
    activeRole,
    isSocietiesLoading,
    switchSociety,
    switchRole,
    clearActiveSociety: () => {
      localStorage.removeItem("activeSocietyId");
      localStorage.removeItem("activeRole");
      setActiveSocietyId(null);
      setActiveRole(null);
    },
  };

  return (
    <SocietyContext.Provider value={contextValue}>
      {isSocietiesLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{<PageLoader />}</p>
          </div>
        </div>
      ) : (
        children
      )}
    </SocietyContext.Provider>
  );
};

export const useSocietyContext = () => {
  const context = useContext(SocietyContext);
  if (!context) {
    throw new Error("useSocietyContext must be used within a SocietyProvider");
  }
  return context;
};
