"use client";

import { AnimatePresence, motion } from "framer-motion";
import { RefreshCw, Brain, Zap, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { URGENCY_LEVELS } from "@/constants";
import type { Lead, LeadInsight } from "@/types";
import { useRegenerateInsights } from "@/hooks/useLeads";
import { LeadScoreCircle } from "@/components/leads/LeadBadges";

interface AIInsightCardProps {
  lead: Lead;
  insight: LeadInsight | null;
  isLoading?: boolean;
}

function ProcessingState() {
  return (
    <div className="ai-processing-border p-6">
      <div className="flex flex-col items-center justify-center gap-3 py-6">
        <div className="relative">
          <Brain size={32} style={{ color: "#4B6EF5" }} className="animate-pulse" />
        </div>
        <div className="text-center">
          <p className="font-medium mb-1" style={{ color: "#FFFFFF", fontFamily: "Inter, sans-serif" }}>
            AI is analyzing this lead...
          </p>
          <p className="text-sm" style={{ color: "#4D5568" }}>
            Usually takes 2–5 seconds
          </p>
        </div>
        <div className="flex gap-1 mt-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ background: "#4B6EF5" }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function InsightField({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | null;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div
      className="p-4 rounded-xl"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} style={{ color }} />
        <span className="text-xs font-medium uppercase tracking-wide" style={{ color: "#4D5568" }}>
          {label}
        </span>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: "#F1F5F9" }}>
        {value || "-"}
      </p>
    </div>
  );
}

export default function AIInsightCard({ lead, insight, isLoading }: AIInsightCardProps) {
  const regenerate = useRegenerateInsights(lead.id);
  const isProcessing = isLoading || !insight;

  const urgencyConfig = insight?.urgency_level
    ? URGENCY_LEVELS[insight.urgency_level]
    : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain size={18} style={{ color: "#4B6EF5" }} />
          <h3 className="font-semibold text-sm" style={{ fontFamily: "Inter, sans-serif", color: "#FFFFFF" }}>
            AI Insight
          </h3>
          {insight?.ai_model && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "rgba(129,140,248,0.1)", color: "#818CF8", fontFamily: "JetBrains Mono, monospace" }}
            >
              {insight.ai_provider}/{insight.ai_model?.split("-").slice(0, 2).join("-")}
            </span>
          )}
        </div>

        <button
          id="regenerate-ai"
          onClick={() => regenerate.mutate()}
          disabled={regenerate.isPending}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={{
            background: "rgba(255,255,255,0.04)",
            color: "#4D5568",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <RefreshCw size={12} className={regenerate.isPending ? "animate-spin" : ""} />
          Regenerate
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isProcessing ? (
          <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ProcessingState />
          </motion.div>
        ) : (
          <motion.div
            key="complete"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl overflow-hidden"
            style={{ border: "1px solid rgba(75,110,245,0.2)" }}
          >
            {/* Header bar */}
            <div
              className="px-5 py-3 flex items-center justify-between"
              style={{ background: "rgba(75,110,245,0.05)" }}
            >
              <div className="flex items-center gap-3">
                {urgencyConfig && (
                  <span
                    className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{ background: urgencyConfig.bg, color: urgencyConfig.color }}
                  >
                    {urgencyConfig.label} Urgency
                  </span>
                )}
                <span
                  className="text-xs px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(255,255,255,0.06)", color: "#94A3B8" }}
                >
                  {insight?.lead_intent}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <LeadScoreCircle score={insight?.lead_score ?? null} />
                {insight?.processing_time_ms && (
                  <div className="flex items-center gap-1 text-xs" style={{ color: "#4D5568" }}>
                    <Clock size={11} />
                    {insight.processing_time_ms}ms
                  </div>
                )}
              </div>
            </div>

            {/* Fields */}
            <div className="p-5 space-y-3">
              <InsightField
                label="AI Summary"
                value={insight?.ai_summary ?? null}
                icon={Brain}
                color="#4B6EF5"
              />
              <InsightField
                label="Recommended Action"
                value={insight?.recommended_action ?? null}
                icon={CheckCircle}
                color="#4B6EF5"
              />

              {insight?.confidence_level && (
                <div className="flex items-center justify-between text-xs" style={{ color: "#4D5568" }}>
                  <span>Confidence: {insight.confidence_level}</span>
                  {insight.processed_at && (
                    <span>Analyzed {new Date(insight.processed_at).toLocaleTimeString()}</span>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
