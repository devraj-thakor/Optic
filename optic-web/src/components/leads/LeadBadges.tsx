"use client";

import { LEAD_SOURCES, LEAD_STATUSES, LEAD_PRIORITIES } from "@/constants";
import { ChannelIcon, CHANNEL_COLORS } from "@/components/ui/ChannelIcon";
import type { LeadSource, LeadStatus, LeadPriority } from "@/types";

/* ─── Source Badge (premium SVG icon) ──────────────────────────────────────── */
export function SourceBadge({ source }: { source: LeadSource }) {
  const config = LEAD_SOURCES[source];
  const color  = CHANNEL_COLORS[source] ?? config.color;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ background: `${color}14`, color }}
    >
      <ChannelIcon channel={source} size={11} />
      {config.label}
    </span>
  );
}

/* ─── Status Badge ──────────────────────────────────────────────────────────── */
export function StatusBadge({ status }: { status: LeadStatus }) {
  const config = LEAD_STATUSES[status];
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ background: config.bg, color: config.color }}
    >
      {config.label}
    </span>
  );
}

/* ─── Priority Badge ────────────────────────────────────────────────────────── */
export function PriorityBadge({ priority }: { priority: LeadPriority }) {
  const config = LEAD_PRIORITIES[priority];
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-medium"
      style={{ color: config.color }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: config.color }} />
      {config.label}
    </span>
  );
}

/* ─── Lead Score Circle ─────────────────────────────────────────────────────── */
export function LeadScoreCircle({ score }: { score: number | null }) {
  if (score === null) {
    return (
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ border: "2px dashed rgba(75,110,245,0.35)" }}
        title="AI analysis in progress..."
      >
        <span
          className="text-[9px] font-bold animate-pulse-blue"
          style={{ color: "#4B6EF5", fontFamily: "Inter, sans-serif", letterSpacing: "0.05em" }}
        >
          AI
        </span>
      </div>
    );
  }

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#22C55E" : score >= 60 ? "#4B6EF5" : score >= 40 ? "#F59E0B" : "#F87171";

  return (
    <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
      <svg width="48" height="48" className="absolute inset-0 -rotate-90">
        <circle cx="24" cy="24" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
        <circle
          cx="24" cy="24" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <span className="relative text-xs font-bold tabular-nums" style={{ color, fontFamily: "Inter, sans-serif" }}>
        {score}
      </span>
    </div>
  );
}

/* ─── Styled Select (fixes white dropdown issue) ────────────────────────────── */
interface StyledSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

export function StyledSelect({ children, className = "", style, ...props }: StyledSelectProps) {
  return (
    <select
      {...props}
      className={`input-optic px-2.5 py-1.5 text-xs cursor-pointer rounded-lg ${className}`}
      style={{
        background:  "#12141F",
        color:       "#FFFFFF",
        border:      "1px solid rgba(255,255,255,0.1)",
        appearance:  "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%234D5568' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3C/svg%3E")`,
        backgroundRepeat:   "no-repeat",
        backgroundPosition: "right 8px center",
        paddingRight:       "28px",
        ...style,
      }}
    >
      {children}
    </select>
  );
}
