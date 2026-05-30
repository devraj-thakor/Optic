<?php

namespace App\Providers;

use App\Events\LeadCreated;
use App\Events\LeadUpdated;
use App\Listeners\TriggerLeadAIProcessing;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        LeadCreated::class => [
            TriggerLeadAIProcessing::class . '@handleLeadCreated',
        ],
        LeadUpdated::class => [
            TriggerLeadAIProcessing::class . '@handleLeadUpdated',
        ],
    ];
}
