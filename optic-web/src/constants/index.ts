// ============================================================
// OPTIC — Constants
// ============================================================

import type { LeadPriority, LeadSource, LeadStatus, UrgencyLevel } from "@/types";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const LEAD_SOURCES: Record<LeadSource, { label: string; color: string; icon: string }> = {
  website:   { label: "Website",   color: "#4B6EF5", icon: "" },
  whatsapp:  { label: "WhatsApp",  color: "#25D366", icon: "" },
  instagram: { label: "Instagram", color: "#E1306C", icon: "" },
  facebook:  { label: "Facebook",  color: "#1877F2", icon: "" },
  linkedin:  { label: "LinkedIn",  color: "#0A66C2", icon: "" },
  referral:  { label: "Referral",  color: "#F59E0B", icon: "" },
};

export const LEAD_STATUSES: Record<LeadStatus, { label: string; color: string; bg: string }> = {
  new:       { label: "New",       color: "#818CF8", bg: "rgba(129,140,248,0.1)" },
  contacted: { label: "Contacted", color: "#22C55E", bg: "rgba(34,197,94,0.1)"   },
  qualified: { label: "Qualified", color: "#10B981", bg: "rgba(16,185,129,0.1)"  },
  closed:    { label: "Closed",    color: "#6B7280", bg: "rgba(77,85,104,0.12)"  },
};

export const LEAD_PRIORITIES: Record<LeadPriority, { label: string; color: string; border: string }> = {
  low:    { label: "Low",    color: "#6B7280", border: "#4D5568" },
  medium: { label: "Medium", color: "#F59E0B", border: "#F59E0B" },
  high:   { label: "High",   color: "#F87171", border: "#F87171" },
};

export const URGENCY_LEVELS: Record<UrgencyLevel, { label: string; color: string; bg: string }> = {
  low:      { label: "Low",      color: "#94A3B8", bg: "rgba(71,85,105,0.15)"   },
  medium:   { label: "Medium",   color: "#F59E0B", bg: "rgba(245,158,11,0.15)"  },
  high:     { label: "High",     color: "#F87171", bg: "rgba(248,113,113,0.15)" },
  critical: { label: "Critical", color: "#F87171", bg: "rgba(248,113,113,0.2)"  },
};

export const LEAD_SOURCE_LIST = Object.keys(LEAD_SOURCES) as LeadSource[];
export const LEAD_STATUS_LIST = Object.keys(LEAD_STATUSES) as LeadStatus[];
export const LEAD_PRIORITY_LIST = Object.keys(LEAD_PRIORITIES) as LeadPriority[];
