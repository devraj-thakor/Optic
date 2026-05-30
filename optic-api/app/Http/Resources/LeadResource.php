<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LeadResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'name'            => $this->name,
            'email'           => $this->email,
            'phone'           => $this->phone,
            'source'          => $this->source?->value,
            'inquiry_message' => $this->inquiry_message,
            'status'          => $this->status?->value,
            'priority'        => $this->priority?->value,
            'lead_score'      => $this->lead_score,
            'is_demo'         => $this->is_demo,
            'insight'         => $this->whenLoaded('insight', fn() => new LeadInsightResource($this->insight)),
            'status_history'  => $this->whenLoaded('statusHistory', fn() => $this->statusHistory->map(fn($h) => [
                'from_status' => $h->from_status,
                'to_status'   => $h->to_status,
                'changed_at'  => $h->changed_at?->toIso8601String(),
            ])),
            'created_at'      => $this->created_at?->toIso8601String(),
            'updated_at'      => $this->updated_at?->toIso8601String(),
        ];
    }
}
