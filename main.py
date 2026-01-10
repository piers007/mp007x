from __future__ import annotations

import os
from datetime import datetime, timezone
from typing import Any, Dict, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# -------------------------------------------------
# Metadata
# -------------------------------------------------
ENGINE_REV = os.getenv("ENGINE_REV", "r001-lfrs")
CONTRACT_VERSION = "1.1"

app = FastAPI(
    title="Knox 007 Backend",
    version=CONTRACT_VERSION,
)

# -------------------------------------------------
# CORS (safe default – tighten later)
# -------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------
# Models
# -------------------------------------------------
class AnalyzeRequest(BaseModel):
    ticker: str = Field(..., min_length=1, max_length=10)
    as_of: Optional[str] = None
    mode: str = "INTRADAY"  # INTRADAY | SWING (stocks only)


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


# -------------------------------------------------
# Health
# -------------------------------------------------
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
def api_health():
    return {"ok": True}


# -------------------------------------------------
# Schema helper
# -------------------------------------------------
@app.get("/v1/schema")
def schema() -> Dict[str, Any]:
    return {
        "contract_version": CONTRACT_VERSION,
        "engine_rev": ENGINE_REV,
        "endpoints": {
            "analyze": {"method": "POST", "path": "/v1/analyze"},
            "health": {"method": "GET", "path": "/health"},
            "schema": {"method": "GET", "path": "/v1/schema"},
        },
        "notes": [
            "Stocks only",
            "Spot long only",
            "No options, no futures",
            "Low Float Risk Score (LFRS) enabled",
        ],
    }


# -------------------------------------------------
# ANALYZE (CORE)
# -------------------------------------------------
@app.post("/v1/analyze")
def analyze(req: AnalyzeRequest) -> Dict[str, Any]:
    # ---------------------------
    # Validate ticker
    # ---------------------------
    t = (req.ticker or "").strip().upper()
    if not t.isalnum():
        raise HTTPException(
            status_code=400,
            detail={
                "error": {
                    "code": "INVALID_TICKER",
                    "message": "Ticker must be alphanumeric.",
                    "retry_after_sec": 0,
                }
            },
        )

    as_of = req.as_of or now_iso()

    # -------------------------------------------------
    # MOCK MARKET DATA (deterministic placeholder)
    # -------------------------------------------------
    base = float(len(t)) * 1.25 + 10.0

    entry_price = round(base, 2)
    stop_price = round(base * 0.92, 2)
    tp1 = round(base * 1.08, 2)
    tp2 = round(base * 1.15, 2)
    tp3 = round(base * 1.24, 2)

    tis = 62
    next_trim_window_sec = 18 * 60

    # -------------------------------------------------
    # STEP 1 — LFRS (Low Float Risk Score)
    # STOCKS ONLY • SPOT ONLY
    # -------------------------------------------------

    # ⚠️ MOCK INPUTS — replace with real data feeds later
    float_shares = 12_500_000          # shares
    volume_today = 6_200_000
    adv30 = 2_100_000
    depth_bid_total = 1_850_000
    depth_ask_total = 920_000
    atr_1m = entry_price * 0.012

    # --- Deterministic mock score ---
    rotation_ratio = volume_today / max(float_shares, 1)
    depth_ratio = depth_bid_total / max(depth_ask_total, 1)
    vol_shock = volume_today / max(adv30, 1)

    lfrs_score = min(
        100,
        int(
            rotation_ratio * 40
            + vol_shock * 30
            + depth_ratio * 30
        ),
    )

    if lfrs_score >= 70:
        lfrs_state = "EXPLOSIVE"
    elif lfrs_score >= 45:
        lfrs_state = "UNSTABLE"
    else:
        lfrs_state = "STABLE"

    lfrs_english = (
        f"Low float supply risk detected (LFRS {lfrs_score}). "
        f"Expect sharp moves, wicks, and fast extensions/failures."
        if lfrs_score >= 45
        else "Float supply appears stable."
    )

    lfrs_drivers = [
        {"name": "Float rotation", "score": round(rotation_ratio, 2)},
        {"name": "RVOL shock", "score": round(vol_shock, 2)},
        {"name": "Orderbook imbalance", "score": round(depth_ratio, 2)},
    ]

    # -------------------------------------------------
    # PAYLOAD (CONTRACT-ACCURATE)
    # -------------------------------------------------
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
            "pillar_agreement": 4,
            "lfrs": lfrs_score,
        },

        "zones": {
            "entry": [
                {
                    "price": entry_price,
                    "strength": "HIGH",
                    "why": "VWAP + pivot confluence (mock)",
                },
                {
                    "price": round(entry_price * 0.985, 2),
                    "strength": "MED",
                    "why": "Gap shelf retest (mock)",
                },
            ],
            "take_profit": [
                {
                    "price": tp1,
                    "trim_pct_of_initial": 18.0,
                    "reason": "TP1 / first harvest",
                    "tis": tis,
                },
                {
                    "price": tp2,
                    "trim_pct_of_initial": 22.0,
                    "reason": "TP2 / extension harvest",
                    "tis": tis,
                },
                {
                    "price": tp3,
                    "trim_pct_of_initial": 30.0,
                    "reason": "TP3 / runner capture",
                    "tis": tis,
                },
            ],
            "stop": {
                "price": stop_price,
                "stop_mult": 1.15,
                "reason": "Structure invalidation (mock)",
            },
            "extension": {
                "runner_mode": True,
                "target": round(tp3 * 1.08, 2),
                "reason": "If trend holds + rotation elevated (mock)",
            },
        },

        "trim": {
            "tis": tis,
            "next_trim_window_sec": next_trim_window_sec,
            "trim_box": {
                "active": True,
                "suggested_trim_pct_of_initial": 12.0,
                "reason": "TIS>=60 — harvest into momentum",
            },
        },

        "structure": {
            "structure_health": 0.66,
            "exit_only_if": "STRUCTURE_FAIL",
            "fail_reasons": [],
        },

        "flow": {
            "delta_state": "ACCELERATING",
            "orderbook_state": "BID_DOMINANT",
            "liquidity_map": {
                "void_zones": [],
                "absorption_shelves": [],
            },
            "lfrs": {
                "score": lfrs_score,
                "state": lfrs_state,
                "english": lfrs_english,
                "drivers": lfrs_drivers,
            },
        },

        "explain": {
            "bullets": [
                "Bullish bias while structure health > 0.55.",
                "Trim box active (TIS>=60).",
                f"LFRS={lfrs_score} indicates supply instability.",
            ],
            "vetoes": [],
            "top_drivers": [
                {"name": "Structure Health", "score": 0.66, "direction": 1},
                {"name": "Trim TIS", "score": tis / 100.0, "direction": 1},
                {"name": "LFRS", "score": lfrs_score / 100.0, "direction": 1},
            ],
        },
    }

    return payload
