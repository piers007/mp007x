from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import List, Literal, Optional
from pydantic import BaseModel

# ------------------------------------------------------------------------------
# App
# ------------------------------------------------------------------------------

app = FastAPI(
    title="Knox 007 Backend",
    version="1.0.0",
    description="Knox Engine backend – intraday snapshot API",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------------------------------------------------
# Types (MUST MATCH FRONTEND)
# ------------------------------------------------------------------------------

TrendState = Literal["BULL", "NEUTRAL", "BEAR"]
NextTrimWindow = Literal["NOW", "SOON", "WAIT"]
StatusColor = Literal["green", "yellow", "red"]

class TrimRecommendation(BaseModel):
    tis: int                           # 0–100
    nextTrimWindow: NextTrimWindow
    trimNowPctOrig: Optional[int] = None
    harvestPct: Optional[int] = None
    reasons: List[str]

class BuyZone(BaseModel):
    low: float
    high: float

class TakeProfit(BaseModel):
    price: float
    pct: float

class EngineSnapshot(BaseModel):
    ticker: str
    timestamp: str

    price: float
    trend: TrendState
    status: StatusColor

    confidence: int                   # 0–100
    probabilityUp: float              # 0–1

    buyZones: List[BuyZone]
    takeProfits: List[TakeProfit]

    trim: TrimRecommendation

# ------------------------------------------------------------------------------
# Routes
# ------------------------------------------------------------------------------

@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "service": "knox-007-backend",
        "time": datetime.utcnow().isoformat(),
    }

@app.get("/api/007/snapshot", response_model=EngineSnapshot)
def get_engine_snapshot(ticker: str = "AAPL"):
    """
    Intraday engine snapshot.
    Replace internals with real math later.
    """

    # --- MOCK ENGINE OUTPUT (INTENTIONAL) ---
    # This is deterministic, realistic, and UI-safe.

    snapshot = EngineSnapshot(
        ticker=ticker.upper(),
        timestamp=datetime.utcnow().isoformat(),

        price=187.42,
        trend="BULL",
        status="green",

        confidence=82,
        probabilityUp=0.74,

        buyZones=[
            BuyZone(low=184.80, high=185.60),
            BuyZone(low=182.10, high=183.00),
        ],

        takeProfits=[
            TakeProfit(price=190.00, pct=8),
            TakeProfit(price=195.00, pct=18),
            TakeProfit(price=205.00, pct=32),
        ],

        trim=TrimRecommendation(
            tis=64,
            nextTrimWindow="SOON",
            trimNowPctOrig=20,
            harvestPct=6,
            reasons=[
                "Order book thinning on ask",
                "Delta acceleration slowing",
                "Extension > VWAP + 2.1σ",
            ],
        ),
    )

    return snapshot
