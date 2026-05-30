<?php

namespace App\Http\Controllers\Api;

use App\Enums\LeadSource;
use App\Http\Controllers\Controller;
use App\Http\Resources\LeadResource;
use App\Services\Demo\DemoLeadGeneratorService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DemoController extends Controller
{
    use ApiResponseTrait;

    public function __construct(
        private readonly DemoLeadGeneratorService $generatorService,
    ) {}

    public function generateLead(Request $request): JsonResponse
    {
        $channel = $request->input('channel');

        // Validate channel if provided
        if ($channel && !in_array($channel, LeadSource::values())) {
            return $this->error('Invalid channel. Valid channels: ' . implode(', ', LeadSource::values()));
        }

        $lead = $this->generatorService->generate($channel);

        return $this->created(new LeadResource($lead->load('insight')), 'Demo lead generated');
    }

    public function clearLeads(): JsonResponse
    {
        $count = $this->generatorService->clearDemoLeads();

        return $this->success(['deleted_count' => $count], "Cleared {$count} demo leads");
    }
}
