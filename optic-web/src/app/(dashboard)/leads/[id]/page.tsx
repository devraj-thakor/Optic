"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Trash2, Save, X } from "lucide-react";
import { use } from "react";
import { useLead, useUpdateLead, useDeleteLead } from "@/hooks/useLeads";
import AIInsightCard from "@/components/insights/AIInsightCard";
import {
  SourceBadge,
  StatusBadge,
  PriorityBadge,
  LeadScoreCircle,
  StyledSelect,
} from "@/components/leads/LeadBadges";
import { LEAD_STATUS_LIST, LEAD_PRIORITY_LIST, LEAD_STATUSES, LEAD_PRIORITIES } from "@/constants";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import type { LeadStatus, LeadPriority } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function LeadDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data: lead, isLoading, refetch } = useLead(id);
  const updateLead = useUpdateLead(id);
  const deleteLead = useDeleteLead();
  const [isEditing, setIsEditing] = useState(false);
  const [editStatus, setEditStatus] = useState<LeadStatus | "">("");
  const [editPriority, setEditPriority] = useState<LeadPriority | "">("");

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto animate-pulse space-y-6">
        <div className="h-5 w-28 rounded" style={{ background: "rgba(255,255,255,0.05)" }} />
        <div className="rounded-2xl" style={{ background: "#0A0B10", border: "1px solid rgba(255,255,255,0.07)", height: "180px" }} />
        <div className="rounded-2xl" style={{ background: "#0A0B10", border: "1px solid rgba(255,255,255,0.07)", height: "300px" }} />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
          style={{ background: "rgba(75,110,245,0.08)", border: "1px solid rgba(75,110,245,0.15)" }}
        >
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <circle cx="11" cy="11" r="8" stroke="#4B6EF5" strokeWidth="1.5" />
            <path d="M17.5 17.5L23 23" stroke="#4B6EF5" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2" style={{ color: "#FFFFFF" }}>
          Lead not found
        </h2>
        <Link href="/leads" className="text-sm" style={{ color: "#7B97FF" }}>
          Back to leads →
        </Link>
      </div>
    );
  }

  const handleSaveStatus = async () => {
    if (editStatus) await updateLead.mutateAsync({ status: editStatus });
    if (editPriority) await updateLead.mutateAsync({ priority: editPriority });
    setIsEditing(false);
    refetch();
  };

  const handleDelete = async () => {
    if (window.confirm(`Delete lead "${lead.name}"? This cannot be undone.`)) {
      await deleteLead.mutateAsync(lead.id);
      router.push("/leads");
    }
  };

  const priorityBorderColor = LEAD_PRIORITIES[lead.priority]?.border ?? "#4D5568";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back link */}
      <Link
        href="/leads"
        prefetch={true}
        className="inline-flex items-center gap-1.5 text-sm transition-colors"
        style={{ color: "#94A3B8" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#9198A8")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#94A3B8")}
      >
        <ArrowLeft size={14} />
        Back to leads
      </Link>

      {/* ── Lead Header Card ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6"
        style={{
          background: "#0A0B10",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Top row: score + name + actions */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-4">
            <LeadScoreCircle score={lead.lead_score} />
            <div>
              <h1
                className="text-2xl font-semibold mb-2"
                style={{ color: "#FFFFFF", fontFamily: "Inter, sans-serif", letterSpacing: "-0.02em" }}
              >
                {lead.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                <SourceBadge source={lead.source} />

                {isEditing ? (
                  <>
                    <StyledSelect
                      value={editStatus || lead.status}
                      onChange={(e) => setEditStatus(e.target.value as LeadStatus)}
                    >
                      {LEAD_STATUS_LIST.map((s) => (
                        <option key={s} value={s}>{LEAD_STATUSES[s].label}</option>
                      ))}
                    </StyledSelect>
                    <StyledSelect
                      value={editPriority || lead.priority}
                      onChange={(e) => setEditPriority(e.target.value as LeadPriority)}
                    >
                      {LEAD_PRIORITY_LIST.map((p) => (
                        <option key={p} value={p}>{LEAD_PRIORITIES[p].label}</option>
                      ))}
                    </StyledSelect>
                  </>
                ) : (
                  <>
                    <StatusBadge status={lead.status} />
                    <PriorityBadge priority={lead.priority} />
                  </>
                )}

                {lead.is_demo && (
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{ background: "rgba(245,158,11,0.1)", color: "#F59E0B" }}
                  >
                    demo
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  id="save-lead"
                  onClick={handleSaveStatus}
                  disabled={updateLead.isPending}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                  style={{ background: "#4B6EF5", color: "#FFFFFF" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#5B7BFF")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#4B6EF5")}
                >
                  <Save size={13} />
                  Save
                </button>
                <button
                  id="cancel-edit"
                  onClick={() => setIsEditing(false)}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ color: "#94A3B8" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#9198A8")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#94A3B8")}
                >
                  <X size={15} />
                </button>
              </>
            ) : (
              <>
                <button
                  id="edit-lead"
                  onClick={() => {
                    setEditStatus(lead.status);
                    setEditPriority(lead.priority);
                    setIsEditing(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    color: "#9198A8",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#9198A8")}
                >
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M9 2L11 4L4 11H2V9L9 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                  </svg>
                  Edit
                </button>
                <button
                  id="delete-lead"
                  onClick={handleDelete}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ color: "#94A3B8" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#F87171")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#94A3B8")}
                >
                  <Trash2 size={15} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Contact info row */}
        <div
          className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-5 pt-5"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          {lead.email && (
            <div>
              <p className="text-xs mb-1 uppercase tracking-wide" style={{ color: "#94A3B8", letterSpacing: "0.07em" }}>Email</p>
              <a
                href={`mailto:${lead.email}`}
                className="text-sm transition-colors"
                style={{ color: "#7B97FF" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#4B6EF5")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#7B97FF")}
              >
                {lead.email}
              </a>
            </div>
          )}
          {lead.phone && (
            <div>
              <p className="text-xs mb-1 uppercase tracking-wide" style={{ color: "#94A3B8", letterSpacing: "0.07em" }}>Phone</p>
              <a href={`tel:${lead.phone}`} className="text-sm" style={{ color: "#FFFFFF" }}>
                {lead.phone}
              </a>
            </div>
          )}
          <div>
            <p className="text-xs mb-1 uppercase tracking-wide" style={{ color: "#94A3B8", letterSpacing: "0.07em" }}>Created</p>
            <p className="text-sm" style={{ color: "#9198A8" }}>{formatDate(lead.created_at)}</p>
          </div>
        </div>
      </motion.div>

      {/* ── Lower content grid ───────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Inquiry + Timeline */}
        <div className="lg:col-span-1 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl p-5"
            style={{ background: "#0A0B10", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <h3 className="text-xs font-semibold mb-3 uppercase tracking-wide" style={{ color: "#94A3B8", letterSpacing: "0.08em" }}>
              Inquiry Message
            </h3>
            <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "#9198A8" }}>
              {lead.inquiry_message}
            </p>
          </motion.div>

          {lead.status_history && lead.status_history.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-xl p-5"
              style={{ background: "#0A0B10", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <h3 className="text-xs font-semibold mb-3 uppercase tracking-wide" style={{ color: "#94A3B8", letterSpacing: "0.08em" }}>
                Status History
              </h3>
              <div className="space-y-2.5">
                {lead.status_history.map((entry, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#4B6EF5" }} />
                    <span style={{ color: "#9198A8" }}>
                      {entry.from_status ? `${entry.from_status} → ` : ""}{entry.to_status}
                    </span>
                    <span className="ml-auto" style={{ color: "#94A3B8" }}>
                      {formatRelativeTime(entry.changed_at)}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Right: AI Insight */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 rounded-xl p-5"
          style={{ background: "#0A0B10", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <AIInsightCard lead={lead} insight={lead.insight} />
        </motion.div>
      </div>
    </div>
  );
}
