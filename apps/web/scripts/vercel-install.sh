#!/usr/bin/env bash
# Vercel install helper — Tailwind/lightningcss native bindings for Linux.
# Keep apps/web/vercel.json installCommand short (≤256 chars).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

npm ci

# npm ci on a Windows-generated lockfile often omits Linux optional natives
# under nested apps/web/node_modules (npm/cli#4828). Install them in-place.
cd apps/web
npm install --no-package-lock --no-save \
  "@tailwindcss/oxide-linux-x64-gnu@4.3.3" \
  "@tailwindcss/oxide-linux-x64-musl@4.3.3" \
  "lightningcss-linux-x64-gnu@1.32.0" \
  "lightningcss-linux-x64-musl@1.32.0"

echo "Native packages present:"
ls -d node_modules/@tailwindcss/oxide-linux-x64-* 2>/dev/null || true
ls -d node_modules/lightningcss-linux-x64-* 2>/dev/null || true
