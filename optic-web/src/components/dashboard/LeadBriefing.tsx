"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowRight, Phone, CheckCircle } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { useLeads } from "@/hooks/useLeads";
import { useUpdateLead } from "@/hooks/useLeads";
import Link from "next/link";
import { LEAD_PRIORITIES, LEAD_SOURCES } from "@/constants";
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
  const priority = LEAD_PRIORITIES[lead.priority];
  const source = LEAD_SOURCES[lead.source];

  const markContacted = () => {
    updateLead.mutate({ status: "contacted" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-xl p-5"
      style={{
        background:  "#161B27",
        border:      "1px solid rgba(255,255,255,0.06)",
        borderLeft:  `3px solid ${priority.border}`,
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-semibold" style={{ color: "#F1F5F9", fontFamily: "Syne, sans-serif" }}>
            {lead.name}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: `${source.color}20`, color: source.color }}
            >
              {source.label}
            </span>
            <span className="text-xs" style={{ color: "#475569" }}>
              {formatRelativeTime(lead.created_at)}
            </span>
          </div>
        </div>
        {lead.lead_score !== null && (
          <div
            className="text-xl font-bold flex-shrink-0"
            style={{ color: "#2DD4BF", fontFamily: "DM Mono, monospace" }}
          >
            {lead.lead_score}
          </div>
        )}
      </div>

      {lead.insight?.recommended_action && (
        <p className="text-sm mb-4 leading-relaxed" style={{ color: "#94A3B8" }}>
          <span className="font-medium" style={{ color: "#2DD4BF" }}>AI: </span>
          {lead.insight.recommended_action}
        </p>
      )}

      <div className="flex items-center gap-2">
        <button
          id={`brief-contact-${lead.id}`}
          onClick={markContacted}
          disabled={updateLead.isPending}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={{
            background: "rgba(45,212,191,0.1)",
            color:      "#2DD4BF",
            border:     "1px solid rgba(45,212,191,0.2)",
          }}
        >
          <CheckCircle size={13} />
          Mark Contacted
        </button>
        <Link
          href={`/leads/${lead.id}`}
          onClick={closeBriefing}
          prefetch={true}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={{
            background: "rgba(255,255,255,0.05)",
            color:      "#F1F5F9",
          }}
        >
          Open Lead
          <ArrowRight size={13} />
        </Link>
      </div>
    </motion.div>
  );
}

export default function LeadBriefing() {
  const { isBriefingOpen, closeBriefing } = useUIStore();

  const { data: leadsData } = useLeads({
    status:   "new",
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
            className="fixed inset-0 z-40"
            style={{ background: "rgba(7,11,20,0.85)", backdropFilter: "blur(8px)" }}
            onClick={closeBriefing}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.97 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed inset-x-4 bottom-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-xl z-50 rounded-2xl overflow-hidden"
            style={{
              background: "#0D1117",
              border:     "1px solid rgba(255,255,255,0.1)",
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
            <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
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
        </>
      )}
    </AnimatePresence>
  );
}
