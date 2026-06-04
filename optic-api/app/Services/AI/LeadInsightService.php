<?php

namespace App\Services\AI;

use App\DTOs\AIResponseData;
use App\Exceptions\AIProcessingException;
use App\Models\Lead;
use App\Models\LeadInsight;
use App\Services\CacheFlushService;
use App\Support\SafeCache;
use Illuminate\Support\Facades\Log;
use Throwable;

class LeadInsightService
{
    public function __construct(
        private readonly AIProviderFactory $factory,
    ) {}

    public function processLead(Lead $lead, bool $force = false): LeadInsight
    {
        $cacheKey = "ai_insight:{$lead->id}:" . md5($lead->inquiry_message);

        if (!$force && SafeCache::has($cacheKey)) {
            return $lead->insight ?? $this->createInsightFromCache($lead, SafeCache::get($cacheKey));
        }

        $startTime = microtime(true);

        // ── Step 1: try primary provider (Gemini) ────────────────────────────
        $primaryKey = config('ai.primary.api_key');
        if ($primaryKey) {
            try {
                $primaryProvider = $this->factory::makePrimary();
                $rawResponse = $primaryProvider->analyze(
                    source: $lead->source->value,
                    message: $lead->inquiry_message,
                );

                Log::debug('AI primary (Gemini) succeeded', [
                    'lead_id' => $lead->id,
                    'model'   => $primaryProvider->getModelName(),
                ]);

                $processingMs = (int) ((microtime(true) - $startTime) * 1000);
                $responseData = AIResponseData::fromArray(
                    data: $rawResponse,
                    model: $primaryProvider->getModelName(),
                    provider: $primaryProvider->getProviderName(),
                    processingTimeMs: $processingMs,
                );

                SafeCache::put($cacheKey, $responseData, now()->addHour());
                return $this->saveInsight($lead, $responseData);
            } catch (Throwable $primaryError) {
                Log::warning('AI primary (Gemini) failed - switching to fallback', [
                    'lead_id' => $lead->id,
                    'error'   => $primaryError->getMessage(),
                ]);
                // Fall through to the fallback below
            }
        } else {
            Log::debug('GEMINI_API_KEY not set - skipping primary, using fallback directly');
        }

        // ── Step 2: fallback provider (env AI_PROVIDER) ───────────────────────
        $fallbackProvider = $this->factory::make();

        Log::debug('AI fallback provider attempting', [
            'lead_id'  => $lead->id,
            'provider' => $fallbackProvider->getProviderName(),
            'model'    => $fallbackProvider->getModelName(),
        ]);

        $rawResponse = $fallbackProvider->analyze(
            source: $lead->source->value,
            message: $lead->inquiry_message,
        );

        $processingMs = (int) ((microtime(true) - $startTime) * 1000);
        $responseData = AIResponseData::fromArray(
            data: $rawResponse,
            model: $fallbackProvider->getModelName(),
            provider: $fallbackProvider->getProviderName(),
            processingTimeMs: $processingMs,
        );

        SafeCache::put($cacheKey, $responseData, now()->addHour());
        return $this->saveInsight($lead, $responseData);
    }

    private function saveInsight(Lead $lead, AIResponseData $data): LeadInsight
    {
        $insight = LeadInsight::updateOrCreate(
            ['lead_id' => $lead->id],
            [
                'ai_summary'         => $data->ai_summary,
                'lead_intent'        => $data->lead_intent,
                'urgency_level'      => $data->urgency_level,
                'recommended_action' => $data->recommended_action,
                'lead_score'         => $data->lead_score,
                'confidence_level'   => $data->confidence_level,
                'ai_model'           => $data->ai_model,
                'ai_provider'        => $data->ai_provider,
                'processing_time_ms' => $data->processing_time_ms,
                'processed_at'       => now(),
            ]
        );

        // Sync score back to lead — use updateQuietly() to skip Eloquent events
        // so this does NOT fire LeadUpdated and trigger another AI job (infinite loop).
        $lead->updateQuietly(['lead_score' => $data->lead_score]);

        // Flush all lead caches so the updated score appears immediately
        CacheFlushService::flushAllLeadCaches();

        return $insight;
    }

    private function createInsightFromCache(Lead $lead, AIResponseData $data): LeadInsight
    {
        return $this->saveInsight($lead, $data);
    }
}
