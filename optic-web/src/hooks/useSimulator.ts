/**
 * useSimulator — zero-cache live feed for the Simulator page.
 *
 * The feed uses a plain useEffect interval (NO TanStack Query) so there is
 * absolutely no caching layer between the component and the API.  Every 3 s
 * we fire a fresh axios request and replace local state with the raw response.
 *
 * Mutations (generate, clear) also skip TanStack Query for the feed; they
 * call the API, then immediately trigger a manual refetch so the updated list
 * appears in < 500 ms without any cache race-conditions.
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import type { Lead, LeadSource } from "@/types";
import { leadsKeys } from "./useLeads";
import { dashboardKeys } from "./useDashboard";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SimulatorFeedState {
  leads:     Lead[];
  isLoading: boolean;
  error:     string | null;
}

// ─── Live Feed (NO TanStack Query) ───────────────────────────────────────────

/**
 * Polls /api/leads every 3 seconds using a plain setInterval.
 * Returns a `refetch` callback so mutations can trigger an immediate refresh.
 */
export function useSimulatorFeed() {
  const [state, setState] = useState<SimulatorFeedState>({
    leads:     [],
    isLoading: true,
    error:     null,
  });

  // Keep a stable ref to the fetch function so the interval never closes over stale values
  const fetchLeads = useCallback(async () => {
    try {
      const { data } = await api.get("/leads", { params: { per_page: 20 } });
      setState({ leads: data.data.data as Lead[], isLoading: false, error: null });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to fetch leads";
      setState((prev) => ({ ...prev, isLoading: false, error: msg }));
    }
  }, []);

  // Initial fetch + 3-second poll
  useEffect(() => {
    let alive = true;

    // Immediate first fetch
    fetchLeads();

    const interval = setInterval(() => {
      if (alive) fetchLeads();
    }, 3000);

    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, [fetchLeads]);

  return { ...state, refetch: fetchLeads };
}

// ─── Invalidate other TanStack Query caches (dashboard, leads list) ──────────

function useInvalidateSideCaches() {
  const queryClient = useQueryClient();
  return useCallback(() => {
    queryClient.invalidateQueries({ queryKey: leadsKeys.all(),        refetchType: "all" });
    queryClient.invalidateQueries({ queryKey: dashboardKeys.stats(),  refetchType: "all" });
    queryClient.invalidateQueries({ queryKey: dashboardKeys.recent(), refetchType: "all" });
  }, [queryClient]);
}

// ─── Generate Demo Lead ───────────────────────────────────────────────────────

interface UseGenerateLeadOptions {
  onSuccess?: (lead: Lead) => void;
}

export function useGenerateLead(
  refetch: () => Promise<void>,
  options: UseGenerateLeadOptions = {}
) {
  const invalidateSide = useInvalidateSideCaches();

  return useMutation({
    mutationFn: async (channel?: LeadSource) => {
      const { data } = await api.post("/demo/generate-lead", { channel: channel ?? null });
      return data.data as Lead;
    },
    onSuccess: async (newLead) => {
      // Immediately refresh the feed from server — no optimistic update, no race
      await refetch();
      // Also refresh dashboard / leads list caches
      invalidateSide();
      options.onSuccess?.(newLead);
      toast.success(`Lead generated via ${newLead.source}!`);
    },
    onError: () => {
      toast.error("Failed to generate demo lead");
    },
  });
}

// ─── Clear Demo Leads ────────────────────────────────────────────────────────

export function useClearDemoLeads(refetch: () => Promise<void>) {
  const invalidateSide = useInvalidateSideCaches();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.delete("/demo/clear-leads");
      return data.data as { deleted_count: number };
    },
    onSuccess: async (result) => {
      await refetch();
      invalidateSide();
      toast.success(
        `Cleared ${result.deleted_count} demo lead${result.deleted_count !== 1 ? "s" : ""}`
      );
    },
    onError: () => {
      toast.error("Failed to clear demo leads");
    },
  });
}
