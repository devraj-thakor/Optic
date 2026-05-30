# Optic

**Every inquiry, instantly understood.**

Optic is an AI-native lead management dashboard built for founders who receive inquiries from multiple channels and need to know, at a glance, which ones matter and what to do next. It replaces the mental overhead of sorting through leads with structured AI intelligence: a score, a summary, a recommended action, and an urgency level - generated automatically when a lead comes in.

Live demo: [optic-leads.vercel.app](https://optic-leads.vercel.app)

Demo login: `founder@rethinklab.co` / `password`

---

## What It Does

When a lead arrives - from a website form, WhatsApp, Instagram, Facebook, LinkedIn, or a referral - Optic processes the inquiry message through an AI pipeline in the background. The result is a structured insight card on every lead:

- A 2-3 sentence summary of what the lead actually needs
- The lead's intent categorized (MVP Development, Mobile App, AI Integration, etc.)
- An urgency level (low, medium, high, critical)
- A specific recommended next action
- A lead score from 0 to 100 based on clarity, budget signals, timeline, and fit

The dashboard shows total leads, new leads today, high-priority uncontacted leads, and recent activity. A channel breakdown shows where leads are coming from. A Simulator tab lets you generate leads from any channel on demand, so you can watch the AI pipeline run in real time.

---

## Repository Structure

```
optic/
├── optic-api/          Laravel 11 backend (REST API)
├── optic-web/          Next.js 15 frontend
├── references/         Project documentation and planning
│   ├── SETUP.md        Full setup instructions
│   ├── AI_USAGE.md     AI tools usage documentation
│   └── CLAUDE.md       Claude Code session context file
└── README.md
```

---

## Tech Stack

### Backend

- **Laravel 11** with PHP 8.3
- **PostgreSQL** with the pg_trgm extension for fuzzy search
- **Redis** for job queuing and response caching
- **Laravel Sanctum** for API token authentication
- **Multi-provider AI** - Gemini, Groq, OpenRouter, Nvidia NIM, Cloudflare AI (switchable from `.env`)

### Frontend

- **Next.js 15** with TypeScript, App Router, client-side rendering focused
- **TanStack Query v5** for all server state management
- **Zustand** for auth state
- **Framer Motion** for animations
- **React Hook Form + Zod** for type-safe forms
- **Tailwind CSS v4**

---

## Architecture Highlights

**AI processing is always async.** Creating or updating a lead fires an event, which dispatches a queued job. The HTTP response returns immediately. The frontend polls for the AI result using TanStack Query.

**AI providers are swappable.** The backend uses a strategy pattern with a shared interface. Changing the `AI_PROVIDER` environment variable switches providers without touching code. The system uses Gemini as primary with a configurable fallback.

**Search uses PostgreSQL trigrams.** There is no external search service. The pg_trgm extension gives genuine fuzzy/typo-tolerant search built into PostgreSQL.

**The frontend acts like a native app.** All dashboard routes use client-side rendering. Navigation between pages is instant. Every data-fetching call goes through TanStack Query with appropriate caching.

**The backend is thin controllers, thick services.** Controllers handle HTTP concerns only. All business logic lives in service classes. The AI layer, lead management, dashboard stats, and demo generation each have their own service.

---

## Quick Start

Full setup instructions with all commands, environment variables, and Docker setup for PostgreSQL and Redis are in [references/SETUP.md](references/SETUP.md).

Short version:

```bash
# Backend
cd optic-api
composer install
cp .env.example .env
# fill in DB, Redis, and AI_API_KEY in .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve

# Queue worker (separate terminal)
php artisan queue:listen --queue=ai-processing,default

# Frontend
cd optic-web
npm install
cp .env.example .env.local
# set NEXT_PUBLIC_API_URL=http://localhost:8000 in .env.local
npm run dev
```

---

## Documentation

- [Setup Guide](references/SETUP.md) - full installation, Docker, environment variables, AI provider configuration
- [AI Usage Documentation](references/AI_USAGE.md) - how AI tools were used throughout development, challenges faced, and what was built manually

---

## Deployment

- Frontend is deployed to Vercel, auto-deploying from the main branch
- Backend runs on AWS EC2 with Nginx, PHP-FPM, and Supervisor managing the queue worker
- PostgreSQL and Redis run on the same EC2 instance

---

## Assignment Context

This project was built as a production-quality implementation of the AI-powered lead management dashboard assignment. It goes beyond the stated requirements in several ways:

- Multi-provider AI strategy pattern (not just one hard-coded provider)
- Gemini primary + configurable fallback provider chain
- PostgreSQL trigram fuzzy search (no Elasticsearch)
- Redis caching on dashboard stats and lead detail
- Full status history tracking with timeline
- Lead Briefing overlay triggered by the B keyboard shortcut
- Live simulator for generating leads from any channel
- Full deployment to Vercel with a working public URL
