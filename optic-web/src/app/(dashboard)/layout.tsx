"use client";

import { useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import LeadBriefing from "@/components/dashboard/LeadBriefing";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useAuthStore } from "@/store/authStore";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  useKeyboardShortcuts();

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated     = useAuthStore((s) => s._hasHydrated);

  useEffect(() => {
    // CRITICAL: only act after Zustand has finished reading from the cookie.
    // Without this guard, the default isAuthenticated=false fires a redirect
    // before the cookie is read, causing an infinite refresh loop.
    if (!hasHydrated) return;

    if (!isAuthenticated) {
      // Hard redirect — bypasses any stale router state
      window.location.href = "/login";
    }
  }, [hasHydrated, isAuthenticated]);

  // Show a spinner while Zustand is still reading the cookie (usually <50ms).
  // Without this, there's a flash of dashboard content or a redirect before
  // we actually know whether the user is authenticated.
  if (!hasHydrated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#06070B" }}
      >
        <div className="w-8 h-8 border-2 border-[#4B6EF5] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // After hydration, if not authenticated, show the same spinner while the
  // hard redirect above fires (usually <100ms, avoids any flash of dashboard).
  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#06070B" }}
      >
        <div className="w-8 h-8 border-2 border-[#4B6EF5] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#06070B" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Purple gradient glow — top right corner */}
        <div
          className="pointer-events-none absolute top-0 right-0 z-0"
          style={{
            width:  "65%",
            height: "65%",
            background: "radial-gradient(ellipse at 80% 0%, rgba(88,40,180,0.35) 0%, rgba(75,110,245,0.12) 40%, transparent 70%)",
          }}
        />

        <Header />

        <main className="flex-1 overflow-y-auto relative z-10 p-4 md:p-7">
          {children}
        </main>
      </div>

      {/* Daily Briefing overlay */}
      <LeadBriefing />
    </div>
  );
}
