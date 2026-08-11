#!/usr/bin/env bash
# Vercel install helper — Tailwind/lightningcss native bindings for Linux.
# Keep apps/web/vercel.json installCommand short (≤256 chars).
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# apps/web/scripts → apps/web → apps → <monorepo root>
WEB_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

if [ ! -f "$ROOT/package-lock.json" ]; then
  echo "ERROR: monorepo root not found from $SCRIPT_DIR (tried $ROOT)"
  exit 1
fi

echo "Monorepo root: $ROOT"
echo "Web app dir:   $WEB_DIR"

cd "$ROOT"
npm ci

# npm ci on a Windows-generated lockfile often omits Linux optional natives
# under nested apps/web/node_modules (npm/cli#4828). Install them in-place.
cd "$WEB_DIR"
npm install --no-package-lock --no-save \
  "@tailwindcss/oxide-linux-x64-gnu@4.3.3" \
  "@tailwindcss/oxide-linux-x64-musl@4.3.3" \
  "lightningcss-linux-x64-gnu@1.32.0" \
  "lightningcss-linux-x64-musl@1.32.0"

echo "Native packages present:"
ls -d node_modules/@tailwindcss/oxide-linux-x64-* 2>/dev/null || true
ls -d node_modules/lightningcss-linux-x64-* 2>/dev/null || true
