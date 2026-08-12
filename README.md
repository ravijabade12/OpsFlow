# OpsFlow

**Service Operations Command Center** — Proof of Concept for the Intiqo Technologies Senior UI Engineer evaluation.

OpsFlow is a web + mobile service-operations platform: operations managers run jobs, customers, agents, and analytics from a **Next.js** dashboard; field agents use a **React Native CLI** app to view and update assigned jobs. Both clients share one REST API contract.

> The POC uses a lightweight **JSON Server** backend so engineering effort stays on frontend and mobile quality. The REST contract is intentional — a production API can replace JSON Server later without rewriting the clients.

---

## Live demo

| Surface | URL |
|---------|-----|
| **Web dashboard (Vercel)** | [https://ops-flow-web-eight.vercel.app/dashboard](https://ops-flow-web-eight.vercel.app/dashboard) |
| **REST API (Render)** | [https://opsflow-api-p8l4.onrender.com](https://opsflow-api-p8l4.onrender.com) |
| **GitHub repository** | [https://github.com/ravijabade12/OpsFlow](https://github.com/ravijabade12/OpsFlow) |

Quick API check:

```bash
curl "https://opsflow-api-p8l4.onrender.com/jobs?_limit=1"
```

> **Note:** The Render free tier may cold-start (30–60s) after idle time. Retry if the first request is slow or fails.

---

## How this project was built

This POC was developed with **Cursor Agent** as an acceleration tool across a **phase-gated** plan (planning → foundation → API → Redux → design system → features → performance → mobile → tests → CI → deploy).

I did **not** treat generated output as a black box. For each phase I:

- Reviewed the architecture and decisions against the product spec
- Read and walked through the resulting code (stores, services, UI modules, mobile screens)
- Verified behavior locally (API, dashboard flows, jobs CRUD, mobile list/status updates)
- Made deliberate product and engineering choices (stack, ADRs, what *not* to build)

Cursor helped move faster; ownership of structure, correctness, and trade-offs stayed with me.

---

## What we built

### Web dashboard (`apps/web`)

Operations command center for managers:

- **Dashboard** — KPI cards, trends, status distribution, recent jobs/activity
- **Jobs** — search, filters, sort, pagination, details drawer, create/edit (RHF + Zod), bulk status updates
- **Agents / Customers** — lists, detail drawers, related jobs
- **Analytics** — date-aware charts over API counts + sampled jobs
- **Design system** — shared UI kit (zinc + teal, Geist typography)

State: **Redux Toolkit** (domain slices, thunks, selectors). Data: REST via a thin services layer.

### Mock REST API (`api`)

JSON Server with a seeded dataset (~500 agents, ~2k customers, ~10k jobs, ~20k activities):

- Filter / sort / paginate with `_page`, `_limit`, `_sort`, `_order`, `q`, etc.
- Hosted on Render for the live demo; local via `npm run api`

### Field-agent mobile (`apps/mobile`)

React Native **CLI** (no Expo):

- Assigned jobs `FlatList` (pull-to-refresh + infinite scroll)
- Job details + status update bottom sheet
- Same REST contract as web (demo agent `agent-001`)

### Quality & delivery

- Vitest + Testing Library (web), Playwright critical Jobs E2E, Jest (mobile)
- ESLint, Prettier, TypeScript strict, `npm run ci`
- GitHub Actions (lint → format → typecheck → tests → build → E2E)
- Web on **Vercel**, API on **Render**

---

## Architecture (high level)

```text
┌─────────────────┐     REST      ┌──────────────────┐
│  apps/web       │──────────────▶│                  │
│  Next.js        │               │  api/            │
└─────────────────┘               │  JSON Server     │──▶ db.json
┌─────────────────┐     REST      │  (Render / local)│
│  apps/mobile    │──────────────▶│                  │
│  React Native   │               └──────────────────┘
└─────────────────┘
         │
         ▼
┌─────────────────┐
│ packages/shared │  Job / Agent / Customer / Activity types
└─────────────────┘
```

Details: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · decisions: [docs/DECISIONS.md](docs/DECISIONS.md)

---

## Stack

| Area | Choice |
|------|--------|
| Web | Next.js, React, TypeScript, Tailwind CSS, Redux Toolkit, React Hook Form + Zod, Recharts |
| Mobile | React Native CLI, TypeScript, Redux Toolkit, React Navigation |
| Shared | `@opsflow/shared` domain types & constants |
| API | JSON Server + seeded `db.json` |
| Quality | ESLint, Prettier, Vitest, Playwright, Jest |
| CI/CD | GitHub Actions |
| Deploy | [Vercel](https://ops-flow-web-eight.vercel.app/dashboard) (web) · [Render](https://opsflow-api-p8l4.onrender.com) (API) |

---

## Repository structure

```text
opsflow/
├── apps/
│   ├── web/          # Next.js dashboard → Vercel
│   └── mobile/       # React Native CLI field-agent app
├── packages/
│   └── shared/       # Shared types & constants
├── api/              # JSON Server + seed → Render
├── docs/             # Spec, architecture, ADRs, testing, CI, deploy
├── .github/workflows/
├── render.yaml
└── package.json      # npm workspaces
```

---

## Local setup

**Prerequisites:** Node.js 20+ (mobile prefers ≥ 22.11). Android Studio for the mobile app.

```bash
# From repo root
npm install

# API  → http://localhost:3001
npm run api

# Web  → http://localhost:3000
npm run web

# Mobile Metro
npm run mobile

# Quality gate
npm run ci
npm run web:test:e2e
```

Regenerate seed data: `npm run api:seed`

Point the web app at the public API locally by setting in `apps/web/.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=https://opsflow-api-p8l4.onrender.com
```

(Default local API is `http://localhost:3001` — see `apps/web/.env.example`.)

---

## Documentation

| Document | Purpose |
|----------|---------|
| [docs/PROJECT_SPEC.md](docs/PROJECT_SPEC.md) | Full product & engineering specification |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System architecture |
| [docs/DECISIONS.md](docs/DECISIONS.md) | Technical decision records (ADRs) |
| [docs/PERFORMANCE.md](docs/PERFORMANCE.md) | Performance notes |
| [docs/TESTING.md](docs/TESTING.md) | Test stack & commands |
| [docs/CI.md](docs/CI.md) | Local CI gate + GitHub Actions |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Vercel + Render deploy guide |
| [docs/PRESENTATION.md](docs/PRESENTATION.md) | Demo script & presentation pack |
| [api/README.md](api/README.md) | REST API contract |
| [apps/mobile/README.md](apps/mobile/README.md) | Field-agent app setup |

---

## Phase delivery

Built phase-by-phase with explicit review between phases:

| Phase | Focus | Status |
|-------|--------|--------|
| 0–1 | Planning + monorepo foundation | Complete |
| 2 | Mock REST API + seed | Complete |
| 3 | Redux architecture | Complete |
| 4 | Design system | Complete |
| 5–7 | Jobs, dashboard/analytics, agents/customers | Complete |
| 8 | Performance | Complete |
| 9 | React Native field app | Complete |
| 10–11 | Testing + CI/CD | Complete |
| 12 | Deployment + presentation | Complete |

---

## Explicit non-goals

No authentication, payments, WebSockets, production-grade backend, microservices, Kubernetes, or app-store publishing. See [docs/PROJECT_SPEC.md](docs/PROJECT_SPEC.md) §38 and [docs/DECISIONS.md](docs/DECISIONS.md).

---

## License

Private POC — evaluation use.
