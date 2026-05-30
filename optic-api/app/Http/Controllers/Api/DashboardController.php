<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\LeadResource;
use App\Models\Lead;
use App\Services\Dashboard\DashboardService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    use ApiResponseTrait;

    public function __construct(
        private readonly DashboardService $dashboardService,
    ) {}

    public function stats(): JsonResponse
    {
        $stats = $this->dashboardService->getStats();

        return $this->success([
            'total_leads'               => $stats->total_leads,
            'new_leads_today'           => $stats->new_leads_today,
            'high_priority_uncontacted' => $stats->high_priority_uncontacted,
            'qualified_this_week'       => $stats->qualified_this_week,
            'leads_by_source'           => $stats->leads_by_source,
        ]);
    }

    public function recentLeads(): JsonResponse
    {
        $leads = $this->dashboardService->getRecentLeads(10);
        return $this->success(LeadResource::collection($leads));
    }


}
