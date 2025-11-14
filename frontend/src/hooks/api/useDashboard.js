import { useQuery } from "@tanstack/react-query";
import { getDashboardCounts } from "../api/dashboard.api";

export const useDashboard = () => {
  return useQuery({
    queryKey: ["dashboard-counts"],
    queryFn: getDashboardCounts,
  });
};
