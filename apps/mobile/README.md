# OpsFlow Mobile (Field Agent)

React Native **CLI** app (no Expo) for field agents.

## Prerequisites

- Node ≥ 22.11
- Android Studio / SDK (for Android)
- JSON Server running from repo root: `npm run api`

## Run

```bash
# from monorepo root
npm install
npm run api

# Metro
npm run mobile

# Android (separate terminal)
npm run mobile:android
```

### API URL note

- iOS simulator: `http://localhost:3001`
- Android emulator: `http://10.0.2.2:3001` (auto-mapped in `src/services/apiConfig.ts`)

## Scope (Phase 9)

- Jobs list via `FlatList` + pull-to-refresh + infinite scroll
- Job details
- Status update via bottom-sheet style modal
- Redux Toolkit thunks against the shared REST API
- Loading / error / empty states

Demo agent filter defaults to `agent-001` (no auth in POC).
