import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSocieties } from "../api/services/society.api";
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import PageLoader from "../pages/error/PageLoader";

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
  const location = useLocation(); // 🔥 Added this
  const queryClient = useQueryClient();
  
  const [activeSocietyId, setActiveSocietyId] = useState(
    () => localStorage.getItem("activeSocietyId") || null
  );

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

      if (!activeSocietyId) {
        setActiveSocietyId(defaultId);
        localStorage.setItem("activeSocietyId", defaultId);
      }

      if (
        highestRole &&
        (!activeRole || !getAvailableRoles(highestRole).includes(activeRole))
      ) {
        setActiveRole(highestRole);
        localStorage.setItem("activeRole", highestRole);
        const defaultPath =
          highestRole === "admin" ? "/admin/dashboard" : "/user/dashboard";
        navigate(defaultPath, { replace: true });
      }
    } else if (!isSocietiesLoading && societies.length === 0) {
      localStorage.removeItem("activeSocietyId");
      localStorage.removeItem("activeRole");
      setActiveSocietyId(null);
      setActiveRole(null);
    }
  }, [societies, activeSocietyId, isSocietiesLoading, activeRole, navigate]);

  // 🔥 NEW: Sync activeRole with URL changes (when user manually types URL)
  useEffect(() => {
    if (!isSocietiesLoading && activeSociety && societies.length > 0) {
      const currentPath = location.pathname;
      const availableRoles = getAvailableRoles(activeSociety.role);
      
      // Determine what role the URL implies
      let urlImpliedRole = null;
      if (currentPath.startsWith('/admin/')) {
        urlImpliedRole = 'admin';
      } else if (currentPath.startsWith('/user/')) {
        urlImpliedRole = 'member';
      }
      
      // Only act if URL implies a role different from current activeRole
      if (urlImpliedRole && urlImpliedRole !== activeRole) {
        // Check if user has permission for this role
        if (availableRoles.includes(urlImpliedRole)) {
          // ✅ User has permission - update the role state
          setActiveRole(urlImpliedRole);
          localStorage.setItem('activeRole', urlImpliedRole);
        } else {
          // ❌ User doesn't have permission - redirect to correct dashboard
          const correctPath = activeRole === 'admin' ? '/admin/dashboard' : '/user/dashboard';
          navigate(correctPath, { replace: true });
        }
      }
    }
  }, [location.pathname, activeSociety, activeRole, isSocietiesLoading, societies.length, navigate]);

  const switchSociety = (societyId) => {
    const newSociety = societies.find((s) => s.societyId === societyId);
    if (newSociety) {
      const newHighestRole = newSociety.role;
      setActiveSocietyId(societyId);
      localStorage.setItem("activeSocietyId", societyId);
      
      setActiveRole(newHighestRole);
      localStorage.setItem("activeRole", newHighestRole);
      
      const newPath =
        newHighestRole === "admin" ? "/admin/dashboard" : "/user/dashboard";
      navigate(newPath);
    }
  };

  const switchRole = (role) => {
    if (activeSociety?.availableRoles?.includes(role) && role !== activeRole) {
      setActiveRole(role);
      localStorage.setItem("activeRole", role);
      
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
        <PageLoader />
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
