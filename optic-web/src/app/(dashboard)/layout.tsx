"use client";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import LeadBriefing from "@/components/dashboard/LeadBriefing";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  useKeyboardShortcuts();

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#06070B" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Purple gradient glow — top right corner, matching CyberX reference */}
        <div
          className="pointer-events-none absolute top-0 right-0 z-0"
          style={{
            width:  "65%",
            height: "65%",
            background: "radial-gradient(ellipse at 80% 0%, rgba(88,40,180,0.35) 0%, rgba(75,110,245,0.12) 40%, transparent 70%)",
          }}
        />

        <Header />

        <main className="flex-1 overflow-y-auto relative z-10" style={{ padding: "28px 28px 28px" }}>
          {children}
        </main>
      </div>

      {/* Daily Briefing overlay */}
      <LeadBriefing />
    </div>
  );
}
