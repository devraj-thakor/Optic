<?php

namespace App\DTOs;

readonly class AIResponseData
{
    public function __construct(
        public string  $ai_summary,
        public string  $lead_intent,
        public string  $urgency_level,
        public string  $recommended_action,
        public int     $lead_score,
        public string  $confidence_level,
        public string  $ai_model,
        public string  $ai_provider,
        public int     $processing_time_ms,
    ) {}

    public static function fromArray(array $data, string $model, string $provider, int $processingTimeMs): self
    {
        return new self(
            ai_summary:          $data['ai_summary'],
            lead_intent:         $data['lead_intent'],
            urgency_level:       $data['urgency_level'],
            recommended_action:  $data['recommended_action'],
            lead_score:          (int) $data['lead_score'],
            confidence_level:    $data['confidence_level'],
            ai_model:            $model,
            ai_provider:         $provider,
            processing_time_ms:  $processingTimeMs,
        );
    }
}
