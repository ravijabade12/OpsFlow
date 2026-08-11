# OpsFlow testing notes (Phase 10)

## Stack

| Layer | Tool | Scope |
|-------|------|--------|
| Web unit/component | Vitest + Testing Library | Utils, Zod schema, Redux jobs slice/selectors, Button/EmptyState/badges |
| Web E2E | Playwright (Chromium) | Critical Jobs flow against live JSON Server + Next.js |
| Mobile | Jest (RN preset) | jobsSlice reducers/selectors, Status/Priority badges |

## Commands

```bash
# Unit + component (web) and Jest (mobile)
npm test

# Web only
npm run web:test

# Critical Jobs E2E (starts API + Next if not already running)
npm run web:test:e2e

# Mobile only
npm run mobile:test
```

## E2E prerequisites

- Seeded `api/db.json` (`npm run api:seed` if missing)
- Chromium for Playwright (`npx playwright install chromium` from `apps/web` once)
- Playwright starts JSON Server + Next on `127.0.0.1` and sets `NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:3001` so the browser and API share an origin host

## Coverage intent (POC)

Prefer high-signal tests over volume: pure helpers, jobs Redux behavior, a few presentational components, one end-to-end jobs path, and practical mobile Redux/UI smoke tests.

## CI

See [`docs/CI.md`](./CI.md) for the local `npm run ci` gate and GitHub Actions workflow (Phase 11).
