# OpsFlow — Technical Decisions

> Record of important architecture and product decisions for the POC.  
> Format: Decision → Reason → Trade-off → Future (when relevant).

---

## ADR-001 — Lightweight JSON Server backend

**Decision:** Use JSON Server with `db.json` as the REST data layer.

**Reason:** The POC focuses on frontend and mobile engineering while maintaining a real REST API contract. A full Node/Express (or similar) backend would divert effort from the evaluation goals.

**Trade-off:** No production-grade backend features (auth, complex aggregation, strong consistency, etc.).

**Future:** Replace JSON Server with Node/Express or another backend without rewriting the presentation-layer architecture, as long as the REST contract is preserved.

---

## ADR-002 — Simple monorepo layout

**Decision:** Organize as `apps/web`, `apps/mobile`, `packages/shared`, and `api/` under one repository.

**Reason:** Keeps web, mobile, shared types, and API seed data discoverable for reviewers without introducing heavy monorepo tooling.

**Trade-off:** Shared code must stay minimal; over-abstracting packages would slow delivery.

**Future:** Add workspace tooling (pnpm/npm workspaces, Turborepo, etc.) only if sharing or CI complexity justifies it.

---

## ADR-003 — Minimal shared package

**Decision:** `packages/shared` holds domain types and constants only — not UI or Redux.

**Reason:** Web and mobile share an API/domain language; they do not share rendering or platform-specific state wiring.

**Trade-off:** Some duplication of store/service patterns across clients is acceptable for clarity.

**Future:** Extract more shared utilities only when duplication becomes a real maintenance cost.

---

## ADR-004 — Web stack: Next.js + TypeScript + Tailwind + RTK

**Decision:** Build the operations dashboard with Next.js, TypeScript (strict), Tailwind CSS, Redux Toolkit (with thunks), React Hook Form + Zod, and Recharts.

**Reason:** Matches the evaluation stack requirements and supports App Router UI, typed state, validated forms, and analytics charts.

**Trade-off:** Learning/config surface of Next.js App Router + RTK must stay explainable; avoid unused libraries.

**Future:** Chart library may be revisited only with explicit approval if Recharts proves inadequate.

---

## ADR-005 — Tailwind for web only; TasteSkill guidance

**Decision:** Use Tailwind CSS for the Next.js app, guided by the TasteSkill Tailwind skill (`npx skills add Leonxlnx/taste-skill`). Do not mix multiple styling systems on web.

**Reason:** Spec requires consistent design tokens, spacing, and responsive UI on web.

**Trade-off:** Mobile will not use Tailwind unless a separate styling decision is explicitly approved.

**Future:** Install/use the TasteSkill skill during Phase 1/4 when scaffolding and design system work begins.

---

## ADR-006 — Mobile: React Native CLI (no Expo)

**Decision:** Build the field-agent app with React Native CLI. Do not use Expo.

**Reason:** Explicit project requirement; demonstrates RN CLI setup and native project structure (`android/`).

**Trade-off:** Setup and local tooling are heavier than Expo for a POC.

**Future:** No App Store / Play Store publishing for this POC; local development and screenshots/video suffice.

---

## ADR-007 — Redux Toolkit with domain slices and thunks

**Decision:** Use RTK with separate slices for jobs, agents, customers, and UI. Async work via `createAsyncThunk` and `extraReducers`. Typed hooks and selectors per domain.

**Reason:** Demonstrates production-oriented state management without a single giant slice or duplicated fetch logic in components.

**Trade-off:** More files than a minimal local-state approach; justified by evaluation criteria and scale of jobs data.

**Future:** Avoid putting ephemeral UI-only concerns into domain slices; keep `ui` slice for cross-cutting UI state.

---

## ADR-008 — Client-derived analytics

**Decision:** Derive analytics/KPI charts on the frontend from jobs (and related) API data rather than building aggregation endpoints.

**Reason:** JSON Server does not provide dedicated analytics APIs; a custom aggregation backend is out of scope.

**Trade-off:** Large payloads or client-side computation may need pagination strategy, sampling, or documented limits.

**Future:** Production backend could expose aggregation endpoints without changing chart presentation much.

---

## ADR-009 — Phase-gated development with human approval

**Decision:** Implement one phase at a time. After each phase, stop for Ravi’s explicit approval before starting the next.

**Reason:** Spec development model (§35–§36, §40). Prevents silent scope creep and keeps architecture intentional.

**Trade-off:** Slower wall-clock delivery; higher review quality.

**Future:** Unchanged for the life of the POC.

---

## ADR-010 — Explicit non-goals

**Decision:** Do not build authentication, authorization, payments, WebSockets, microservices, Kubernetes, App/Play Store publishing, or unnecessary AI/animation features.

**Reason:** POC must show engineering depth on selected features, not feature quantity (§38).

**Trade-off:** Demo flows assume an open API and no login.

**Future:** Auth and realtime would be product-hardening work after the evaluation, not part of this POC.

---

## ADR-011 — Performance optimizations must be justified

**Decision:** Prefer pagination, debounced search, efficient selectors, and FlatList. Use `useMemo` / `useCallback` / `React.memo` / virtualization only with a documented reason.

**Reason:** Spec requires evidence-driven performance thinking (§22–§23), not cargo-cult memoization.

**Trade-off:** Some “best practice” wrappers will be intentionally omitted until measured need appears.

**Future:** Phase 8 records measured optimizations and rationale.

---

## ADR-012 — TasteSkill for web UI guidance

**Decision:** Install TasteSkill `design-taste-frontend` (`npx skills add Leonxlnx/taste-skill`) into the repo under `.agents/skills/design-taste-frontend` and use it for web UI work from Phase 4 onward.

**Reason:** Spec §4 requires the TasteSkill Tailwind/frontend skill so AI-assisted UI avoids generic “slop” patterns and stays consistent.

**Trade-off:** Skill guidance applies to web; mobile continues to use React Native StyleSheet unless a separate styling decision is approved.

**Future:** Re-run the install command if the skill needs updating; prefer stable `design-taste-frontend` skill name.

---

## ADR-013 — npm workspaces monorepo

**Decision:** Use npm `workspaces` for `apps/*` and `packages/*` with package names `@opsflow/web`, `@opsflow/mobile`, and `@opsflow/shared`.

**Reason:** Simple shared-package linking without extra tooling (Turborepo/Nx) during the POC.

**Trade-off:** React Native Metro needs `watchFolders` for `packages/shared`; workspace hoisting can complicate native builds if misconfigured.

**Future:** Add Turborepo only if CI/task orchestration becomes painful.

---

## ADR-014 — JSON Server pagination uses `_limit`

**Decision:** Clients paginate with `_page` and `_limit` (json-server 0.17). The spec example `_per_page` is treated as documentation intent, not a literal query key.

**Reason:** json-server does not implement `_per_page`. Matching the library avoids custom middleware for a POC.

**Trade-off:** Spec wording and client query strings differ slightly; documented in `api/README.md`.

**Future:** A production API can expose whatever pagination contract the product prefers.

---

## ADR-015 — Unassigned `agentId` stored as empty string

**Decision:** Seeded jobs use `agentId: ""` when unassigned instead of JSON `null`.

**Reason:** json-server / lodash-id throws on DELETE (and related id lookups) when foreign-key fields are `null` (`Cannot read properties of null (reading 'toString')`).

**Trade-off:** Domain type remains `string | null`; clients should treat falsy `agentId` as unassigned.

**Future:** A real backend can use `null` without this workaround.

---

## ADR-016 — Domain services own HTTP; slices own async state

**Decision:** Keep REST calls in `services/*` and orchestrate them from RTK `createAsyncThunk` handlers. Components use typed hooks + selectors only.

**Reason:** Spec §12–§13 require demonstrating thunks/extraReducers without duplicating API logic in components.

**Trade-off:** Slightly more files per domain; clearer boundaries for Phase 5+ UI.

**Future:** Unchanged for the POC.

---

## ADR-017 — OpsFlow web visual language (Phase 4)

**Decision:** Product UI uses Geist + cool zinc neutrals + a single teal accent (`#0f766e`), Phosphor icons, and Tailwind v4 tokens. No AI-purple gradients and no warm cream/terracotta palette.

**Reason:** TasteSkill anti-slop guidance plus OpsFlow’s B2B operations-dashboard brief. Teal reads as operational/trustworthy without looking templated.

**Trade-off:** Dark sidebar + light content is a deliberate command-center split; charts in Phase 6 must stay on the same accent lock.

**Future:** Theme toggle (`ui.theme`) exists in Redux but light product theme is the Phase 4 default.

---

## ADR-018 — Client-derived analytics with count queries + sample

**Decision:** KPI/status/priority totals use lightweight `X-Total-Count` queries (`_limit=1`). Trend and agent-performance charts use a capped job sample (~1.2k–1.5k newest jobs). SLA% is computed from completed jobs in that sample.

**Reason:** JSON Server has no aggregation API (ADR-008). Loading all 10k jobs for every dashboard view would hurt UX without proving frontend architecture.

**Trade-off:** Trend/agent charts are sample-based; donut totals are full-dataset accurate. Documented in the Analytics UI.

**Future:** Production backend can expose `/analytics` aggregates without changing chart components much.

---

## ADR-019 — Evidence-driven performance (Phase 8)

**Decision:** Optimize only measured hot paths. Prefer request dedupe/cache, smaller samples, lazy routes, and selective memoization. Do not virtualize the paginated jobs table.

**Reason:** Spec §22–§23 / Phase 8 require justified optimizations. Jobs already page at 20 rows; Recharts and repeated count queries were the real costs.

**Trade-off:** TTL cache (30–45s) can show briefly stale KPI totals until expiry or a job mutation clears the cache.

**Future:** Replace client count fan-out with backend aggregates when a real API exists.

---

## ADR-020 — React Native CLI field-agent app (Phase 9)

**Decision:** Ship a React Native CLI app with React Navigation native stack, `FlatList` (not `.map`), pull-to-refresh, and a modal bottom-sheet for status updates. Default demo agent is `agent-001`. Android emulator uses `10.0.2.2` for API host. Enable RN Strict TypeScript API (`customConditions: react-native-strict-api`) and pin mobile `@types/react` to `19.1.1` so monorepo web `@types/react@19.2.x` does not break RN JSX typing.

**Reason:** Spec requires RN CLI (no Expo) and FlatList for large lists, sharing the web REST contract. Newer `@types/react` + classic RN host-component types fail `tsc` in this workspace.

**Trade-off:** No auth; agent scoping is a hardcoded POC filter. Physical devices need the LAN IP instead of localhost/10.0.2.2. Mobile and web may temporarily diverge on `@types/react` patch versions.

**Future:** Replace demo agent id with authenticated agent profile; revisit type pins when RN/web React types align.

---

## ADR-021 — Vitest + Playwright + Jest for Phase 10 testing

**Decision:** Use Vitest + Testing Library for web unit/component tests, Playwright for one critical Jobs E2E flow, and the existing React Native Jest preset for practical mobile Redux/UI tests. Document commands in `docs/TESTING.md`.

**Reason:** Spec requires utility, Redux, component, critical E2E, and mobile-where-practical coverage without standing up a heavy QA platform for a POC.

**Trade-off:** E2E depends on seeded JSON Server + Next; CI wiring lands in Phase 11.

**Future:** Expand E2E to create/edit job and agents flows; add MSW for isolated service tests if API flakiness appears.

---

## ADR-022 — GitHub Actions quality pipeline (Phase 11)

**Decision:** Add root `npm run ci` (lint → format:check → typecheck → unit tests → web build) and a GitHub Actions workflow with a `quality` job plus a dependent Playwright `e2e` job. Document in `docs/CI.md`.

**Reason:** Spec requires lint, format checks, typecheck, tests, production build, and GitHub Actions for the POC delivery pipeline.

**Trade-off:** Format check covers the web app (Prettier). Mobile relies on ESLint; RN Prettier defaults differ from web. E2E runs after quality succeeds to keep the main gate focused.

**Future:** Cache Next/Playwright more aggressively; add mobile Detox/Maestro only if demo automation is required.

---

## ADR-023 — Vercel web + Render API for Phase 12

**Decision:** Deploy the Next.js web app to **Vercel** (`apps/web` root directory, monorepo install/build) and the JSON Server API to **Render** via `render.yaml` + `api/server.mjs` (`start:prod`, `PORT`-aware, no `--watch`). Mobile remains local-only with screenshots/video. Presentation assets live in `docs/PRESENTATION.md` and `docs/screenshots/`.

**Reason:** Spec requires a deployed web app and a verifiable public API without building a production backend.

**Trade-off:** Render free-tier cold starts; live URLs require the evaluator’s Vercel/Render/GitHub accounts if not yet connected. `NEXT_PUBLIC_API_BASE_URL` must be set on Vercel after the API URL exists.

**Future:** Swap JSON Server for Express/Nest while keeping the same REST contract; add preview env wiring in CI.

---

## How to add new decisions

When a material choice is made during later phases, append a new ADR with the same structure. Do not silently change architecture without approval (Cursor Rule 3).
