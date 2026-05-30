<?php

namespace App\DTOs;

readonly class DashboardStatsData
{
    public function __construct(
        public int   $total_leads,
        public int   $new_leads_today,
        public int   $high_priority_uncontacted,
        public int   $qualified_this_week,
        public array $leads_by_source,
        public array $recent_leads,
    ) {}
}
