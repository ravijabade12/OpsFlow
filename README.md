# OpsFlow

**Service Operations Command Center** — Proof of Concept for Intiqo Technologies Senior UI Engineer evaluation.

OpsFlow is a web and mobile service-operations platform: operations managers run jobs, customers, agents, and analytics from a **Next.js** dashboard; field agents use a **React Native CLI** app to view and update assigned jobs. Both clients share one REST API contract backed by a lightweight **JSON Server** for this POC.

> The POC uses a lightweight JSON Server REST API to keep the implementation focused on frontend and mobile engineering. The clients communicate through a REST API contract, allowing the data layer to be replaced with a production backend later.

---

## Live demo

| Asset | URL |
|-------|-----|
| Web (Vercel) | _pending — see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)_ |
| API (Render) | _pending — see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)_ |
| Presentation pack | [docs/PRESENTATION.md](docs/PRESENTATION.md) |

---

## Documentation

| Document | Purpose |
|----------|---------|
| [docs/PROJECT_SPEC.md](docs/PROJECT_SPEC.md) | Full product and engineering specification |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System architecture and folder plans |
| [docs/DECISIONS.md](docs/DECISIONS.md) | Technical decision records (ADRs) |
| [docs/PERFORMANCE.md](docs/PERFORMANCE.md) | Phase 8 performance notes |
| [docs/TESTING.md](docs/TESTING.md) | Phase 10 test stack and commands |
| [docs/CI.md](docs/CI.md) | Phase 11 local CI gate + GitHub Actions |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Phase 12 Vercel + Render deploy guide |
| [docs/PRESENTATION.md](docs/PRESENTATION.md) | Demo script, architecture diagram, links |
| [api/README.md](api/README.md) | REST API contract |
| [apps/mobile/README.md](apps/mobile/README.md) | Field-agent app setup |

---

## Repository structure

```text
opsflow/
├── apps/
│   ├── web/          # Next.js dashboard (Vercel)
│   └── mobile/       # React Native CLI field-agent app
├── packages/
│   └── shared/       # Shared types & constants
├── api/              # JSON Server + seed data (Render)
├── docs/
├── .agents/skills/   # TasteSkill (design-taste-frontend)
├── .github/workflows/
├── render.yaml       # Render Blueprint for the API
├── README.md
└── package.json      # npm workspaces
```

---

## Stack

| Area | Choices |
|------|---------|
| Web | Next.js, React, TypeScript, Tailwind CSS, Redux Toolkit, TasteSkill guidance |
| Mobile | React Native CLI (no Expo), TypeScript, Redux Toolkit |
| Shared | `@opsflow/shared` domain types/constants |
| API | JSON Server |
| Quality | ESLint, Prettier, TypeScript strict, Vitest, Playwright, Jest |
| CI/CD | GitHub Actions |
| Deploy | Vercel (web) + Render (API) |

---

## Prerequisites

- Node.js 20+ (mobile template prefers Node ≥ 22.11)
- For Android: Android Studio / SDK / emulator

---

## Setup

```bash
# From repo root
npm install

# Mock API
npm run api
# → http://localhost:3001

# Web dashboard
npm run web
# → http://localhost:3000

# Mobile Metro bundler
npm run mobile

# Quality gate
npm run ci
npm run web:test:e2e
```

Regenerate seed data:

```bash
npm run api:seed
```

TasteSkill (already installed):

```bash
npx skills add Leonxlnx/taste-skill --skill "design-taste-frontend"
```

---

## Development model

Work is **phase-gated**. After each phase the agent stops until Ravi explicitly approves the next phase. See `docs/PROJECT_SPEC.md` §36 and §40.

### Phase status

| Phase | Name | Status |
|-------|------|--------|
| 0 | Project Planning | Complete |
| 1 | Foundation | Complete |
| 2 | Mock REST API | Complete |
| 3 | Redux Architecture | Complete |
| 4 | Design System | Complete |
| 5 | Jobs Module | Complete |
| 6 | Dashboard + Analytics | Complete |
| 7 | Agents + Customers | Complete |
| 8 | Performance | Complete |
| 9 | React Native | Complete |
| 10 | Testing | Complete |
| 11 | Quality + CI/CD | Complete |
| 12 | Deployment + POC Presentation | **Complete — awaiting final approval** |

---

## Explicit non-goals

No authentication, payments, WebSockets, production-grade backend, microservices, Kubernetes, or store publishing. See `docs/PROJECT_SPEC.md` §38 and `docs/DECISIONS.md`.

---

## License

Private POC — evaluation use.
