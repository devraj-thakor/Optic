<?php

namespace App\Models;

use App\Enums\UrgencyLevel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LeadInsight extends Model
{
    use HasFactory;

    protected $fillable = [
        'lead_id',
        'ai_summary',
        'lead_intent',
        'urgency_level',
        'recommended_action',
        'lead_score',
        'confidence_level',
        'ai_model',
        'ai_provider',
        'processing_time_ms',
        'processed_at',
    ];

    protected $casts = [
        'urgency_level'      => UrgencyLevel::class,
        'lead_score'         => 'integer',
        'processing_time_ms' => 'integer',
        'processed_at'       => 'datetime',
    ];

    public function lead(): BelongsTo
    {
        return $this->belongsTo(Lead::class, 'lead_id');
    }
}
