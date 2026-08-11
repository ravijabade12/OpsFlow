#!/usr/bin/env bash
# Vercel install helper — keep apps/web/vercel.json installCommand short (≤256 chars).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

npm ci
npm install --no-save --workspace=@opsflow/web \
  lightningcss-linux-x64-gnu@1.32.0 \
  lightningcss-linux-x64-musl@1.32.0

mkdir -p apps/web/node_modules

if [ -d node_modules/lightningcss-linux-x64-gnu ]; then
  cp -a node_modules/lightningcss-linux-x64-gnu apps/web/node_modules/
fi

if [ -d node_modules/lightningcss-linux-x64-musl ]; then
  cp -a node_modules/lightningcss-linux-x64-musl apps/web/node_modules/
fi
