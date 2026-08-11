# OpsFlow — Performance Notes (Phase 8)

> Measure first. Optimize only with a reason. Skip cargo-cult memoization.

## Baseline observations

| Hot path | Observation | Risk |
|----------|-------------|------|
| Dashboard / Analytics | Multiple `_limit=1` count queries + large job sample + Recharts | Slow first paint; duplicate status fetches |
| Jobs page | Paginated (20) + debounced search already in place | Re-fetching 500 agents/customers on every visit |
| Agent/Customer drawers | 6+ count queries + related list | Noticeable open latency |
| Design system / Analytics bundles | Recharts + gallery UI | Inflates initial JS if loaded eagerly |
| Jobs table | 20 rows / page | Virtualization not justified |

## Optimizations applied

### 1. Short TTL query cache (`lib/queryCache.ts`)

**Why:** Navigating Dashboard → Analytics (or reopening the same agent drawer) repeated identical count/sample requests.

**What:** 30s TTL for counts/KPI/entity stats; 45s for analytics samples. Cleared on job create/update/delete/bulk mutations so KPIs stay honest.

### 2. Deduplicate status totals

**Why:** Dashboard/Analytics called `fetchJobsKpiCounts()` and `fetchStatusCounts()` (which re-ran KPI counts).

**What:** Derive status donut data with `statusCountsFromKpis(counts)`.

### 3. Smaller analytics sample (800 jobs)

**Why:** 1.2k–1.5k newest jobs was enough for trends but heavier than needed for POC charts.

**What:** Default sample size 800. Trends remain useful; UI copy still discloses sample-based metrics.

### 4. Fewer entity-stat round-trips

**Why:** Drawers issued a redundant total count plus five status counts.

**What:** Five status counts; `total` is the sum. Completed sample page size reduced to 80 for SLA.

### 5. Skip redundant reference-data fetches

**Why:** Jobs/Dashboard/Analytics always re-fetched agents (and jobs also customers) even when Redux already held them.

**What:** Fetch only when `agents.length === 0` / `customers.length === 0`.

### 6. Route-level lazy loading

**Why:** Recharts and the design-system gallery are heavy and not needed on first paint of other routes.

**What:** `next/dynamic` for `/dashboard`, `/analytics`, `/design-system` with skeleton fallbacks.

### 7. Memoized lookup maps + memoized table

**Why:** Jobs page rebuilt `agentsById`/`customersById` and re-rendered the table when unrelated modal/drawer state changed.

**What:**
- `selectAgentsById` / `selectCustomersById` via `createSelector`
- `React.memo(JobsTable)`
- `useCallback` for `openJob` / `closeDetails` so memo can skip

### 8. Existing controls kept (already justified)

- Debounced search (350ms)
- Server pagination (`_page` / `_limit`)
- Memoized jobs pagination selector
- Dashboard KPI `useMemo` for derived chart series

## Explicitly skipped

| Technique | Why skipped |
|-----------|-------------|
| Table virtualization | Jobs render ≤20 rows per page; cost > benefit |
| Blanket `useMemo`/`useCallback` | Spec forbids cargo-cult usage; only referential stability / expensive derives |
| Service-worker caching | Out of POC scope |
| Aggregated `/analytics` API | Would add backend complexity (ADR-008 / ADR-018) |

## How to re-check

```bash
npm run api
npm run web
# Network tab: open /dashboard then /analytics — cached KPI/sample hits within TTL
# Jobs: open/close create modal — table should not thrash if selection unchanged
```
