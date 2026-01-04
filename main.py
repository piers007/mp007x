from __future__ import annotations

import os
from datetime import datetime, timezone
from typing import Any, Dict, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

ENGINE_REV = os.getenv("ENGINE_REV", "r000")
CONTRACT_VERSION = "1.0"

app = FastAPI(title="Knox 007 Backend", version=CONTRACT_VERSION)

# CORS (safe default). You can tighten later.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalyzeRequest(BaseModel):
    ticker: str = Field(..., min_length=1, max_length=10)
    as_of: Optional[str] = None  # ISO string from client
    mode: str = "INTRADAY"       # INTRADAY|SWING etc (future-proof)


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


@app.get("/health")
def health() -> Dict[str, Any]:
    return {
        "ok": True,
        "service": "knox-007-backend",
        "engine_rev": ENGINE_REV,
        "contract_version": CONTRACT_VERSION,
        "ts": now_iso(),
    }

@app.get("/api/health")
def health():
    return {"ok": True}
    
@app.get("/v1/schema")
def schema() -> Dict[str, Any]:
    # Minimal schema descriptor (useful for UI sanity checks).
    return {
        "contract_version": CONTRACT_VERSION,
        "engine_rev": ENGINE_REV,
        "endpoints": {
            "analyze": {"method": "POST", "path": "/v1/analyze"},
            "health": {"method": "GET", "path": "/health"},
            "schema": {"method": "GET", "path": "/v1/schema"},
        },
        "notes": [
            "This schema is a helper. Canonical contract fields are returned by /v1/analyze.",
        ],
    }


@app.post("/v1/analyze")
def analyze(req: AnalyzeRequest) -> Dict[str, Any]:
    t = (req.ticker or "").strip().upper()
    if not t.isalnum():
        raise HTTPException(
            status_code=400,
            detail={"error": {"code": "INVALID_TICKER", "message": "Ticker must be alphanumeric.", "retry_after_sec": 0}},
        )

    as_of = req.as_of or now_iso()

    # ---- MOCK ENGINE OUTPUT (contract-accurate) ----
    # Replace internals later with real engine math; do NOT break shape.

    # Example: simple deterministic pseudo-values by ticker length
    base = float(len(t)) * 1.25 + 10.0

    entry_price = round(base, 2)
    stop_price = round(base * 0.92, 2)
    tp1 = round(base * 1.08, 2)
    tp2 = round(base * 1.15, 2)
    tp3 = round(base * 1.24, 2)

    tis = 62  # triggers trim box per contract rule >= 60
    next_trim_window_sec = 18 * 60

    payload = {
        "contract_version": CONTRACT_VERSION,
        "engine_rev": ENGINE_REV,
        "ticker": t,
        "as_of": as_of,

        "decision": {
            "state": "HOLD",
            "bias": "BULLISH",
            "confidence": 0.61,
            "p_up": 0.57,
            "ev_r": 0.22,
            "tier": 2,
            "size_pct": 18.0,
            "pillar_agreement": 4
        },

        "zones": {
            "entry": [
                {"price": entry_price, "strength": "HIGH", "why": "VWAP cluster + pivot confluence (mock)"},
                {"price": round(entry_price * 0.985, 2), "strength": "MED", "why": "Gap shelf retest (mock)"}
            ],
            "take_profit": [
                {"price": tp1, "trim_pct_of_initial": 18.0, "reason": "TP1 / first harvest", "tis": tis},
                {"price": tp2, "trim_pct_of_initial": 22.0, "reason": "TP2 / extension harvest", "tis": tis},
                {"price": tp3, "trim_pct_of_initial": 30.0, "reason": "TP3 / runner capture", "tis": tis}
            ],
            "stop": {"price": stop_price, "stop_mult": 1.15, "reason": "Structure invalidation (mock)"},
            "extension": {"runner_mode": True, "target": round(tp3 * 1.08, 2), "reason": "If trend holds + rotation stays elevated (mock)"}
        },

        "trim": {
            "tis": tis,
            "next_trim_window_sec": next_trim_window_sec,
            "trim_box": {
                "active": True,
                "suggested_trim_pct_of_initial": 12.0,
                "reason": "TIS>=60 — harvest into momentum, protect core"
            }
        },

        "structure": {
            "structure_health": 0.66,
            "exit_only_if": "STRUCTURE_FAIL",
            "fail_reasons": []
        },

        "flow": {
            "delta_state": "ACCELERATING",
            "orderbook_state": "BID_DOMINANT",
            "liquidity_map": {
                "void_zones": [],
                "absorption_shelves": []
            }
        },

        "explain": {
            "bullets": [
                "Bias bullish while structure health > 0.55 (mock).",
                "Trim box active (TIS>=60) — harvest in momentum only (mock).",
                "Exit only allowed on structure failure (contract rule)."
            ],
            "vetoes": [],
            "top_drivers": [
                {"name": "Structure Health", "score": 0.66, "direction": 1},
                {"name": "Trim TIS", "score": float(tis) / 100.0, "direction": 1},
                {"name": "Orderbook State", "score": 0.58, "direction": 1},
            ]
        }
    }

    return payload
