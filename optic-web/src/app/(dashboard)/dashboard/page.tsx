"use client";

import { Users, TrendingUp, Zap, Star } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import ChannelBreakdown from "@/components/dashboard/ChannelBreakdown";
import RecentLeads from "@/components/dashboard/RecentLeads";
import { useDashboardStats, useRecentLeads } from "@/hooks/useDashboard";
import { LEAD_SOURCES } from "@/constants";
import type { LeadSource } from "@/types";

const defaultStats = {
  total_leads:               0,
  new_leads_today:           0,
  high_priority_uncontacted: 0,
  qualified_this_week:       0,
  leads_by_source:           Object.fromEntries(
    Object.keys(LEAD_SOURCES).map((k) => [k, 0])
  ) as Record<LeadSource, number>,
};

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading }   = useDashboardStats();
  const { data: recent, isLoading: recentLoading } = useRecentLeads();

  const displayStats = stats || defaultStats;

  const statCards = [
    {
      title:    "Total Leads",
      value:    displayStats.total_leads,
      icon:     Users,
      color:    "#4B6EF5",
      subtitle: "All time",
    },
    {
      title:    "New Today",
      value:    displayStats.new_leads_today,
      icon:     Zap,
      color:    "#818CF8",
      subtitle: "Added today",
    },
    {
      title:    "High Priority",
      value:    displayStats.high_priority_uncontacted,
      icon:     Star,
      color:    "#F87171",
      subtitle: "Uncontacted",
    },
    {
      title:    "Qualified",
      value:    displayStats.qualified_this_week,
      icon:     TrendingUp,
      color:    "#22C55E",
      subtitle: "This week",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Overview" subtitle="Your lead intelligence at a glance" />

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <StatCard key={card.title} {...card} index={i} />
        ))}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent leads — takes 2 cols */}
        <div className="lg:col-span-2">
          <RecentLeads leads={recent || []} isLoading={recentLoading} />
        </div>

        {/* Channel breakdown */}
        <div>
          {statsLoading ? (
            <div
              className="rounded-xl p-5 animate-pulse"
              style={{ background: "#0D0F18", border: "1px solid rgba(255,255,255,0.07)", height: "360px" }}
            />
          ) : (
            <ChannelBreakdown data={displayStats.leads_by_source} />
          )}
        </div>
      </div>
    </div>
  );
}
