#!/usr/bin/env bash
set -e
exec uvicorn main:app --host 0.0.0.0 --port "${PORT:-10000}"
