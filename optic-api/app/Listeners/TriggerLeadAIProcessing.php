<?php

namespace App\Listeners;

use App\Events\LeadCreated;
use App\Events\LeadUpdated;
use App\Jobs\ProcessLeadAIJob;

/**
 * Synchronous listener — listens to Lead events and dispatches
 * ProcessLeadAIJob to the 'ai-processing' queue.
 *
 * IMPORTANT: Do NOT implement ShouldQueue here.
 * If this listener were queued, Laravel would put the listener itself
 * on the 'default' queue (not 'ai-processing'), and the queue:work
 * watching ai-processing would never pick it up.
 * The async behaviour lives inside ProcessLeadAIJob, which calls
 * $this->onQueue('ai-processing') in its constructor.
 */
class TriggerLeadAIProcessing
{
    public function handleLeadCreated(LeadCreated $event): void
    {
        ProcessLeadAIJob::dispatch($event->lead);
    }

    public function handleLeadUpdated(LeadUpdated $event): void
    {
        // Only re-run AI analysis when the inquiry_message actually changed.
        // Score writes from AI (via updateQuietly) won't reach here, but
        // this guard is an extra safety net against any other field updates.
        if ($event->lead->wasChanged('inquiry_message')) {
            ProcessLeadAIJob::dispatch($event->lead);
        }
    }
}
