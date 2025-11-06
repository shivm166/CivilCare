import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSocieties } from "../lib/api"; // (ધારો કે તમે આ API ફંક્શન બનાવ્યું છે)

const SocietyContext = createContext(null);

export const SocietyProvider = ({ children }) => {
  const queryClient = useQueryClient();
  // 1. શરૂઆતમાં localStorage માંથી active society ID મેળવો
  const [activeSocietyId, setActiveSocietyId] = useState(
    () => localStorage.getItem("activeSocietyId") || null
  );

  // 2. Backend માંથી યુઝરની બધી societies મેળવો
  const { data: societies, isLoading: isSocietiesLoading } = useQuery({
    queryKey: ["userSocieties"],
    queryFn: getSocieties, // /api/user/societies ને કોલ કરશે
    enabled: true, // યુઝર લોગિન થયેલ છે એમ માનીને
  });

  // 3. activeSocietyId ના આધારે વર્તમાન society ની વિગતો મેળવો
  const activeSociety = useMemo(() => {
    return societies?.find((s) => s.societyId === activeSocietyId) || null;
  }, [societies, activeSocietyId]);

  // 4. જો કોઈ society પસંદ ન હોય તો પ્રથમ society ને default તરીકે સેટ કરો
  useEffect(() => {
    if (!activeSocietyId && societies && societies.length > 0) {
      const defaultId = societies[0].societyId;
      setActiveSocietyId(defaultId);
      localStorage.setItem("activeSocietyId", defaultId);
    }
  }, [societies, activeSocietyId]);

  // 5. Society બદલવા માટેનું મુખ્ય ફંક્શન
  const switchSociety = (societyId) => {
    if (societies.some((s) => s.societyId === societyId)) {
      setActiveSocietyId(societyId);
      localStorage.setItem("activeSocietyId", societyId);

      // TanStack Query ને Forcefully invalidate (ફરીથી fetch) કરો
      // જેથી Dashboard નો ડેટા નવી society ના સંદર્ભમાં આવે (દા.ત., Complaints, Announcements)
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });

      // toast.success(`Switched to ${societies.find(s => s.societyId === societyId)?.societyName}`);
    }
  };

  const contextValue = {
    societies: societies || [],
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

// Hook નો ઉપયોગ કરીને Context access કરો
export const useSocietyContext = () => {
  const context = useContext(SocietyContext);
  if (!context) {
    throw new Error("useSocietyContext must be used within a SocietyProvider");
  }
  return context;
};
