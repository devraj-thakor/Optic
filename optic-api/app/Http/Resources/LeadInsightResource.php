<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LeadInsightResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                 => $this->id,
            'lead_id'            => $this->lead_id,
            'ai_summary'         => $this->ai_summary,
            'lead_intent'        => $this->lead_intent,
            'urgency_level'      => $this->urgency_level?->value ?? $this->urgency_level,
            'recommended_action' => $this->recommended_action,
            'lead_score'         => $this->lead_score,
            'confidence_level'   => $this->confidence_level,
            'ai_model'           => $this->ai_model,
            'ai_provider'        => $this->ai_provider,
            'processing_time_ms' => $this->processing_time_ms,
            'processed_at'       => $this->processed_at?->toIso8601String(),
        ];
    }
}
