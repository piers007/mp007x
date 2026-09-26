#!/usr/bin/env bash
# Idempotent bootstrap for the Knox 007 full-stack app (FastAPI backend + Vite/React frontend).
set -euo pipefail

cd "$(dirname "$0")/.."

# --- Backend: Python virtualenv + dependencies ---
# python3-venv is required to create the virtualenv; install it if the base image lacks it.
if ! python3 -m venv --help >/dev/null 2>&1; then
  sudo apt-get update -qq
  sudo apt-get install -y -qq python3-venv
fi

if [ ! -d .venv ]; then
  python3 -m venv .venv
fi

# shellcheck disable=SC1091
. .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# --- Frontend: Node dependencies ---
npm install

# --- Frontend env: point the browser app at the local backend ---
# Only create .env if absent so a developer's overrides are preserved.
if [ ! -f .env ]; then
  echo "VITE_API_BASE=http://localhost:8000" > .env
fi
