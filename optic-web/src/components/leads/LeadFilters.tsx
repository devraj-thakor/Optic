"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import {
  LEAD_SOURCES,
  LEAD_STATUSES,
  LEAD_PRIORITIES,
  LEAD_SOURCE_LIST,
  LEAD_STATUS_LIST,
  LEAD_PRIORITY_LIST,
} from "@/constants";
import type { LeadFilters, LeadSource, LeadStatus, LeadPriority } from "@/types";

interface LeadFiltersProps {
  filters:  LeadFilters;
  onChange: (filters: LeadFilters) => void;
}

const DEBOUNCE_MS = 350;

export default function LeadFilters({ filters, onChange }: LeadFiltersProps) {
  // Local input state — updates instantly on every keystroke for a responsive feel
  const [searchInput, setSearchInput] = useState(filters.search ?? "");

  // Sync local state if parent clears search (e.g. "Clear all" button)
  useEffect(() => {
    setSearchInput(filters.search ?? "");
  }, [filters.search]);

  // Debounced onChange — fires API call only after the user stops typing
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchInput(value);

      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      debounceTimer.current = setTimeout(() => {
        onChange({ ...filters, search: value || undefined, page: 1 });
      }, DEBOUNCE_MS);
    },
    [filters, onChange]
  );

  // Cleanup on unmount
  useEffect(() => () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
  }, []);

  const hasFilters = filters.status || filters.priority || filters.source || filters.search;

  const clearAll = () => {
    setSearchInput("");
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    onChange({ page: 1 });
  };

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Search — debounced 350ms */}
      <div className="relative flex-1 min-w-48">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#475569" }} />
        <input
          id="lead-search"
          type="text"
          placeholder="Search leads… (name, email, message)"
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="input-optic w-full pl-9 pr-4 py-2 text-sm"
        />
        {/* Inline clear button */}
        {searchInput && (
          <button
            onClick={() => handleSearchChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded transition-opacity hover:opacity-100 opacity-60"
          >
            <X size={13} style={{ color: "#94A3B8" }} />
          </button>
        )}
      </div>

      {/* Status filter */}
      <select
        id="filter-status"
        value={filters.status || ""}
        onChange={(e) => onChange({ ...filters, status: (e.target.value as LeadStatus) || undefined, page: 1 })}
        className="input-optic px-3 py-2 text-sm cursor-pointer"
        style={{ minWidth: "120px" }}
      >
        <option value="">All Status</option>
        {LEAD_STATUS_LIST.map((s) => (
          <option key={s} value={s}>{LEAD_STATUSES[s].label}</option>
        ))}
      </select>

      {/* Priority filter */}
      <select
        id="filter-priority"
        value={filters.priority || ""}
        onChange={(e) => onChange({ ...filters, priority: (e.target.value as LeadPriority) || undefined, page: 1 })}
        className="input-optic px-3 py-2 text-sm cursor-pointer"
        style={{ minWidth: "130px" }}
      >
        <option value="">All Priority</option>
        {LEAD_PRIORITY_LIST.map((p) => (
          <option key={p} value={p}>{LEAD_PRIORITIES[p].label}</option>
        ))}
      </select>

      {/* Source filter */}
      <select
        id="filter-source"
        value={filters.source || ""}
        onChange={(e) => onChange({ ...filters, source: (e.target.value as LeadSource) || undefined, page: 1 })}
        className="input-optic px-3 py-2 text-sm cursor-pointer"
        style={{ minWidth: "130px" }}
      >
        <option value="">All Channels</option>
        {LEAD_SOURCE_LIST.map((s) => (
          <option key={s} value={s}>{LEAD_SOURCES[s].label}</option>
        ))}
      </select>

      {/* Clear all */}
      {hasFilters && (
        <button
          id="clear-filters"
          onClick={clearAll}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors"
          style={{ color: "#4D5568" }}
        >
          <X size={14} />
          Clear
        </button>
      )}
    </div>
  );
}
