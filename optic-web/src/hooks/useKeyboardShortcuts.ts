"use client";

import { useEffect } from "react";
import { useUIStore } from "@/store/uiStore";

export function useKeyboardShortcuts() {
  const { openBriefing, closeBriefing, isBriefingOpen, openCommandPalette, closeCommandPalette, isCommandPaletteOpen } = useUIStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Skip if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.contentEditable === "true"
      ) {
        return;
      }

      // B — Daily Briefing
      if (e.key === "b" || e.key === "B") {
        if (isBriefingOpen) {
          closeBriefing();
        } else {
          openBriefing();
        }
        return;
      }

      // K — Command palette (Cmd+K / Ctrl+K)
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isCommandPaletteOpen) {
          closeCommandPalette();
        } else {
          openCommandPalette();
        }
        return;
      }

      // Escape — close overlays
      if (e.key === "Escape") {
        closeBriefing();
        closeCommandPalette();
        return;
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isBriefingOpen, isCommandPaletteOpen, openBriefing, closeBriefing, openCommandPalette, closeCommandPalette]);
}
