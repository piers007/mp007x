#!/usr/bin/env bash

echo "Starting Knox 007 Backend..."
uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
