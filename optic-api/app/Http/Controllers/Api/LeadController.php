<?php

namespace App\Http\Controllers\Api;

use App\DTOs\LeadData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Lead\FilterLeadRequest;
use App\Http\Requests\Lead\StoreLeadRequest;
use App\Http\Requests\Lead\UpdateLeadRequest;
use App\Http\Resources\LeadResource;
use App\Jobs\ProcessLeadAIJob;
use App\Services\Lead\LeadService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class LeadController extends Controller
{
    use ApiResponseTrait;

    public function __construct(
        private readonly LeadService $leadService,
    ) {}

    public function index(FilterLeadRequest $request): JsonResponse
    {
        $paginator = $this->leadService->getFilteredLeads(
            filters: $request->validated(),
            perPage: (int) ($request->validated('per_page', 20)),
        );

        return $this->success([
            'data'       => LeadResource::collection($paginator->items()),
            'pagination' => [
                'current_page'  => $paginator->currentPage(),
                'last_page'     => $paginator->lastPage(),
                'per_page'      => $paginator->perPage(),
                'total'         => $paginator->total(),
                'from'          => $paginator->firstItem(),
                'to'            => $paginator->lastItem(),
            ],
        ]);
    }

    public function store(StoreLeadRequest $request): JsonResponse
    {
        $lead = $this->leadService->createLead(
            LeadData::fromRequest($request->validated())
        );

        return $this->created(new LeadResource($lead->load('insight')), 'Lead created successfully');
    }

    public function show(string $uuid): JsonResponse
    {
        $lead = $this->leadService->findLead($uuid);

        if (!$lead) {
            return $this->error('Lead not found', 404);
        }

        return $this->success(new LeadResource($lead));
    }

    public function update(UpdateLeadRequest $request, string $uuid): JsonResponse
    {
        $lead = $this->leadService->findLead($uuid);

        if (!$lead) {
            return $this->error('Lead not found', 404);
        }

        $lead = $this->leadService->updateLead($lead, $request->validated());

        return $this->success(new LeadResource($lead->load(['insight', 'statusHistory'])), 'Lead updated');
    }

    public function destroy(string $uuid): JsonResponse
    {
        $lead = $this->leadService->findLead($uuid);

        if (!$lead) {
            return $this->error('Lead not found', 404);
        }

        $this->leadService->deleteLead($lead);

        return $this->success(message: 'Lead deleted');
    }

    public function regenerateInsights(string $uuid): JsonResponse
    {
        $lead = $this->leadService->findLead($uuid);

        if (!$lead) {
            return $this->error('Lead not found', 404);
        }

        ProcessLeadAIJob::dispatch($lead, force: true);

        return $this->success(message: 'AI insight regeneration queued');
    }
}
