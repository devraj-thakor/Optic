import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Lead } from "@/types";

interface UIState {
  // Daily briefing overlay
  isBriefingOpen: boolean;
  openBriefing: () => void;
  closeBriefing: () => void;

  // Selected lead for detail view
  selectedLead: Lead | null;
  setSelectedLead: (lead: Lead | null) => void;

  // Sidebar state
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Command palette
  isCommandPaletteOpen: boolean;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isBriefingOpen: false,
      openBriefing: () => set({ isBriefingOpen: true }),
      closeBriefing: () => set({ isBriefingOpen: false }),

      selectedLead: null,
      setSelectedLead: (lead) => set({ selectedLead: lead }),

      isSidebarCollapsed: false,
      toggleSidebar: () =>
        set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),

      isCommandPaletteOpen: false,
      openCommandPalette: () => set({ isCommandPaletteOpen: true }),
      closeCommandPalette: () => set({ isCommandPaletteOpen: false }),
    }),
    {
      name: "ui-storage",
      partialize: (state) => ({ isSidebarCollapsed: state.isSidebarCollapsed }),
    }
  )
);
