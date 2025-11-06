import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSocieties } from "../lib/api";

const SocietyContext = createContext(null);

export const SocietyProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [activeSocietyId, setActiveSocietyId] = useState(
    () => localStorage.getItem("activeSocietyId") || null
  );

  const { data: societiesData, isLoading: isSocietiesLoading } = useQuery({
    queryKey: ["userSocieties"],
    queryFn: getSocieties,
    enabled: true,
  });

  const societies = Array.isArray(societiesData) ? societiesData : [];
  console.log("Societies in Context:", societies);

  const activeSociety = useMemo(() => {
    return societies.find((s) => s.societyId === activeSocietyId) || null;
  }, [societies, activeSocietyId]);

  useEffect(() => {
    if (!activeSocietyId && !isSocietiesLoading && societies.length > 0) {
      const defaultId = societies[0].societyId;
      setActiveSocietyId(defaultId);
      localStorage.setItem("activeSocietyId", defaultId);
    }
  }, [societies, activeSocietyId, isSocietiesLoading]);

  const switchSociety = (societyId) => {
    if (societies.some((s) => s.societyId === societyId)) {
      setActiveSocietyId(societyId);
      localStorage.setItem("activeSocietyId", societyId);
    }
  };

  const contextValue = {
    societies,
    activeSociety,
    activeSocietyId,
    isSocietiesLoading,
    switchSociety,
    clearActiveSociety: () => {
      localStorage.removeItem("activeSocietyId");
      setActiveSocietyId(null);
    },
  };

  return (
    <SocietyContext.Provider value={contextValue}>
      {isSocietiesLoading ? <div>Loading Societies...</div> : children}
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
