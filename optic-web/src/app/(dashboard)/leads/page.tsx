"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useLeads, useDeleteLead } from "@/hooks/useLeads";
import LeadFilters from "@/components/leads/LeadFilters";
import { SourceBadge, StatusBadge, PriorityBadge, LeadScoreCircle } from "@/components/leads/LeadBadges";
import PageHeader from "@/components/layout/PageHeader";
import { LEAD_PRIORITIES } from "@/constants";
import { formatRelativeTime } from "@/lib/utils";
import type { LeadFilters as FiltersType } from "@/types";

function LeadRowSkeleton() {
  return (
    <div
      className="flex items-center gap-4 px-5 py-4 animate-pulse"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div className="w-10 h-10 rounded-full flex-shrink-0" style={{ background: "rgba(255,255,255,0.05)" }} />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-36 rounded" style={{ background: "rgba(255,255,255,0.05)" }} />
        <div className="h-2.5 w-64 rounded" style={{ background: "rgba(255,255,255,0.03)" }} />
      </div>
      <div className="flex gap-2">
        <div className="h-5 w-16 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }} />
        <div className="h-5 w-20 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }} />
      </div>
    </div>
  );
}

export default function LeadsPage() {
  const [filters, setFilters] = useState<FiltersType>({ page: 1, per_page: 20 });
  const { data, isLoading }   = useLeads(filters);
  const deleteLead            = useDeleteLead();

  const handleFilterChange = useCallback((newFilters: FiltersType) => {
    setFilters(newFilters);
  }, []);

  const leads      = data?.data || [];
  const pagination = data?.pagination;

  const newLeadAction = (
    <Link
      href="/leads/new"
      prefetch={true}
      id="new-lead-btn"
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
      style={{
        background: "#4B6EF5",
        color: "#FFFFFF",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#5B7BFF")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "#4B6EF5")}
    >
      <Plus size={15} />
      New Lead
    </Link>
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Leads"
        subtitle={pagination ? `${pagination.total} total leads` : undefined}
        actions={newLeadAction}
      />

      {/* Filters */}
      <LeadFilters filters={filters} onChange={handleFilterChange} />

      {/* Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "#0A0B10", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        {isLoading && leads.length === 0 ? (
          Array.from({ length: 6 }).map((_, i) => <LeadRowSkeleton key={i} />)
        ) : leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
              style={{ background: "rgba(75,110,245,0.08)", border: "1px solid rgba(75,110,245,0.15)" }}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="9" cy="9" r="7" stroke="#4B6EF5" strokeWidth="1.5"/>
                <path d="M14.5 14.5L20 20" stroke="#4B6EF5" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="font-medium mb-1.5" style={{ color: "#FFFFFF" }}>No leads found</p>
            <p className="text-sm" style={{ color: "#94A3B8" }}>
              {filters.search ? `No results for "${filters.search}"` : "Try adjusting your filters"}
            </p>
          </div>
        ) : (
          leads.map((lead, i) => {
            const priority = LEAD_PRIORITIES[lead.priority];
            return (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.025 }}
                className="flex items-center gap-4 px-5 py-4 group transition-colors"
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <LeadScoreCircle score={lead.lead_score} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Link
                      href={`/leads/${lead.id}`}
                      prefetch={true}
                      className="font-medium text-sm transition-colors"
                      style={{ color: "#FFFFFF" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#7B97FF")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#FFFFFF")}
                    >
                      {lead.name}
                    </Link>
                    {lead.is_demo && (
                      <span
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{ background: "rgba(245,158,11,0.1)", color: "#F59E0B" }}
                      >
                        demo
                      </span>
                    )}
                  </div>
                  <p className="text-xs truncate max-w-md" style={{ color: "#94A3B8" }}>
                    {lead.inquiry_message}
                  </p>
                </div>

                <div className="hidden md:flex items-center gap-2.5">
                  <SourceBadge source={lead.source} />
                  <StatusBadge status={lead.status} />
                  <PriorityBadge priority={lead.priority} />
                </div>

                <div className="text-xs flex-shrink-0" style={{ color: "#94A3B8" }}>
                  {formatRelativeTime(lead.created_at)}
                </div>

                <div className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <Link
                    href={`/leads/${lead.id}`}
                    prefetch={true}
                    className="px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                    style={{ background: "rgba(75,110,245,0.1)", color: "#7B97FF" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(75,110,245,0.18)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(75,110,245,0.1)")}
                  >
                    View
                  </Link>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.last_page > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: "#94A3B8" }}>
            Showing {pagination.from}–{pagination.to} of {pagination.total}
          </p>
          <div className="flex items-center gap-2">
            <button
              id="prev-page"
              onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) - 1 }))}
              disabled={(filters.page || 1) <= 1}
              className="p-2 rounded-lg transition-colors disabled:opacity-30"
              style={{ background: "rgba(255,255,255,0.04)", color: "#9198A8" }}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm tabular-nums" style={{ color: "#FFFFFF" }}>
              {pagination.current_page} / {pagination.last_page}
            </span>
            <button
              id="next-page"
              onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) + 1 }))}
              disabled={(filters.page || 1) >= pagination.last_page}
              className="p-2 rounded-lg transition-colors disabled:opacity-30"
              style={{ background: "rgba(255,255,255,0.04)", color: "#9198A8" }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
