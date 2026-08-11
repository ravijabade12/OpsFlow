# OpsFlow — Architecture

> **Status:** Phase 12 deployment + presentation pack complete; final approval pending  
> **Scope:** High-level design for the POC. Implementation follows the phase plan.

---

## 1. Product model

OpsFlow is a **service-operations command center**:

| Client | Audience | Responsibility |
|--------|----------|----------------|
| Web dashboard (`apps/web`) | Operations managers | Jobs, agents, customers, analytics, assignments |
| Mobile app (`apps/mobile`) | Field agents | Assigned jobs, details, status updates |

Both clients talk to the same **REST API** contract. The POC uses a lightweight JSON Server so engineering effort stays on frontend and mobile quality.

```text
                 OpsFlow
                    |
          +---------+---------+
          |                   |
     Web Dashboard       Mobile App
       Next.js          React Native CLI
          |                   |
          +---------+---------+
                    |
                 REST API
                    |
               JSON Server
                    |
                 db.json
```

---

## 2. Repository layout

```text
opsflow/
├── apps/
│   ├── web/          # Next.js + TypeScript + Tailwind + RTK
│   └── mobile/       # React Native CLI + TypeScript + RTK
├── packages/
│   └── shared/       # Shared types and constants only
├── api/
│   ├── db.json       # Seeded dataset (Phase 2)
│   ├── seed/         # Seed scripts (Phase 2)
│   └── README.md     # API documentation (Phase 2)
├── docs/
│   ├── PROJECT_SPEC.md
│   ├── ARCHITECTURE.md
│   └── DECISIONS.md
├── .github/workflows/
├── README.md
├── package.json
└── .gitignore
```

The monorepo stays intentionally simple: no heavy workspace tooling beyond what Phase 1 needs.

---

## 3. Client ↔ API relationship

```text
┌─────────────────┐     REST      ┌──────────────┐
│  apps/web       │──────────────▶│              │
│  Next.js        │               │  api/        │
└─────────────────┘               │  JSON Server │──▶ db.json
┌─────────────────┐     REST      │              │
│  apps/mobile    │──────────────▶│              │
│  React Native   │               └──────────────┘
└─────────────────┘
         │
         ▼
┌─────────────────┐
│ packages/shared │  Job / Agent / Customer / Activity types
└─────────────────┘
```

- Web and mobile **do not** share UI components.
- They **may** share domain types and constants via `packages/shared`.
- Analytics on the web may be derived client-side from job/activity data when JSON Server has no aggregation endpoints.

---

## 4. Web application architecture

**Stack:** Next.js (App Router), React, TypeScript (strict), Tailwind CSS, Redux Toolkit, React Hook Form + Zod, Recharts.

### Planned folder structure (`apps/web`)

```text
app/                 # Routes: dashboard, jobs, agents, customers, analytics
components/
  ui/                # Generic design-system primitives
  layout/            # Sidebar, header, shell
  data-display/      # JobStatusBadge, MetricCard, etc.
  forms/             # JobForm, FilterPanel, SearchInput
features/            # Domain feature modules composed from UI + store
hooks/
lib/
services/            # API client functions (no Redux inside)
store/               # RTK store, slices, thunks, selectors
types/
utils/
tests/
```

### UI modules (web)

| Module | Purpose |
|--------|---------|
| Dashboard | KPI cards, trends, recent jobs/activity |
| Jobs | Table, search, filter, sort, pagination, CRUD, bulk status |
| Agents | List, detail, assigned jobs, SLA metrics |
| Customers | List, detail, related jobs |
| Analytics | Date range, charts (line/bar/donut/area as justified) |

---

## 5. Mobile application architecture

**Stack:** React Native CLI (no Expo), TypeScript, Redux Toolkit, React Navigation, StyleSheet, FlatList.

### Folder structure (`apps/mobile`)

```text
src/
  screens/
    Jobs/
    JobDetails/
  components/
  navigation/
  services/
  store/
  theme/
  types/
android/
```

### Mobile scope (intentionally narrow)

- Jobs list (`FlatList`, pull-to-refresh)
- Job details
- Status update
- Loading / error / empty states
- Optional: Profile, Settings

Do **not** mirror the full web dashboard on mobile.

---

## 6. State architecture (Redux Toolkit)

Domain-oriented slices — not one giant store:

```text
store/
├── index.ts
├── hooks.ts
├── rootReducer.ts
└── slices/
    ├── jobs/       # slice, thunks, selectors, types
    ├── agents/
    ├── customers/
    └── ui/
```

Each domain demonstrates:

- Initial state
- Reducers + `extraReducers`
- Async thunks (`pending` / `fulfilled` / `rejected`)
- Selectors
- Typed hooks (`useAppDispatch` / `useAppSelector`)

API calls live in `services/`; thunks orchestrate them. Components consume state via selectors/hooks — they do not duplicate fetch logic.

Conceptual jobs state shape:

```ts
interface JobsState {
  data: Job[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  // filters, pagination, selection added as needed
}
```

---

## 7. API contract

| Resource | Endpoints |
|----------|-----------|
| Jobs | `GET/POST /jobs`, `GET/PATCH/DELETE /jobs/:id` |
| Agents | `GET /agents`, `GET /agents/:id` |
| Customers | `GET /customers`, `GET /customers/:id` |
| Activities | `GET /activities`, `GET /activities/:id` |

Query examples (JSON Server):

```text
/jobs?status=pending
/jobs?priority=high
/jobs?agentId=agent-001
/jobs?_page=1&_per_page=20
```

Limitations of JSON Server that block clean query behavior will be documented in `api/README.md` / `DECISIONS.md` rather than inventing a custom backend.

---

## 8. Data model (shared)

Core entities (exact fields in `docs/PROJECT_SPEC.md` §8 and later `packages/shared`):

- **Job** — status, priority, customer, agent, location, dates
- **Agent** — availability status, contact
- **Customer** — contact, company, location
- **Activity** — job-linked audit/event trail

Seed scale targets (Phase 2): ~10k+ jobs, ~500+ agents, ~2k+ customers, ~20k+ activities.

---

## 9. Performance strategy

Goals: handle large datasets without rendering thousands of rows at once; optimize with evidence, not cargo-cult memoization.

| Technique | Where |
|-----------|--------|
| Pagination + query params | Jobs tables/lists |
| Debounced search (300–500ms) | Jobs / customers search |
| Efficient selectors | Derived analytics, filter results |
| `FlatList` | Mobile jobs list (required) |
| Virtualization | Only if a desktop table/list still struggles after pagination |
| Lazy routes / images | Web where justified |
| `useMemo` / `useCallback` / `React.memo` | Only when referential stability or expensive calc is proven |

Every significant optimization will be recorded in `DECISIONS.md` or performance notes with **why**.

---

## 10. Forms and validation (web)

- React Hook Form + Zod for job create/edit
- Validate title, description, customer, priority, due date, optional agent
- Surface validation errors in the UI (not browser-only)

---

## 11. Quality and delivery (later phases)

| Concern | Approach |
|---------|----------|
| Lint / format | ESLint + Prettier |
| Types | TypeScript strict |
| Tests | Unit/component + critical web E2E; mobile where practical |
| CI | GitHub Actions (lint, typecheck, test, build) |
| Deploy | Web on Vercel; public JSON Server URL; mobile local only |

---

## 12. Phase gating

Development is **phase-wise**. After each phase the agent stops for explicit approval. Architecture changes that diverge from this document require explanation and approval before implementation.

See `docs/PROJECT_SPEC.md` §36 for the full phase plan and §40 for Cursor operating rules.
