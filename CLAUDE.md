# CLAUDE.md — Optic AI Lead Intelligence Platform

> This file is the mandatory reference for every Claude Code session.
> Read this fully before writing any code.
> It reflects the actual current state of the project, not the initial plan.

---

## Project Identity

**Name**: Optic — AI Lead Intelligence Platform  
**Tagline**: "Every inquiry, instantly understood."  
**Live URL**: https://optic-leads.vercel.app  
**Repository**: https://github.com/devraj-thakor/Optic  
**Purpose**: Internal AI-native lead management dashboard — replaces manual lead triage

---

## Repository Structure

```
optic/
├── optic-api/          Laravel 11 backend (PHP 8.3)
├── optic-web/          Next.js 15 frontend (TypeScript)
├── references/         Planning docs, setup guide, AI usage documentation
├── CLAUDE.md           YOU ARE HERE
└── README.md
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Laravel 11 (PHP 8.3) |
| Frontend | Next.js 15 (App Router, TypeScript) — CSR focused |
| Database | PostgreSQL with pg_trgm extension |
| Auth | Laravel Sanctum (Bearer token) |
| Queue | Redis + queue:listen (ai-processing queue) |
| Cache | Redis |
| AI | Strategy pattern — Gemini primary, env-configurable fallback |
| State (FE) | Zustand (auth/ui) + TanStack Query v5 (server state) |
| Styling | Tailwind CSS v4 + custom design system in globals.css |
| Forms | React Hook Form + Zod |
| Animation | Framer Motion |

---

## BACKEND — Laravel 11 (`/optic-api`)

### Architecture Rules — Must Follow Every Session

1. **Controllers are thin** — validate (FormRequest) → call service → return response. Zero business logic in controllers.
2. **Services hold all business logic** — testable and reusable.
3. **DTOs carry data between layers** — never pass raw arrays.
4. **Enums for all constants** — PHP 8.1 backed enums. No magic strings.
5. **Events + Listeners for AI triggering** — never call AI directly from a controller.
6. **Jobs for all async work** — AI processing always goes through ProcessLeadAIJob.
7. **FormRequests for all validation** — no inline `$request->validate()` in controllers.
8. **Resources for all API output** — never `$model->toArray()`.
9. **updateQuietly() inside jobs** — to avoid triggering re-dispatch of events from within job execution.

### Naming Conventions

```
Controllers:    PascalCase + Controller      → LeadController
Services:       PascalCase + Service         → LeadService
DTOs:           PascalCase + Data            → LeadData
Jobs:           Verb phrase + Job            → ProcessLeadAIJob
Events:         Noun + past tense            → LeadCreated
Listeners:      Verb phrase                  → TriggerLeadAIProcessing
FormRequests:   Action + Model + Request     → StoreLeadRequest
Resources:      Model + Resource             → LeadResource
Enums:          PascalCase                   → LeadStatus
Models:         PascalCase singular          → Lead
Routes (URL):   kebab-case                   → /leads/{id}/regenerate-insights
Route names:    dot.notation                 → leads.store
```

### Directory Structure (Current State)

```
app/
├── DTOs/
│   ├── AIResponseData.php
│   ├── DashboardStatsData.php
│   └── LeadData.php
├── Enums/
│   ├── LeadPriority.php
│   ├── LeadSource.php
│   ├── LeadStatus.php
│   └── UrgencyLevel.php
├── Events/
│   ├── LeadCreated.php
│   └── LeadUpdated.php
├── Exceptions/
│   └── AIProcessingException.php
├── Http/
│   ├── Controllers/Api/
│   │   ├── AuthController.php
│   │   ├── DashboardController.php
│   │   ├── DemoController.php
│   │   └── LeadController.php
│   ├── Middleware/ForceJsonResponse.php
│   └── Requests/
│       ├── Auth/LoginRequest.php
│       └── Lead/
│           ├── FilterLeadRequest.php
│           ├── StoreLeadRequest.php
│           └── UpdateLeadRequest.php
├── Jobs/ProcessLeadAIJob.php
├── Listeners/TriggerLeadAIProcessing.php
├── Models/
│   ├── Lead.php               UUID PK, enum casts
│   ├── LeadInsight.php
│   ├── LeadStatusHistory.php
│   └── User.php
├── Repositories/LeadRepository.php
├── Resources/
│   ├── LeadInsightResource.php
│   └── LeadResource.php
├── Services/
│   ├── AI/
│   │   ├── Contracts/AIProviderInterface.php
│   │   ├── Providers/
│   │   │   ├── CloudflareProvider.php
│   │   │   ├── GeminiProvider.php
│   │   │   ├── GroqProvider.php
│   │   │   ├── NvidiaProvider.php
│   │   │   ├── OpenAICompatibleProvider.php   (abstract base)
│   │   │   └── OpenRouterProvider.php
│   │   ├── AIProviderFactory.php
│   │   └── LeadInsightService.php
│   ├── Auth/AuthService.php
│   ├── Dashboard/DashboardService.php
│   ├── Demo/DemoLeadGeneratorService.php
│   └── Lead/LeadService.php
└── Traits/ApiResponseTrait.php
```

### API Routes (All Under `/api`)

```
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

GET    /api/leads                    ?status&priority&source&search&page&per_page
POST   /api/leads
GET    /api/leads/{uuid}
PUT    /api/leads/{uuid}
DELETE /api/leads/{uuid}
POST   /api/leads/{uuid}/regenerate-insights

GET    /api/dashboard/stats
GET    /api/dashboard/recent-leads

POST   /api/demo/generate-lead       { channel?, use_ai? }
DELETE /api/demo/clear-leads
```

### AI Provider Chain

The system tries the primary provider first. On failure, it automatically retries with the fallback provider configured in `.env`. This is configured in `LeadInsightService`.

```
Primary:  AI_PROVIDER + AI_MODEL + AI_API_KEY
Fallback: FALLBACK_AI_PROVIDER + FALLBACK_AI_MODEL + FALLBACK_AI_API_KEY
```

### AI Prompt (Location: `resources/prompts/lead_insight.txt`)

The prompt uses `{source}` and `{message}` as placeholders. It must instruct the model to return only raw JSON — no markdown, no backticks, no explanation. The six required fields:

```json
{
  "ai_summary": "2-3 sentence summary",
  "lead_intent": "MVP Development | Mobile App | Web App | AI Integration | Consulting | Partnership | Unknown",
  "urgency_level": "low | medium | high | critical",
  "recommended_action": "One specific actionable sentence",
  "lead_score": 0-100,
  "confidence_level": "low | medium | high"
}
```

### ProcessLeadAIJob

```php
public int $tries = 3;
public array $backoff = [5, 15, 30];
public int $timeout = 30;
public string $queue = 'ai-processing';
```

Use `updateQuietly()` inside this job when updating the lead or insight to prevent re-triggering the `LeadUpdated` event and creating an infinite dispatch loop.

### ApiResponseTrait

Used in all controllers:

```php
$this->success($data, 'message', 200);
$this->error('message', 400, $errors);
$this->created($data, 'Created');
```

### Redis Cache Keys and TTLs

| Key | TTL | Invalidated On |
|---|---|---|
| `dashboard:stats:{userId}` | 300s | Any lead create/update/delete |
| `lead:{uuid}` | 60s | Lead or insight update |
| `leads:list:{hash}` | 30s | Any lead create/update/delete |
| `dashboard:recent` | 60s | Lead created |

---

## FRONTEND — Next.js 15 (`/optic-web`)

### Critical Rendering Rules

1. `app/page.tsx` (landing page) — server component, SSR for SEO.
2. Everything under `(dashboard)` — must be `'use client'` at page level.
3. Never use server-side `fetch()` inside dashboard components.
4. Always use TanStack Query for all data fetching in the dashboard.
5. Always use `<Link href="..." prefetch={true}>` for navigation.

### Design System

The CyberX aesthetic. All colors are CSS custom properties defined in `globals.css`.

```
Background base:      #08090E
Card / surface:       #0D0F18
Elevated / hover:     #12141F
Accent blue:          #4B6EF5
Accent hover:         #5B7BFF
Text white:           #FFFFFF
Text secondary:       #9198A8
Text muted:           #4D5568
Success:              #22C55E
Warning:              #F59E0B
Danger:               #F87171
```

Font stack: `Inter` (all UI text) + `JetBrains Mono` (data, numbers, model names).

Channel icon colors:
```
website:   #4B6EF5
whatsapp:  #25D366
instagram: #E1306C
facebook:  #1877F2
linkedin:  #0A66C2
referral:  #F59E0B
```

### Directory Structure (Current State)

```
src/
├── app/
│   ├── page.tsx                   Landing page
│   ├── layout.tsx
│   ├── globals.css                Design tokens + utility classes
│   ├── (auth)/login/page.tsx
│   └── (dashboard)/
│       ├── layout.tsx
│       ├── dashboard/page.tsx
│       ├── leads/
│       │   ├── page.tsx
│       │   ├── new/page.tsx
│       │   └── [id]/page.tsx
│       └── simulator/page.tsx
├── components/
│   ├── ui/
│   │   ├── ChannelIcon.tsx        Custom SVG icons for all 6 channels
│   │   └── [shadcn components]
│   ├── leads/
│   │   ├── LeadBadges.tsx         SourceBadge, StatusBadge, PriorityBadge, LeadScoreCircle, StyledSelect
│   │   ├── LeadFilters.tsx        URL-synced filters with debounced search
│   │   └── LeadForm.tsx
│   ├── insights/
│   │   └── AIInsightCard.tsx
│   ├── dashboard/
│   │   ├── StatCard.tsx
│   │   ├── RecentLeads.tsx
│   │   ├── ChannelBreakdown.tsx
│   │   └── LeadBriefing.tsx       B key shortcut overlay
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── PageHeader.tsx         Title only, no breadcrumbs
│   └── providers/QueryProvider.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useDashboard.ts
│   ├── useLeads.ts
│   ├── useSimulator.ts
│   └── useKeyboardShortcuts.ts
├── lib/
│   ├── api.ts                     Axios with Bearer token interceptor
│   └── utils.ts
├── store/
│   ├── authStore.ts
│   └── uiStore.ts
├── types/index.ts
└── constants/index.ts
```

### Key Types (from `types/index.ts`)

```typescript
type LeadSource   = 'website' | 'whatsapp' | 'instagram' | 'facebook' | 'linkedin' | 'referral'
type LeadStatus   = 'new' | 'contacted' | 'qualified' | 'closed'
type LeadPriority = 'low' | 'medium' | 'high'
type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical'
```

### Select Elements

Use the `StyledSelect` component from `components/leads/LeadBadges.tsx` for all select inputs in the dashboard. Native browser selects ignore dark mode and render with a white background. `StyledSelect` forces the dark background via `color-scheme: dark` and a custom SVG chevron.

---

## What Not to Do

### Backend

- Do not put business logic in controllers
- Do not use `$guarded = []` — always explicit `$fillable`
- Do not call AI providers directly — always go through `LeadInsightService`
- Do not block HTTP responses with AI processing — always use queued jobs
- Do not use `LIKE '%search%'` — use pg_trgm similarity
- Do not return `$model->toArray()` — always use API Resources
- Do not validate in controllers — always use FormRequest classes
- Do not update records inside jobs without using `updateQuietly()` — triggers infinite event loops

### Frontend

- Do not use Server Components for dashboard routes
- Do not use `useState` + `useEffect` for API calls — use TanStack Query
- Do not use `any` TypeScript type
- Do not inline `fetch()` calls — always use the `api` axios instance from `lib/api.ts`
- Do not use raw browser `<select>` in dark UI — use `StyledSelect`
- Do not add breadcrumbs to page headers — `PageHeader` shows title only
- Do not create pages without loading/skeleton states and empty states

---

## Current Project Status

All phases are complete. The project is deployed and publicly accessible.

- Backend: Laravel API on AWS EC2
- Frontend: Next.js on Vercel — https://optic-leads.vercel.app
- Database: PostgreSQL on EC2
- Queue: Redis + queue worker managed by Supervisor

Demo credentials: `founder@rethinklab.co` / `password`

If you are starting a new session to add a feature or fix something, read the relevant service and component files before writing any new code. Do not assume the current implementation matches the initial plan — it may have evolved.
