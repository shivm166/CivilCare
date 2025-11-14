// src/hooks/api/useSocietyWiseUserCount.js

import { useQuery } from "@tanstack/react-query";
import { getSocietyWiseUserCountApi } from "../../services/api/society.api";

export const useSocietyWiseUserCount = () => {
  return useQuery({
    queryKey: ["societyWiseUserCount"],
    queryFn: getSocietyWiseUserCountApi,
  });
};
