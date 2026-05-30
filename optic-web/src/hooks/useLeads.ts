import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import type { Lead, LeadFilters, PaginatedLeads, CreateLeadFormData, UpdateLeadFormData } from "@/types";
import { dashboardKeys } from "./useDashboard";

// Keys
export const leadsKeys = {
  all:    () => ["leads"] as const,
  list:   (filters: LeadFilters) => ["leads", "list", filters] as const,
  detail: (id: string) => ["leads", "detail", id] as const,
};

// Shared: force-refetch all lead queries + dashboard
function invalidateLeadCaches(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: leadsKeys.all(), refetchType: "all" });
  queryClient.invalidateQueries({ queryKey: dashboardKeys.stats(), refetchType: "all" });
  queryClient.invalidateQueries({ queryKey: dashboardKeys.recent(), refetchType: "all" });
}

// List with filters
export function useLeads(filters: LeadFilters = {}) {
  return useQuery({
    queryKey: leadsKeys.list(filters),
    queryFn: async () => {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== undefined && v !== "")
      );
      const { data } = await api.get("/leads", { params });
      return data.data as PaginatedLeads;
    },
    staleTime: 0,   // Always refetch on invalidate
  });
}

// Single lead
export function useLead(id: string) {
  return useQuery({
    queryKey: leadsKeys.detail(id),
    queryFn: async () => {
      const { data } = await api.get(`/leads/${id}`);
      return data.data as Lead;
    },
    enabled: !!id,
    staleTime: 0,
    refetchInterval: 5000, // Poll every 5s to catch AI insight arriving
  });
}

// Create lead
export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: CreateLeadFormData) => {
      const { data } = await api.post("/leads", formData);
      return data.data as Lead;
    },
    onSuccess: () => {
      invalidateLeadCaches(queryClient);
      toast.success("Lead created! AI analysis queued.");
    },
    onError: () => {
      toast.error("Failed to create lead");
    },
  });
}

// Update lead
export function useUpdateLead(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: UpdateLeadFormData) => {
      const { data } = await api.put(`/leads/${id}`, formData);
      return data.data as Lead;
    },
    onSuccess: (updatedLead) => {
      // Update the detail cache immediately (no network round-trip)
      queryClient.setQueryData(leadsKeys.detail(id), updatedLead);
      // Force-refetch list caches
      invalidateLeadCaches(queryClient);
      toast.success("Lead updated");
    },
    onError: () => {
      toast.error("Failed to update lead");
    },
  });
}

// Delete lead
export function useDeleteLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/leads/${id}`);
      return id;
    },
    onSuccess: (id) => {
      // Remove from detail cache immediately
      queryClient.removeQueries({ queryKey: leadsKeys.detail(id) });
      invalidateLeadCaches(queryClient);
      toast.success("Lead deleted");
    },
    onError: () => {
      toast.error("Failed to delete lead");
    },
  });
}

// Regenerate AI insights — polls detail every 2s for up to 30s until insight arrives
export function useRegenerateInsights(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.post(`/leads/${id}/regenerate-insights`);
    },
    onSuccess: () => {
      toast.info("AI re-analyzing lead…");

      // Poll the detail query every 2s for up to 30s to catch the insight
      let attempts = 0;
      const maxAttempts = 15;
      const interval = setInterval(async () => {
        attempts++;
        await queryClient.invalidateQueries({
          queryKey: leadsKeys.detail(id),
          refetchType: "all",
        });

        const data = queryClient.getQueryData<Lead>(leadsKeys.detail(id));
        if (data?.insight || attempts >= maxAttempts) {
          clearInterval(interval);
          if (data?.insight) toast.success("AI insight updated!");
        }
      }, 2000);
    },
    onError: () => {
      toast.error("Failed to queue AI regeneration");
    },
  });
}
