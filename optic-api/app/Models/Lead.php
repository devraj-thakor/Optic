<?php

namespace App\Models;

use App\Enums\LeadPriority;
use App\Enums\LeadSource;
use App\Enums\LeadStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Lead extends Model
{
    use HasFactory, HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'source',
        'inquiry_message',
        'status',
        'priority',
        'lead_score',
        'is_demo',
    ];

    protected $casts = [
        'source'     => LeadSource::class,
        'status'     => LeadStatus::class,
        'priority'   => LeadPriority::class,
        'lead_score' => 'integer',
        'is_demo'    => 'boolean',
    ];

    public function insight(): HasOne
    {
        return $this->hasOne(LeadInsight::class, 'lead_id');
    }

    public function statusHistory(): HasMany
    {
        return $this->hasMany(LeadStatusHistory::class, 'lead_id')->orderBy('changed_at', 'desc');
    }
}
