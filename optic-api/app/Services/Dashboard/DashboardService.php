<?php

namespace App\Services\Dashboard;

use App\DTOs\DashboardStatsData;
use App\Enums\LeadPriority;
use App\Enums\LeadSource;
use App\Enums\LeadStatus;
use App\Models\Lead;
use App\Support\SafeCache;

class DashboardService
{
    public function getStats(): DashboardStatsData
    {
        return SafeCache::remember('dashboard:stats:global', 300, function () {
            $totalLeads = Lead::count();

            $newLeadsToday = Lead::whereDate('created_at', today())->count();

            $highPriorityUncontacted = Lead::where('priority', LeadPriority::High->value)
                ->where('status', LeadStatus::New->value)
                ->count();

            $qualifiedThisWeek = Lead::where('status', LeadStatus::Qualified->value)
                ->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])
                ->count();

            $leadsBySource = [];
            foreach (LeadSource::cases() as $source) {
                $leadsBySource[$source->value] = Lead::where('source', $source->value)->count();
            }

            $recentLeads = Lead::with('insight')
                ->latest()
                ->limit(10)
                ->get()
                ->toArray();

            return new DashboardStatsData(
                total_leads:               $totalLeads,
                new_leads_today:           $newLeadsToday,
                high_priority_uncontacted: $highPriorityUncontacted,
                qualified_this_week:       $qualifiedThisWeek,
                leads_by_source:           $leadsBySource,
                recent_leads:              $recentLeads,
            );
        });
    }

    public function getRecentLeads(int $limit = 10)
    {
        return SafeCache::remember('dashboard:recent', 60, function () use ($limit) {
            return Lead::with('insight')
                ->latest()
                ->limit($limit)
                ->get(); // Return Eloquent Collection, not array
        });
    }

}
