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

  // 2. Backend માંથી યુઝરની બધી societies મેળવો
  const { data: societiesData, isLoading: isSocietiesLoading } = useQuery({
    queryKey: ["userSocieties"],
    queryFn: getSocieties, // /api/user/societies ને કોલ કરશે
    enabled: true,
  });

  const societies = Array.isArray(societiesData) ? societiesData : [];
  console.log("Societies in Context:", societies);

  // 3. activeSocietyId ના આધારે વર્તમાન society ની વિગતો મેળવો
  const activeSociety = useMemo(() => {
    // હવે societies એ હંમેશા Array હશે, તેથી .find() સુરક્ષિત રીતે વાપરી શકાય છે
    return societies.find((s) => s.societyId === activeSocietyId) || null;
  }, [societies, activeSocietyId]);

  // 4. જો કોઈ society પસંદ ન હોય તો પ્રથમ society ને default તરીકે સેટ કરો
  useEffect(() => {
    // isLoading = false હોય અને societies હોય અને કોઈ activeSocietyId સેટ ન હોય
    if (!activeSocietyId && !isSocietiesLoading && societies.length > 0) {
      const defaultId = societies[0].societyId;
      setActiveSocietyId(defaultId);
      localStorage.setItem("activeSocietyId", defaultId);
    }
  }, [societies, activeSocietyId, isSocietiesLoading]);

  // 5. Society બદલવા માટેનું મુખ્ય ફંક્શન
  const switchSociety = (societyId) => {
    if (societies.some((s) => s.societyId === societyId)) {
      setActiveSocietyId(societyId);
      localStorage.setItem("activeSocietyId", societyId);

      // ... queryClient.invalidateQueries(...)
    }
  };

  const contextValue = {
    societies, // હવે આ હંમેશા Array છે
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
      {/* Loading state અહીંયા handle કરી શકાય છે */}
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
