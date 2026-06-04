"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowRight, Phone, CheckCircle } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { useLeads } from "@/hooks/useLeads";
import { useUpdateLead } from "@/hooks/useLeads";
import Link from "next/link";
import { LEAD_PRIORITIES, LEAD_SOURCES } from "@/constants";
import { SourceBadge, PriorityBadge, LeadScoreCircle } from "@/components/leads/LeadBadges";
import { formatRelativeTime } from "@/lib/utils";
import type { Lead } from "@/types";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function BriefingLeadCard({ lead }: { lead: Lead }) {
  const { closeBriefing } = useUIStore();
  const updateLead = useUpdateLead(lead.id);

  const markContacted = () => {
    updateLead.mutate({ status: "contacted" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="group rounded-xl p-4 transition-colors"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
    >
      <div className="flex items-start gap-4 mb-3">
        <LeadScoreCircle score={lead.lead_score} />

        <div className="flex-1 min-w-0 pt-0.5">
          <p className="font-medium text-sm mb-1.5 transition-colors" style={{ color: "#FFFFFF" }}>
            {lead.name}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <SourceBadge source={lead.source} />
            <PriorityBadge priority={lead.priority} />
            <span className="text-xs" style={{ color: "#475569" }}>
              {formatRelativeTime(lead.created_at)}
            </span>
          </div>
        </div>
      </div>

      {lead.insight?.recommended_action && (
        <div className="px-3 py-2.5 rounded-lg mb-4" style={{ background: "rgba(45,212,191,0.05)", border: "1px solid rgba(45,212,191,0.1)" }}>
          <p className="text-xs leading-relaxed" style={{ color: "#94A3B8" }}>
            <span className="font-medium mr-1.5" style={{ color: "#2DD4BF" }}>AI Insight:</span>
            {lead.insight.recommended_action}
          </p>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          id={`brief-contact-${lead.id}`}
          onClick={markContacted}
          disabled={updateLead.isPending}
          className="flex items-center justify-center flex-1 gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
          style={{
            background: "rgba(45,212,191,0.1)",
            color: "#2DD4BF",
            border: "1px solid rgba(45,212,191,0.2)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(45,212,191,0.15)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(45,212,191,0.1)")}
        >
          <CheckCircle size={14} />
          Mark Contacted
        </button>
        <Link
          href={`/leads/${lead.id}`}
          onClick={closeBriefing}
          prefetch={true}
          className="flex items-center justify-center flex-1 gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
          style={{
            background: "rgba(255,255,255,0.05)",
            color: "#F1F5F9",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
        >
          Open Lead
          <ArrowRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
}

export default function LeadBriefing() {
  const { isBriefingOpen, closeBriefing } = useUIStore();

  const { data: leadsData } = useLeads({
    status: "new",
    priority: "high",
    per_page: 3,
  });

  const urgentLeads = leadsData?.data?.slice(0, 3) || [];

  return (
    <AnimatePresence>
      {isBriefingOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90]"
            style={{ background: "rgba(7,11,20,0.85)", backdropFilter: "blur(8px)" }}
            onClick={closeBriefing}
          />

          {/* Panel Wrapper for proper flex centering*/}
          <div className="fixed inset-0 z-[100] pointer-events-none flex flex-col items-center justify-end md:justify-center px-4 pb-4 md:p-0">
            <motion.div
              initial={{ opacity: 0, y: 32, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 32, scale: 0.97 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="pointer-events-auto w-full md:max-w-xl rounded-2xl overflow-hidden flex flex-col max-h-[85vh]"
              style={{
                background: "#0D1117",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {/* Header */}
              <div
                className="p-5 border-b flex items-start justify-between"
                style={{ borderColor: "rgba(255,255,255,0.06)" }}
              >
                <div>
                  <p className="text-xs font-medium mb-1" style={{ color: "#2DD4BF" }}>
                    DAILY BRIEFING · {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                  </p>
                  <h2
                    className="text-xl font-bold"
                    style={{ fontFamily: "Syne, sans-serif", color: "#F1F5F9" }}
                  >
                    {getGreeting()}. Here&apos;s what needs your attention.
                  </h2>
                </div>
                <button
                  id="close-briefing"
                  onClick={closeBriefing}
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: "#475569" }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Content */}
              <div className="p-5 space-y-3 overflow-y-auto min-h-[100px]">
                {urgentLeads.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-3xl mb-2">✨</div>
                    <p style={{ color: "#94A3B8" }}>All caught up! No high-priority uncontacted leads.</p>
                  </div>
                ) : (
                  urgentLeads.map((lead) => (
                    <BriefingLeadCard key={lead.id} lead={lead} />
                  ))
                )}
              </div>

              {/* Footer */}
              <div
                className="px-5 py-3 border-t flex items-center justify-between"
                style={{ borderColor: "rgba(255,255,255,0.06)" }}
              >
                <p className="text-xs" style={{ color: "#475569" }}>
                  Press <kbd className="px-1.5 py-0.5 rounded text-xs" style={{ background: "rgba(255,255,255,0.08)" }}>B</kbd> or <kbd className="px-1.5 py-0.5 rounded text-xs" style={{ background: "rgba(255,255,255,0.08)" }}>Esc</kbd> to close
                </p>
                <Link
                  href="/leads"
                  onClick={closeBriefing}
                  prefetch={true}
                  className="text-xs font-medium flex items-center gap-1"
                  style={{ color: "#2DD4BF" }}
                >
                  View all leads <ArrowRight size={12} />
                </Link>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
