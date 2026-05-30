<?php

namespace App\Services\Lead;

use App\Models\Lead;
use App\DTOs\LeadData;
use App\Events\LeadCreated;
use App\Events\LeadUpdated;
use App\Models\LeadStatusHistory;
use App\Services\CacheFlushService;
use App\Repositories\LeadRepository;

class LeadService
{
    public function __construct(
        private readonly LeadRepository $repository,
    ) {}

    public function createLead(LeadData $data): Lead
    {
        $lead = Lead::create($data->toArray());

        // Record initial status
        LeadStatusHistory::create([
            'lead_id'     => $lead->id,
            'from_status' => null,
            'to_status'   => $lead->status->value,
            'changed_at'  => now(),
        ]);

        // Fire event → triggers AI job
        event(new LeadCreated($lead));

        // Flush all lead-related Redis caches (list pages, dashboard, etc.)
        CacheFlushService::flushAllLeadCaches();

        return $lead;
    }

    public function updateLead(Lead $lead, array $data): Lead
    {
        $oldStatus = $lead->status?->value;

        $lead->update($data);
        $lead->refresh();

        // Track status changes
        $newStatus = $lead->status?->value;
        if ($oldStatus !== $newStatus) {
            LeadStatusHistory::create([
                'lead_id'     => $lead->id,
                'from_status' => $oldStatus,
                'to_status'   => $newStatus,
                'changed_at'  => now(),
            ]);
        }

        // Fire event → triggers AI job if inquiry changed
        event(new LeadUpdated($lead));

        // Flush all caches (individual lead + all list pages that could include it)
        CacheFlushService::flushAllLeadCaches();

        return $lead;
    }

    public function deleteLead(Lead $lead): void
    {
        $lead->delete();
        CacheFlushService::flushAllLeadCaches();
    }

    public function getFilteredLeads(array $filters, int $perPage = 20)
    {
        return $this->repository->getFiltered($filters, $perPage);
    }

    public function findLead(string $uuid): ?Lead
    {
        return $this->repository->findByUuid($uuid);
    }
}
