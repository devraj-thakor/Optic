"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, RefreshCw, Clock } from "lucide-react";
import { useSimulatorFeed, useGenerateLead, useClearDemoLeads } from "@/hooks/useSimulator";
import { SourceBadge, StatusBadge, LeadScoreCircle } from "@/components/leads/LeadBadges";
import PageHeader from "@/components/layout/PageHeader";
import { formatRelativeTime } from "@/lib/utils";
import { ChannelIcon } from "@/components/ui/ChannelIcon";
import type { LeadSource } from "@/types";

const CHANNEL_BUTTONS: { source: LeadSource; label: string; color: string }[] = [
  { source: "website", label: "Website", color: "#4B6EF5" },
  { source: "whatsapp", label: "WhatsApp", color: "#25D366" },
  { source: "instagram", label: "Instagram", color: "#E1306C" },
  { source: "facebook", label: "Facebook", color: "#1877F2" },
  { source: "linkedin", label: "LinkedIn", color: "#0A66C2" },
  { source: "referral", label: "Referral", color: "#F59E0B" },
];

export default function SimulatorPage() {
  const { leads, isLoading, refetch } = useSimulatorFeed();

  const generateLead = useGenerateLead(refetch, {
    onSuccess: (lead) => {
      setNewLeadId(lead.id);
      if (newLeadTimer.current) clearTimeout(newLeadTimer.current);
      newLeadTimer.current = setTimeout(() => setNewLeadId(null), 3000);
    },
  });
  const clearLeads = useClearDemoLeads(refetch);

  const [newLeadId, setNewLeadId] = useState<string | null>(null);
  const newLeadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleGenerate = useCallback((channel?: LeadSource) => {
    generateLead.mutate(channel);
  }, [generateLead]);

  const leadsArray = leads ?? [];
  const leadsCount = leadsArray.length;
  const demoLeads = leadsArray.filter((l) => l.is_demo);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Simulator"
        subtitle="Generate demo leads and watch the AI pipeline process them in real-time"
        actions={
          <div
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
            style={{ background: "rgba(75,110,245,0.1)", color: "#7B97FF", border: "1px solid rgba(75,110,245,0.2)" }}
          >
            <RefreshCw size={11} className="animate-spin" />
            Live · 3s
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left: Controls ─────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Generate card */}
          <div
            className="rounded-xl p-5"
            style={{ background: "#0A0B10", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <h3
              className="font-semibold mb-4 text-sm tracking-wide uppercase"
              style={{ color: "#8B95A5", letterSpacing: "0.08em" }}
            >
              Generate Lead
            </h3>

            {/* Random generate button */}
            <button
              id="generate-random"
              onClick={() => handleGenerate()}
              disabled={generateLead.isPending}
              className="w-full py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 mb-4"
              style={{
                background: generateLead.isPending ? "rgba(75,110,245,0.4)" : "#4B6EF5",
                color: "#FFFFFF",
              }}
              onMouseEnter={(e) => !generateLead.isPending && (e.currentTarget.style.background = "#5B7BFF")}
              onMouseLeave={(e) => !generateLead.isPending && (e.currentTarget.style.background = "#4B6EF5")}
            >
              {generateLead.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  {/* Crosshair icon */}
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <circle cx="7.5" cy="7.5" r="6" stroke="white" strokeWidth="1.3" />
                    <circle cx="7.5" cy="7.5" r="2.5" stroke="white" strokeWidth="1.3" />
                    <line x1="7.5" y1="1" x2="7.5" y2="3.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
                    <line x1="7.5" y1="11.5" x2="7.5" y2="14" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
                    <line x1="1" y1="7.5" x2="3.5" y2="7.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
                    <line x1="11.5" y1="7.5" x2="14" y2="7.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                  Random Channel
                </>
              )}
            </button>

            <p className="text-xs mb-3" style={{ color: "#94A3B8" }}>Or choose a specific channel:</p>

            <div className="grid grid-cols-2 gap-2">
              {CHANNEL_BUTTONS.map(({ source, label, color }) => (
                <button
                  key={source}
                  id={`generate-${source}`}
                  onClick={() => handleGenerate(source)}
                  disabled={generateLead.isPending}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: `${color}12`,
                    color,
                    border: `1px solid ${color}22`,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = `${color}20`)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = `${color}12`)}
                >
                  <ChannelIcon channel={source} size={14} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Clear button */}
          <button
            id="clear-demo-leads"
            onClick={() => clearLeads.mutate()}
            disabled={clearLeads.isPending || demoLeads.length === 0}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-all"
            style={{
              background: "rgba(248,113,113,0.07)",
              color: demoLeads.length === 0 ? "#94A3B8" : "#F87171",
              border: "1px solid rgba(248,113,113,0.12)",
            }}
          >
            <Trash2 size={14} />
            Clear {demoLeads.length} Demo Lead{demoLeads.length !== 1 ? "s" : ""}
          </button>

          {/* Info card */}
          <div
            className="rounded-xl p-4"
            style={{ background: "rgba(75,110,245,0.05)", border: "1px solid rgba(75,110,245,0.1)" }}
          >
            <p className="text-xs leading-relaxed" style={{ color: "#7B97FF" }}>
              <strong>How it works:</strong> A lead is created and an AI job is dispatched to the queue.
              The pulsing <span style={{ color: "#4B6EF5" }}>AI</span> badge means the score is being
              calculated - it updates on the next poll.
            </p>
          </div>
        </div>

        {/* ── Right: Live feed ────────────────────────────────────── */}
        <div className="lg:col-span-2">
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: "#0A0B10", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            {/* Feed header */}
            <div
              className="px-5 py-4 flex items-center justify-between"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center gap-2.5">
                <h3 className="font-semibold text-sm" style={{ color: "#FFFFFF" }}>
                  Live Feed
                </h3>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(75,110,245,0.1)", color: "#7B97FF" }}
                >
                  {leadsCount}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs" style={{ color: "#94A3B8" }}>
                <Clock size={12} />
                Auto-refreshing
              </div>
            </div>

            {/* Feed body */}
            <div>
              {isLoading && leadsCount === 0 ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 px-5 py-4 animate-pulse"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  >
                    <div className="w-10 h-10 rounded-full flex-shrink-0" style={{ background: "rgba(255,255,255,0.05)" }} />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-32 rounded" style={{ background: "rgba(255,255,255,0.05)" }} />
                      <div className="h-2.5 w-52 rounded" style={{ background: "rgba(255,255,255,0.03)" }} />
                    </div>
                  </div>
                ))
              ) : leadsCount === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                    style={{ background: "rgba(75,110,245,0.08)", border: "1px solid rgba(75,110,245,0.15)" }}
                  >
                    {/* Crosshair icon */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="9" stroke="#4B6EF5" strokeWidth="1.5" />
                      <circle cx="12" cy="12" r="4" stroke="#4B6EF5" strokeWidth="1.5" />
                      <circle cx="12" cy="12" r="1.5" fill="#4B6EF5" />
                      <line x1="12" y1="2" x2="12" y2="5" stroke="#4B6EF5" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="12" y1="19" x2="12" y2="22" stroke="#4B6EF5" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="2" y1="12" x2="5" y2="12" stroke="#4B6EF5" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="19" y1="12" x2="22" y2="12" stroke="#4B6EF5" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <p className="font-medium mb-1" style={{ color: "#FFFFFF" }}>No leads yet</p>
                  <p className="text-sm" style={{ color: "#94A3B8" }}>
                    Click a channel button to generate your first lead!
                  </p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {leadsArray.map((lead) => (
                    <motion.div
                      key={lead.id}
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="flex items-center gap-4 px-5 py-4 transition-colors"
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                        boxShadow: lead.id === newLeadId
                          ? "inset 3px 0 0 #4B6EF5"
                          : "none",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <LeadScoreCircle score={lead.lead_score} />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Link
                            href={`/leads/${lead.id}`}
                            prefetch={false}
                            className="font-medium text-sm transition-colors"
                            style={{ color: "#FFFFFF" }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "#7B97FF")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "#FFFFFF")}
                          >
                            {lead.name}
                          </Link>
                          <SourceBadge source={lead.source} />
                          {lead.is_demo && (
                            <span
                              className="text-xs px-1.5 py-0.5 rounded"
                              style={{ background: "rgba(245,158,11,0.1)", color: "#F59E0B" }}
                            >
                              demo
                            </span>
                          )}
                        </div>
                        <p className="text-xs truncate max-w-sm" style={{ color: "#94A3B8" }}>
                          {lead.insight?.ai_summary || lead.inquiry_message}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <StatusBadge status={lead.status} />
                        <span className="text-xs" style={{ color: "#94A3B8" }}>
                          {formatRelativeTime(lead.created_at)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
