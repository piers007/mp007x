# Knox 007 — React Starter (v0.1)

This is a **mobile-first, cards-first** React + TypeScript starter for Knox 007.

## Stack
- Vite + React + TS
- Tailwind (optional) + Knox morphism CSS tokens
- Zustand (state)
- Framer Motion (micro-motion)
- Lightweight Charts (optional, chart not default)

## Run (local)
```bash
npm install
npm run dev
```

## Core rule
- **Math engine lives outside UI** (future `/src/engine/math/*`).
- UI consumes only the backend contract: `POST /v1/analyze`.

## What you get
- Dashboard page
- Ticker input (Enter to add)
- Watchlist strip
- Card stack: Structure / Entry / Momentum / Trim (TIS) / Targets / Liquidity

## Next
Wire `VITE_API_BASE_URL` to your Render backend.
