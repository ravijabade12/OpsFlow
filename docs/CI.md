# OpsFlow CI/CD (Phase 11)

## Local quality gate

```bash
npm run ci
```

Runs in order:

1. `lint` — web + mobile ESLint  
2. `format:check` — Prettier (web)  
3. `typecheck` — shared + web + mobile  
4. `test` — Vitest (web) + Jest (mobile)  
5. `build` — Next.js production build  

Optional critical E2E (starts API + Next):

```bash
npm run web:test:e2e
```

## GitHub Actions

Workflow: [`.github/workflows/ci.yml`](../.github/workflows/ci.yml)

| Job | Steps |
|-----|--------|
| `quality` | lint → format:check → typecheck → unit tests → web build |
| `e2e` | Playwright Jobs critical flow (after `quality`) |

Triggers: push to `main`/`master`, and all pull requests.

Node **22** with `npm ci` (requires committed `package-lock.json`).
