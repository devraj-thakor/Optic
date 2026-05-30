"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, RefreshCw } from "lucide-react";
import { SourceBadge, StatusBadge, LeadScoreCircle } from "@/components/leads/LeadBadges";
import { formatRelativeTime } from "@/lib/utils";
import { LEAD_PRIORITIES } from "@/constants";
import type { Lead } from "@/types";

interface RecentLeadsProps {
  leads:      Lead[];
  isLoading?: boolean;
}

function LeadSkeleton() {
  return (
    <div className="flex items-center gap-4 py-3 px-4 rounded-lg animate-pulse" style={{ background: "rgba(255,255,255,0.02)" }}>
      <div className="w-12 h-12 rounded-full flex-shrink-0" style={{ background: "rgba(255,255,255,0.05)" }} />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-32 rounded" style={{ background: "rgba(255,255,255,0.05)" }} />
        <div className="h-2.5 w-52 rounded" style={{ background: "rgba(255,255,255,0.03)" }} />
      </div>
    </div>
  );
}

export default function RecentLeads({ leads, isLoading }: RecentLeadsProps) {
  return (
    <div
      className="rounded-xl p-5"
      style={{ background: "#0A0B10", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm" style={{ fontFamily: "Inter, sans-serif", color: "#FFFFFF" }}>
            Recent Leads
          </h3>
          {isLoading && (
            <RefreshCw size={12} className="animate-spin" style={{ color: "#4B6EF5" }} />
          )}
        </div>
        <Link
          href="/leads"
          prefetch={true}
          className="flex items-center gap-1 text-xs font-medium transition-colors"
          style={{ color: "#94A3B8" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#7B97FF")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#94A3B8")}
        >
          View all <ArrowRight size={11} />
        </Link>
      </div>

      <div className="space-y-0.5">
        {isLoading && leads.length === 0
          ? Array.from({ length: 5 }).map((_, i) => <LeadSkeleton key={i} />)
          : leads.length === 0
          ? (
            <div className="text-center py-8">
              <p className="text-sm" style={{ color: "#94A3B8" }}>No leads yet. Generate some from the Simulator!</p>
            </div>
          )
          : leads.map((lead, i) => {
            const priority = LEAD_PRIORITIES[lead.priority];
            return (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  href={`/leads/${lead.id}`}
                  prefetch={true}
                  className="flex items-center gap-4 py-3 px-3 rounded-lg group transition-all"
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <LeadScoreCircle score={lead.lead_score} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-sm" style={{ color: "#FFFFFF" }}>
                        {lead.name}
                      </span>
                      <SourceBadge source={lead.source} />
                    </div>
                    <p className="text-xs truncate" style={{ color: "#94A3B8" }}>
                      {lead.inquiry_message}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <StatusBadge status={lead.status} />
                    <span className="text-xs" style={{ color: "#94A3B8" }}>
                      {formatRelativeTime(lead.created_at)}
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
      </div>
    </div>
  );
}
