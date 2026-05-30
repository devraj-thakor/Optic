<?php

namespace App\Services\Demo;

use App\DTOs\LeadData;
use App\Enums\LeadPriority;
use App\Enums\LeadSource;
use App\Models\Lead;
use App\Services\CacheFlushService;
use App\Services\Lead\LeadService;
use Faker\Factory as Faker;

class DemoLeadGeneratorService
{
    private array $inquiryTemplates = [
        "Hi, we're a fintech startup and need an MVP built in 6 weeks. We have investors lined up but need a working demo first. Budget is around \$15k. Can your team help?",
        "We need a mobile app for our food delivery business. Currently tracking orders on WhatsApp which is getting messy. Need something simple but scalable.",
        "Looking for an AI integration in our existing CRM. We want to automatically score leads and draft follow-up emails. Timeline is flexible.",
        "Hi! I'm building a logistics platform for Southeast Asia. Need both web dashboard and mobile app. Our investors want a prototype in 8 weeks.",
        "We want to automate our HR onboarding process. Currently everything is done manually with Google Forms. Need a custom solution.",
        "Looking for a web scraping and data pipeline solution. We're a market research firm and need to pull competitor data daily.",
        "Need a consulting call first. We have a complex business process we're trying to digitize and want to understand the best approach before committing.",
        "Building a SaaS platform for property management. Need tenant portal, payment integration, and maintenance tracking. Budget is \$25k.",
        "We have a React app but the backend is a mess. Need someone to refactor our Node.js API and improve performance significantly.",
        "Interested in your AI services. We want to add a chatbot to our e-commerce site that can handle customer queries and escalate complex issues.",
        "Looking for a partner agency for our clients. We're a design studio and often need development help. Let's connect to discuss partnership terms.",
        "Need an urgent fix. Our production app is down and our current developer is unavailable. PHP/Laravel backend, Postgres DB. Can you help immediately?",
    ];

    public function __construct(
        private readonly LeadService $leadService,
    ) {}

    public function generate(?string $channel = null): Lead
    {
        $faker = Faker::create();

        $source = $channel
            ? LeadSource::from($channel)
            : LeadSource::cases()[array_rand(LeadSource::cases())];

        $inquiry = $this->inquiryTemplates[array_rand($this->inquiryTemplates)];

        $leadData = new LeadData(
            name:            $faker->name(),
            source:          $source,
            inquiry_message: $inquiry,
            email:           $faker->optional(0.7)->safeEmail(),
            phone:           $faker->optional(0.5)->phoneNumber(),
            priority:        LeadPriority::cases()[array_rand(LeadPriority::cases())],
            is_demo:         true,
        );

        $lead = $this->leadService->createLead($leadData);

        // Flush ALL lead-related Redis caches so the next GET /leads
        // returns the real list immediately — no stale pages served.
        CacheFlushService::flushAllLeadCaches();

        return $lead;
    }

    public function clearDemoLeads(): int
    {
        $count = Lead::where('is_demo', true)->delete();

        // Nuke every lead-related cache key — list pages, individual leads,
        // dashboard stats/recent, and AI insight caches.
        CacheFlushService::flushAllLeadCaches();

        return $count;
    }
}
