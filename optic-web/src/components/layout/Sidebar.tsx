"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* ─── Nav Items ─────────────────────────────────────────────────────────────── */
const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: () => (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1" y="1" width="6.5" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="10.5" y="1" width="6.5" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="1" y="10.5" width="6.5" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="10.5" y="10.5" width="6.5" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    ),
  },
  {
    href: "/leads",
    label: "Leads",
    icon: () => (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M2.5 15.5C2.5 12.46 5.46 10 9 10C12.54 10 15.5 12.46 15.5 15.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: "/simulator",
    label: "Simulator",
    icon: () => (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.4"/>
        <circle cx="9" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.4"/>
        <circle cx="9" cy="9" r="1" fill="currentColor"/>
        <line x1="9" y1="1.5" x2="9" y2="3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <line x1="9" y1="15" x2="9" y2="16.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <line x1="1.5" y1="9" x2="3" y2="9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <line x1="15" y1="9" x2="16.5" y2="9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
];

/* ─── Optic Logo Icon ───────────────────────────────────────────────────────── */
function OpticLogoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="1.5" fill="none"/>
      <path d="M10 4L15 10L10 16L5 10L10 4Z" stroke="white" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
      <circle cx="10" cy="10" r="2" fill="white"/>
    </svg>
  );
}

/* ─── Logout Icon ───────────────────────────────────────────────────────────── */
function LogoutIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M10 5L13 7.5L10 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 7.5H13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M6 2.5H3C2.45 2.5 2 2.95 2 3.5V11.5C2 12.05 2.45 12.5 3 12.5H6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}

/* ─── Expand Icon (two arrows pointing outward) ─────────────────────────────── */
function ExpandIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M5.5 2.5H2.5V5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9.5 2.5H12.5V5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5.5 12.5H2.5V9.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9.5 12.5H12.5V9.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ─── Collapse Icon (two arrows pointing inward) ────────────────────────────── */
function CollapseIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M2.5 5.5V2.5H5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12.5 5.5V2.5H9.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2.5 9.5V12.5H5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12.5 9.5V12.5H9.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ─── Component ─────────────────────────────────────────────────────────────── */
export default function Sidebar() {
  const pathname                              = usePathname();
  const { logout }                            = useAuth();
  const { user }                              = useAuthStore();
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "OP";

  return (
    <motion.aside
      animate={{ width: isSidebarCollapsed ? 64 : 240 }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      className="flex flex-col h-full flex-shrink-0 relative"
      style={{
        background:  "#0A0B10",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        minHeight:   "100vh",
      }}
    >
      <div className="flex flex-col h-full overflow-hidden">
      {/* ── Logo Row ─────────────────────────────────────────────── */}
      <div
        className="flex items-center h-[60px] px-4 flex-shrink-0 gap-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Logo icon — always visible */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "#4B6EF5" }}
        >
          <OpticLogoIcon />
        </div>

        {/* Name — visible when expanded */}
        <AnimatePresence>
          {!isSidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.18 }}
              className="font-bold text-[17px] tracking-tight whitespace-nowrap overflow-hidden flex-1"
              style={{ color: "#FFFFFF" }}
            >
              Optic
            </motion.span>
          )}
        </AnimatePresence>

      </div>

      {/* ── Main Navigation ──────────────────────────────────────── */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              prefetch={true}
              title={isSidebarCollapsed ? label : undefined}
              className={cn(
                "flex items-center gap-3.5 px-3 py-2.5 rounded-[10px] text-sm font-medium transition-all duration-150",
                isActive ? "text-[#A5B4FC]" : "text-[#94A3B8] hover:text-[#CBD5E1]"
              )}
              style={
                isActive
                  ? {
                      background: "rgba(75,110,245,0.08)",
                      border: "1px solid rgba(75,110,245,0.3)",
                      boxShadow: "0 0 20px rgba(75,110,245,0.15)",
                    }
                  : { border: "1px solid transparent" }
              }
            >
              <span
                className="flex-shrink-0 transition-colors duration-150"
                style={{ color: isActive ? "#818CF8" : "currentColor" }}
              >
                <Icon />
              </span>
              <AnimatePresence>
                {!isSidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.15 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* ── User Profile row + Logout ─────────────────────────────── */}
      <div
        className="px-3 py-3 flex-shrink-0"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-3 px-2 py-2 rounded-[10px]"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          {/* Avatar */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #4B6EF5, #818CF8)",
              color: "#FFFFFF",
            }}
          >
            {initials}
          </div>

          {/* Name + email */}
          <AnimatePresence>
            {!isSidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                className="flex-1 min-w-0 overflow-hidden"
              >
                <p className="text-sm font-medium truncate whitespace-nowrap" style={{ color: "#FFFFFF" }}>
                  {user?.name || "Founder"}
                </p>
                <p className="text-xs truncate whitespace-nowrap" style={{ color: "#94A3B8" }}>
                  {user?.email}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Logout icon button — always visible */}
          <button
            id="sidebar-logout"
            onClick={() => logout()}
            title="Sign out"
            className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg transition-all"
            style={{ color: "#94A3B8" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#F87171")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#94A3B8")}
          >
            <LogoutIcon />
          </button>
        </div>
      </div>
      </div>

      {/* ── Jira-like collapse toggle ─────────────────────────────── */}
      <button
        onClick={toggleSidebar}
        className="absolute top-1/2 -translate-y-1/2 -right-[12px] w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#12141F] border border-[rgba(255,255,255,0.1)] text-[#94A3B8] hover:bg-[#1A1D2E] hover:text-[#FFFFFF] transition-all z-50 cursor-pointer"
        style={{ boxShadow: "0 0 10px rgba(0,0,0,0.5)" }}
        title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </motion.aside>
  );
}
