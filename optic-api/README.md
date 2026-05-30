# optic-api

The Laravel 11 backend for Optic. It is a pure JSON REST API - no Blade views, no session-based rendering. All responses go through API Resources. All requests are validated through FormRequest classes.

---

## Requirements

- PHP 8.2 or 8.3
- Composer 2.x
- PostgreSQL 14+ (with pg_trgm support)
- Redis 6+

---

## Setup

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve
```

Then start the queue worker in a separate terminal:

```bash
php artisan queue:listen --queue=ai-processing,default
```

See [../references/SETUP.md](../references/SETUP.md) for Docker setup, full environment variable reference, and AI provider configuration.

---

## Environment Variables

The critical ones:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=optic
DB_USERNAME=optic
DB_PASSWORD=secret

REDIS_HOST=127.0.0.1
REDIS_PORT=6379
QUEUE_CONNECTION=redis
CACHE_DRIVER=redis

# AI Configuration - Primary AI Provider
GEMINI_API_KEY=AIzaSy.....
GEMINI_MODEL=gemini-3.5-flash

# Secondary AI Provider
AI_PROVIDER=gemini           # gemini | groq | openrouter | nvidia | cloudflare
AI_MODEL=gemini-3.5-flash
AI_API_KEY=your_api_key_here

# Fallback provider if primary fails
AI_PROVIDER=groq
AI_MODEL=meta-llama/llama-3.3-70b-instruct
AI_API_KEY=your_fallback_key_here

# If using CloudFlare then
CLOUDFLARE_ACCOUNT_ID=your_clouflare_account_id_here

FRONTEND_URL=http://localhost:3000
```

---

## API Endpoints

All routes are prefixed with `/api`. Authentication uses Laravel Sanctum Bearer tokens.

```
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

GET    /api/leads                              status, priority, source, search, page, per_page
POST   /api/leads
GET    /api/leads/{uuid}
PUT    /api/leads/{uuid}
DELETE /api/leads/{uuid}
POST   /api/leads/{uuid}/regenerate-insights

GET    /api/dashboard/stats
GET    /api/dashboard/recent-leads

POST   /api/demo/generate-lead                channel, use_ai
DELETE /api/demo/clear-leads
```

---

## Directory Structure

```
app/
├── DTOs/
│   ├── AIResponseData.php
│   ├── DashboardStatsData.php
│   └── LeadData.php
│
├── Enums/
│   ├── LeadPriority.php         low | medium | high
│   ├── LeadSource.php           website | whatsapp | instagram | facebook | linkedin | referral
│   ├── LeadStatus.php           new | contacted | qualified | closed
│   └── UrgencyLevel.php         low | medium | high | critical
│
├── Events/
│   ├── LeadCreated.php
│   └── LeadUpdated.php
│
├── Exceptions/
│   └── AIProcessingException.php
│
├── Http/
│   ├── Controllers/Api/
│   │   ├── AuthController.php
│   │   ├── DashboardController.php
│   │   ├── DemoController.php
│   │   └── LeadController.php
│   ├── Middleware/
│   │   └── ForceJsonResponse.php
│   └── Requests/
│       ├── Auth/LoginRequest.php
│       └── Lead/
│           ├── FilterLeadRequest.php
│           ├── StoreLeadRequest.php
│           └── UpdateLeadRequest.php
│
├── Jobs/
│   └── ProcessLeadAIJob.php     3 retries, exponential backoff, 30s timeout
│
├── Listeners/
│   └── TriggerLeadAIProcessing.php
│
├── Models/
│   ├── Lead.php                 UUID primary key, enum casts
│   ├── LeadInsight.php
│   ├── LeadStatusHistory.php
│   └── User.php
│
├── Repositories/
│   └── LeadRepository.php       pg_trgm fuzzy search, filter, paginate
│
├── Resources/
│   ├── LeadInsightResource.php
│   └── LeadResource.php
│
├── Services/
│   ├── AI/
│   │   ├── Contracts/
│   │   │   └── AIProviderInterface.php
│   │   ├── Providers/
│   │   │   ├── CloudflareProvider.php
│   │   │   ├── GeminiProvider.php
│   │   │   ├── GroqProvider.php
│   │   │   ├── NvidiaProvider.php
│   │   │   ├── OpenAICompatibleProvider.php   abstract base for OpenAI-format APIs
│   │   │   └── OpenRouterProvider.php
│   │   ├── AIProviderFactory.php
│   │   └── LeadInsightService.php
│   ├── Auth/AuthService.php
│   ├── Dashboard/DashboardService.php
│   ├── Demo/DemoLeadGeneratorService.php
│   └── Lead/LeadService.php
│
└── Traits/
    └── ApiResponseTrait.php     success(), error(), created() - used in all controllers

resources/
└── prompts/
    └── lead_insight.txt         AI prompt template with {source} and {message} placeholders
```

---

## AI Architecture

The AI system uses a strategy pattern so providers are interchangeable without code changes.

The flow:

```
Lead created/updated
  → LeadCreated / LeadUpdated event fires
  → TriggerLeadAIProcessing listener dispatches ProcessLeadAIJob
  → ProcessLeadAIJob calls LeadInsightService
  → LeadInsightService tries primary provider (Gemini)
  → If Gemini fails, retries with fallback provider from .env
  → Stores structured result in lead_insights table
  → Updates lead_score on the leads table
```

The AI prompt lives in `resources/prompts/lead_insight.txt`. It instructs the model to return only a JSON object with six fields: ai_summary, lead_intent, urgency_level, recommended_action, lead_score, and confidence_level. The strict output format makes parsing reliable.

### Supported Providers

| Provider | AI_PROVIDER value | Base |
|---|---|---|
| Google Gemini | gemini | Native Gemini API |
| Groq | groq | OpenAI-compatible |
| OpenRouter | openrouter | OpenAI-compatible |
| Nvidia NIM | nvidia | OpenAI-compatible |
| Cloudflare Workers AI | cloudflare | Cloudflare REST API |

---

## Caching

Redis is used for caching frequently-read data.

| Cache Key | TTL | Invalidated When |
|---|---|---|
| dashboard:stats:{userId} | 5 minutes | Any lead created, updated, or deleted |
| lead:{uuid} | 60 seconds | Lead or insight updated |
| leads:list:{hash} | 30 seconds | Any lead change |
| dashboard:recent | 60 seconds | Lead created |

---

## Database

PostgreSQL with the pg_trgm extension for fuzzy text search.

The leads table uses UUIDs as primary keys to avoid enumeration attacks and to be safe in distributed systems.

The lead_insights table has a 1:1 relationship with leads (cascade delete). AI results are stored separately from the lead itself so the lead is immediately usable before AI processing completes.

The lead_status_history table tracks every status change with a timestamp, giving a full audit trail for each lead.

Fuzzy search is implemented using a GIN index on a concatenation of name, email, phone, and inquiry_message. Searching by name with a typo still returns the right lead.

---

## Architecture Rules

- Controllers are thin. They only validate (FormRequest), call a service, and return a response. No business logic in controllers.
- Services hold all business logic and are independently testable.
- DTOs carry data between layers. No raw arrays passed between service methods.
- Enums are used for all constants. No magic strings scattered through code.
- API Resources are used for all output. Models are never returned directly.
- AI processing always goes through a queued job. HTTP responses never wait for AI.
