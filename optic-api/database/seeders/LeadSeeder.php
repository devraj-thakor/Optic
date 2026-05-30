<?php

namespace Database\Seeders;

use App\Enums\LeadPriority;
use App\Enums\LeadSource;
use App\Enums\LeadStatus;
use App\Enums\UrgencyLevel;
use App\Models\Lead;
use App\Models\LeadInsight;
use App\Models\LeadStatusHistory;
use Illuminate\Database\Seeder;

class LeadSeeder extends Seeder
{
    private array $leads = [
        [
            'name'            => 'Sarah Chen',
            'email'           => 'sarah@techventure.io',
            'phone'           => '+66 81 234 5678',
            'source'          => 'linkedin',
            'priority'        => 'high',
            'status'          => 'new',
            'inquiry_message' => 'Hi, we are building a fintech platform for Southeast Asia. We need an MVP in 6 weeks for our Series A pitch. Budget is $20k. We need mobile apps (iOS/Android) plus an admin dashboard. Our investors are extremely time-sensitive.',
            'insight' => [
                'ai_summary'         => 'Fintech startup seeking rapid MVP development for Series A fundraising. Requires cross-platform mobile apps and admin dashboard within a tight 6-week deadline.',
                'lead_intent'        => 'MVP Development',
                'urgency_level'      => 'critical',
                'recommended_action' => 'Schedule a discovery call within 24 hours — Series A timeline creates genuine urgency and $20k budget is solid for MVP scope.',
                'lead_score'         => 92,
                'confidence_level'   => 'high',
                'ai_model'           => 'llama-3.3-70b-versatile',
                'ai_provider'        => 'groq',
                'processing_time_ms' => 1243,
            ],
        ],
        [
            'name'            => 'Marcus Williams',
            'email'           => 'marcus@logisticspro.co',
            'phone'           => null,
            'source'          => 'website',
            'priority'        => 'high',
            'status'          => 'contacted',
            'inquiry_message' => 'We run a last-mile logistics company. Currently tracking 200+ daily deliveries via WhatsApp groups — it is chaos. Need a proper tracking app with driver interface, customer notifications, and ops dashboard.',
            'insight' => [
                'ai_summary'         => 'Logistics company with 200+ daily deliveries seeking to replace WhatsApp-based tracking with a structured delivery management system.',
                'lead_intent'        => 'Mobile App',
                'urgency_level'      => 'high',
                'recommended_action' => 'Send a scoping questionnaire focusing on driver count, integration needs, and launch timeline.',
                'lead_score'         => 85,
                'confidence_level'   => 'high',
                'ai_model'           => 'llama-3.3-70b-versatile',
                'ai_provider'        => 'groq',
                'processing_time_ms' => 987,
            ],
        ],
        [
            'name'            => 'Priya Nair',
            'email'           => 'priya@aiops.in',
            'phone'           => '+91 98765 43210',
            'source'          => 'instagram',
            'priority'        => 'medium',
            'status'          => 'qualified',
            'inquiry_message' => 'Looking to integrate AI into our HR platform. We want automated candidate screening, interview scheduling, and onboarding workflows. We have an existing React frontend and Node.js backend.',
            'insight' => [
                'ai_summary'         => 'HR tech company seeking AI integration for their existing platform — specifically for candidate screening, scheduling automation, and onboarding workflows.',
                'lead_intent'        => 'AI Integration',
                'urgency_level'      => 'medium',
                'recommended_action' => 'Request access to their existing API documentation and schedule a technical discovery call.',
                'lead_score'         => 78,
                'confidence_level'   => 'high',
                'ai_model'           => 'llama-3.3-70b-versatile',
                'ai_provider'        => 'groq',
                'processing_time_ms' => 1102,
            ],
        ],
        [
            'name'            => 'James Okonkwo',
            'email'           => 'james@proptech.ng',
            'phone'           => '+234 801 234 5678',
            'source'          => 'whatsapp',
            'priority'        => 'high',
            'status'          => 'new',
            'inquiry_message' => 'Need a property management SaaS. Tenants, payments (Stripe), maintenance requests, and automated reminders. Currently using Excel sheets. We have 500 units to manage. Budget is flexible if quality is right.',
            'insight' => [
                'ai_summary'         => 'Property management company with 500 units seeking to digitize operations from Excel. Requires tenant portal, payment processing, and maintenance tracking.',
                'lead_intent'        => 'Web App',
                'urgency_level'      => 'high',
                'recommended_action' => 'Prepare a detailed SaaS scoping document and pricing estimate — 500 units indicates serious operational scale.',
                'lead_score'         => 88,
                'confidence_level'   => 'high',
                'ai_model'           => 'llama-3.3-70b-versatile',
                'ai_provider'        => 'groq',
                'processing_time_ms' => 1456,
            ],
        ],
        [
            'name'            => 'Anna Kowalski',
            'email'           => 'anna@designstudio.pl',
            'phone'           => null,
            'source'          => 'referral',
            'priority'        => 'medium',
            'status'          => 'contacted',
            'inquiry_message' => 'We are a design studio in Warsaw. We often need development partners for our clients. Interested in a long-term partnership where we refer dev work to you.',
            'insight' => [
                'ai_summary'         => 'Design studio seeking a development partner for client referrals. Represents potential recurring partnership with multiple downstream projects.',
                'lead_intent'        => 'Partnership',
                'urgency_level'      => 'low',
                'recommended_action' => 'Schedule an introductory call to understand their client profile and establish a referral agreement framework.',
                'lead_score'         => 62,
                'confidence_level'   => 'medium',
                'ai_model'           => 'llama-3.3-70b-versatile',
                'ai_provider'        => 'groq',
                'processing_time_ms' => 876,
            ],
        ],
        [
            'name'            => 'David Tanaka',
            'email'           => 'dtanaka@ecommerce.jp',
            'phone'           => '+81 90 1234 5678',
            'source'          => 'facebook',
            'priority'        => 'medium',
            'status'          => 'new',
            'inquiry_message' => 'Want to add an AI chatbot to our Shopify store. Should handle FAQs, order status, returns, and escalate complex issues. We get 500+ support tickets daily.',
            'insight' => [
                'ai_summary'         => 'E-commerce business processing 500+ daily support tickets seeking AI chatbot for Shopify integration to automate FAQ, order status, and returns handling.',
                'lead_intent'        => 'AI Integration',
                'urgency_level'      => 'medium',
                'recommended_action' => 'Send a chatbot capability overview and request Shopify store access for technical assessment.',
                'lead_score'         => 71,
                'confidence_level'   => 'high',
                'ai_model'           => 'llama-3.3-70b-versatile',
                'ai_provider'        => 'groq',
                'processing_time_ms' => 1034,
            ],
        ],
        [
            'name'            => 'Emma Thompson',
            'email'           => 'emma@healthtech.uk',
            'phone'           => '+44 7700 900123',
            'source'          => 'linkedin',
            'priority'        => 'low',
            'status'          => 'new',
            'inquiry_message' => 'Just exploring options. We might need an app built next year. Nothing urgent yet.',
            'insight' => [
                'ai_summary'         => 'Early-stage prospect with no immediate project timeline — currently in exploration phase with no budget or deadline defined.',
                'lead_intent'        => 'Consulting',
                'urgency_level'      => 'low',
                'recommended_action' => 'Add to nurture sequence — send a case study relevant to healthtech and follow up in 30 days.',
                'lead_score'         => 28,
                'confidence_level'   => 'medium',
                'ai_model'           => 'llama-3.3-70b-versatile',
                'ai_provider'        => 'groq',
                'processing_time_ms' => 743,
            ],
        ],
        [
            'name'            => 'Rafael Santos',
            'email'           => 'rafael@edtech.br',
            'phone'           => '+55 11 98765 4321',
            'source'          => 'website',
            'priority'        => 'high',
            'status'          => 'qualified',
            'inquiry_message' => 'Building an EdTech platform for Brazil. Need video streaming, live classes, quizzes, and a student progress dashboard. We have seed funding of $50k for tech. Need to launch in Q1.',
            'insight' => [
                'ai_summary'         => 'EdTech startup with $50k tech budget building a comprehensive learning platform with video streaming and live classes for the Brazilian market.',
                'lead_intent'        => 'MVP Development',
                'urgency_level'      => 'high',
                'recommended_action' => 'Prioritize this lead — $50k budget with Q1 deadline is a strong qualified opportunity. Send a tech proposal this week.',
                'lead_score'         => 94,
                'confidence_level'   => 'high',
                'ai_model'           => 'llama-3.3-70b-versatile',
                'ai_provider'        => 'groq',
                'processing_time_ms' => 1389,
            ],
        ],
        [
            'name'            => 'Fatima Al-Rashid',
            'email'           => 'fatima@marketplace.ae',
            'phone'           => '+971 50 123 4567',
            'source'          => 'instagram',
            'priority'        => 'medium',
            'status'          => 'new',
            'inquiry_message' => 'We want to build an Arabic-language marketplace app for UAE. Need buyer/seller flows, escrow payments, and dispute resolution. Previous agency ghosted us.',
            'insight' => [
                'ai_summary'         => 'UAE marketplace startup seeking a reliable development partner after being let down by a previous agency. Requires Arabic-language app with payment and dispute systems.',
                'lead_intent'        => 'Mobile App',
                'urgency_level'      => 'high',
                'recommended_action' => 'Reach out immediately — mention reliability and past marketplace experience. Trust is the key concern here.',
                'lead_score'         => 80,
                'confidence_level'   => 'high',
                'ai_model'           => 'llama-3.3-70b-versatile',
                'ai_provider'        => 'groq',
                'processing_time_ms' => 1187,
            ],
        ],
        [
            'name'            => 'Kevin Park',
            'email'           => 'kpark@saas.kr',
            'phone'           => null,
            'source'          => 'referral',
            'priority'        => 'low',
            'status'          => 'closed',
            'inquiry_message' => 'Needed a quick landing page for a product launch. Already handled internally.',
            'insight' => [
                'ai_summary'         => 'Low-value request for a landing page that has been resolved internally. No current opportunity.',
                'lead_intent'        => 'Unknown',
                'urgency_level'      => 'low',
                'recommended_action' => 'Mark as closed — no immediate opportunity. Keep in contact list for future needs.',
                'lead_score'         => 12,
                'confidence_level'   => 'high',
                'ai_model'           => 'llama-3.3-70b-versatile',
                'ai_provider'        => 'groq',
                'processing_time_ms' => 654,
            ],
        ],
    ];

    public function run(): void
    {
        foreach ($this->leads as $leadData) {
            $insightData = $leadData['insight'];
            unset($leadData['insight']);

            $lead = Lead::create(array_merge($leadData, ['lead_score' => $insightData['lead_score']]));

            LeadStatusHistory::create([
                'lead_id'    => $lead->id,
                'from_status' => null,
                'to_status'  => $leadData['status'],
                'changed_at' => $lead->created_at,
            ]);

            LeadInsight::create(array_merge($insightData, [
                'lead_id'     => $lead->id,
                'processed_at' => now()->subMinutes(rand(1, 60)),
            ]));
        }
    }
}
