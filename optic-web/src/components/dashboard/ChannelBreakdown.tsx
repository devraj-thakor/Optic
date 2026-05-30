"use client";

import { motion } from "framer-motion";
import { ChannelIcon, CHANNEL_COLORS } from "@/components/ui/ChannelIcon";
import { LEAD_SOURCES } from "@/constants";
import type { DashboardStats } from "@/types";

interface ChannelBreakdownProps {
  data: DashboardStats["leads_by_source"];
}

export default function ChannelBreakdown({ data }: ChannelBreakdownProps) {
  const total  = Object.values(data).reduce((sum, v) => sum + v, 0);
  const sorted = Object.entries(data).sort(([, a], [, b]) => b - a);

  return (
    <div
      className="rounded-xl p-5"
      style={{ background: "#0A0B10", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="mb-5">
        <h3 className="font-semibold text-sm" style={{ fontFamily: "Inter, sans-serif", color: "#FFFFFF" }}>
          Leads by Channel
        </h3>
      </div>

      <div className="space-y-3.5">
        {sorted.map(([source, count]) => {
          const config = LEAD_SOURCES[source as keyof typeof LEAD_SOURCES];
          if (!config) return null;
          const pct   = total > 0 ? Math.round((count / total) * 100) : 0;
          const color = CHANNEL_COLORS[source] ?? "#4B6EF5";

          return (
            <div key={source}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span style={{ color }}><ChannelIcon channel={source} size={13} /></span>
                  <span className="text-sm font-medium" style={{ color: "#FFFFFF" }}>
                    {config.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium tabular-nums" style={{ fontFamily: "Inter, sans-serif", color: "#FFFFFF" }}>
                    {count}
                  </span>
                  <span className="text-xs w-8 text-right" style={{ color: "#94A3B8" }}>
                    {pct}%
                  </span>
                </div>
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                  className="h-full rounded-full"
                  style={{ background: color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
