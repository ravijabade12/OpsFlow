# OpsFlow — Deployment (Phase 12)

## Targets

| Surface | Host | Notes |
|---------|------|--------|
| Web dashboard | **Vercel** | Next.js app at `apps/web` |
| Mock REST API | **Render** (Blueprint) | JSON Server + `api/db.json` |
| Mobile | Local only | No store publish; screenshots/video for the POC |

> The API remains a lightweight JSON Server by design (ADR-001). Replace later without rewriting clients.

---

## 1. GitHub repository

Git is initialized on `main` (local root commit). Create the remote and push:

```bash
# Requires GitHub CLI or a remote URL you control
gh repo create OpsFlow --private --source=. --remote=origin --push
# or:
# git remote add origin https://github.com/<you>/OpsFlow.git
# git push -u origin main
```

Ensure `package-lock.json` remains committed — CI uses `npm ci`.

---

## 2. Public API (Render)

1. Push the repo to GitHub.
2. In [Render](https://render.com): **New → Blueprint** → select the repo.
3. Confirm `render.yaml` creates `opsflow-api`.
4. After deploy, copy the public URL, e.g. `https://opsflow-api.onrender.com`.
5. Verify:

```bash
curl "https://<your-api-host>/jobs?_limit=1"
```

Expect `200` and a JSON array. Free-tier services may cold-start (30–60s).

The hosted process uses `npm run start:prod` → `api/server.mjs` (honors `PORT`, no file watch).

Local equivalent: `npm run api` → `http://localhost:3001` (watch mode).

---

## 3. Web (Vercel)

1. Import the GitHub repo in [Vercel](https://vercel.com).
2. **Root Directory:** `apps/web`
3. Enable **Include source files outside of the Root Directory in the Build Step** (needed for `@opsflow/shared`).
4. Env var:

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_API_BASE_URL` | `https://<your-render-api-host>` (no trailing slash) |

`apps/web/vercel.json` sets install/build commands for the npm workspaces monorepo.

5. Deploy. Open `/jobs` and confirm the table loads from the public API.

### CLI alternative

```bash
npx vercel link --cwd apps/web
npx vercel env add NEXT_PUBLIC_API_BASE_URL
npx vercel --prod --cwd apps/web
```

---

## 4. Mobile against a public API

In `apps/mobile/src/services/apiConfig.ts`, point the base URL at the Render host (or keep localhost / `10.0.2.2` for emulator demos). Rebuild the app for device/emulator demos.

---

## 5. URLs for the presentation

Fill in after deploy (also mirrored in `docs/PRESENTATION.md`):

| Item | URL |
|------|-----|
| GitHub | _pending_ |
| Web (Vercel) | _pending_ |
| API (Render) | _pending_ |

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Vercel build cannot resolve `@opsflow/shared` | Root Directory = `apps/web` + include files outside root; install from monorepo root |
| Vercel `lightningcss.linux-x64-gnu.node` missing | Handled by `apps/web/scripts/vercel-install.sh` (wired from `vercel.json`). Redeploy latest `main` with cache cleared. |
| Jobs page empty / CORS errors | Confirm `NEXT_PUBLIC_API_BASE_URL` matches the Render origin; JSON Server allows CORS by default |
| Render 502 on first hit | Wait for cold start; hit `/jobs?_limit=1` again |
| CI fails on `npm ci` | Commit root `package-lock.json` |
