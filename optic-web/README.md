# optic-web

The Next.js 15 frontend for Optic. It is client-side rendering focused - all dashboard routes use the `'use client'` directive and TanStack Query for data fetching. Navigation between pages is instant.

Live: [optic-leads.vercel.app](https://optic-leads.vercel.app)

---

## Requirements

- Node.js 18+
- npm 9+
- A running instance of optic-api

---

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_API_URL` in `.env.local` to point at the backend:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

The frontend will be available at `http://localhost:3000`.

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    Marketing landing page (SSR for SEO)
│   ├── layout.tsx                  Root layout - fonts, QueryProvider, Toaster
│   ├── globals.css                 Design system - color tokens, animations
│   │
│   ├── (auth)/
│   │   └── login/page.tsx
│   │
│   └── (dashboard)/                All pages here are 'use client'
│       ├── layout.tsx              Sidebar + main content wrapper
│       ├── dashboard/page.tsx      Stats, recent leads, channel breakdown
│       ├── leads/
│       │   ├── page.tsx            List with filters and debounced search
│       │   ├── new/page.tsx        New lead form
│       │   └── [id]/page.tsx       Lead detail with AI insight card
│       └── simulator/page.tsx      Live lead generator
│
├── components/
│   ├── ui/
│   │   ├── ChannelIcon.tsx         SVG icons for all 6 channels
│   │   └── [shadcn components]
│   ├── leads/
│   │   ├── LeadBadges.tsx          SourceBadge, StatusBadge, PriorityBadge, LeadScoreCircle
│   │   ├── LeadFilters.tsx         Filters synced to URL query string
│   │   └── LeadForm.tsx            React Hook Form + Zod
│   ├── insights/
│   │   └── AIInsightCard.tsx       Animated processing state -> populated insight
│   ├── dashboard/
│   │   ├── StatCard.tsx
│   │   ├── RecentLeads.tsx
│   │   ├── ChannelBreakdown.tsx    Animated progress bars by source
│   │   └── LeadBriefing.tsx        Full-screen overlay triggered by B key
│   ├── layout/
│   │   ├── Sidebar.tsx             Collapsible nav with user profile and logout
│   │   ├── Header.tsx
│   │   └── PageHeader.tsx          Page title only, no breadcrumbs
│   └── providers/
│       └── QueryProvider.tsx
│
├── hooks/
│   ├── useAuth.ts
│   ├── useDashboard.ts             Stats and recent leads with polling
│   ├── useLeads.ts                 CRUD operations and search/filter
│   ├── useSimulator.ts             Lead generation and live feed
│   └── useKeyboardShortcuts.ts     B key for LeadBriefing
│
├── lib/
│   ├── api.ts                      Axios with Bearer token interceptor
│   └── utils.ts
│
├── store/
│   ├── authStore.ts                Zustand auth state
│   └── uiStore.ts                  Zustand UI state (sidebar collapse)
│
├── types/
│   └── index.ts
│
└── constants/
    └── index.ts                    Source, status, priority configs with colors
```

---

## Rendering Strategy

The marketing page is server-rendered for SEO. Everything under the dashboard group is client-side. This is deliberate - navigating between leads, the simulator, and the dashboard should be instant.

All data fetching goes through TanStack Query. There is no direct `fetch()` or `useEffect` for API calls anywhere in the dashboard.

---

## Authentication

Bearer tokens from Laravel Sanctum. The token lives in Zustand in memory, not in localStorage. It is mirrored to a cookie through a Next.js proxy route for persistence across refreshes.

The Axios instance in `lib/api.ts` reads the token from Zustand and injects it as `Authorization: Bearer` on every request. A 401 response clears auth state and redirects to login.

---

## Design System

Electric blue `#4B6EF5` accent on a near-black `#08090E` background. Cards use `#0D0F18`. Text is white for primary, `#4D5568` for muted labels. All colors are defined as CSS custom properties in `globals.css`.

Channel icons are custom hand-crafted SVG paths for all six sources. No emoji, no icon library dependency for these.

---

## Key Patterns

Search is debounced - waits 400ms after the last keystroke before sending a request.

Filters (status, priority, source) are reflected in the URL query string. The state is derived from `useSearchParams`, not local useState.

The lead score renders as an SVG circle with an animated stroke. Color changes at 80 (green), 60 (blue), 40 (amber), below 40 (red).

The AI insight card has two states: processing (animated conic-gradient border with pulsing dots) and complete (populated fields). TanStack Query polls every 4 seconds until the insight arrives.

Pressing B anywhere in the dashboard opens the Lead Briefing overlay with the top uncontacted high-priority leads.

The Simulator page uses `refetchInterval: 3000` on TanStack Query to keep the live feed updated.

---

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the Laravel API |

---

## Deployment

Deploys to Vercel from the main branch. Set `NEXT_PUBLIC_API_URL` to the production backend URL in Vercel environment settings.
