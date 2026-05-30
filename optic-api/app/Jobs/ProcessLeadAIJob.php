<?php

namespace App\Jobs;

use App\Models\Lead;
use App\Services\AI\LeadInsightService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Throwable;

class ProcessLeadAIJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int   $tries   = 5;              // 5 attempts — Gemini free tier has bursts of 429s
    public array $backoff  = [10, 30, 60, 120];  // Wait progressively longer between retries
    public int   $timeout  = 120;            // 2 min — Gemini + response_format can be slow


    public function __construct(
        public readonly Lead $lead,
        public readonly bool $force = false,
    ) {
        // Set the queue name via the Queueable trait's onQueue() method
        // Cannot use `public string $queue` — it conflicts with Queueable trait
        $this->onQueue('ai-processing');
    }

    public function handle(LeadInsightService $insightService): void
    {
        $insightService->processLead($this->lead, $this->force);
    }

    public function failed(Throwable $e): void
    {
        Log::error('AI processing job failed', [
            'lead_id'  => $this->lead->id,
            'provider' => config('ai.provider'),
            'error'    => $e->getMessage(),
        ]);
    }
}
