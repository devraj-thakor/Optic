import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { DashboardStats, Lead } from "@/types";

export const dashboardKeys = {
  stats:  () => ["dashboard", "stats"] as const,
  recent: () => ["dashboard", "recent"] as const,
};

export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: async () => {
      const { data } = await api.get("/dashboard/stats");
      return data.data as DashboardStats;
    },
    refetchInterval: 30000,
    staleTime: 0, // Refetch immediately when invalidated
  });
}

export function useRecentLeads() {
  return useQuery({
    queryKey: dashboardKeys.recent(),
    queryFn: async () => {
      const { data } = await api.get("/dashboard/recent-leads");
      return data.data as Lead[];
    },
    refetchInterval: 5000,
    staleTime: 0, // Refetch immediately when invalidated
  });
}
