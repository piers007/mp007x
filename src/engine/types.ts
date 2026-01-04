// src/engine/types.ts
// Knox 007 — Engine Contract Types
// LOCKED compat layer to prevent TS drift between UI, mocks, and backend

/* =========================
   Core Enums / Primitives
========================= */

export type Verdict = "BUY" | "HOLD" | "WAIT";
export type Trend = "UP" | "DOWN" | "RANGE";
export type Bias = "BULLISH" | "BEARISH" | "NEUTRAL";

/* =========================
   Snapshot (Top-level UI)
========================= */

export interface EngineSnapshot {
  ticker: string;
  price: number;

  verdict: Verdict;
  p_up: number;
  ev: number;
  tier: number;
  sizePct: number;

  headline: string;
  bullets: string[];

  // 🔒 Required by UI cards
  trim: TrimSignal;

  // 🔒 Added for UI + mocks
  runner?: RunnerCompat;
  delta?: DeltaCompat;
}

/* =========================
   Output (Detail Panels)
========================= */

export interface EngineOutput {
  entry: EntryBlock;
  structure: StructureBlock;
  momentum: MomentumBlock;
  liquidity: LiquidityBlock;
  targets: TargetsBlock;

  // 🔒 Required by mocks
  runner?: RunnerCompat;
  delta?: DeltaCompat;
}

/* =========================
   Entry
========================= */

export interface EntryBlock {
  entryBias: Bias;
  idealEntry?: {
    low: number;
    high: number;
    label?: string;
  };
  invalidation?: number;
  english: string;
}

/* =========================
   Structure
========================= */

export interface StructureBlock {
  structureValid: boolean;
  trend: Trend;
  keyLevel?: number;
  english: string;
}

/* =========================
   Momentum
========================= */

export interface MomentumBlock {
  state: "ignition" | "continuation" | "exhaustion" | "neutral";
  sigmaRegime?: string;
  english: string;
}

/* =========================
   Liquidity
========================= */

export interface LiquidityBlock {
  english: string;
  shelves?: Array<{
    side: "bid" | "ask";
    price: number;
    strength: number;
  }>;
  walls?: Array<{
    side: "bid" | "ask";
    price: number;
    strength: number;
  }>;
}

/* =========================
   Targets / Runner
========================= */

export interface TargetsBlock {
  tp1?: number;
  tp2?: number;
  tp3?: number;

  massiveBreakout: boolean;
  runnerProbability: number;

  english: string;
}

/* =========================
   Trim
========================= */

export interface TrimSignal {
  tis: number; // Trim Intensity Score
  suggestedTrimPct: number;
  nextWindow?: string;
  english: string;

  // 🔒 mocks include this
  mode?: "TRIM" | "HOLD";
}

/* =========================
   Runner (COMPAT)
========================= */

export interface RunnerCompat {
  probability: number;

  // 🔒 seen in mocks
  runnerProbability?: number;
  runnerMode?: boolean;
  addOnPermission?: boolean;
}

/* =========================
   Delta / Order Flow (COMPAT)
========================= */

export interface DeltaCompat {
  state?: string;

  // 🔒 both spellings supported to stop TS errors
  KScore?: number;
  Kscore?: number;
}

/* =========================
   Backward Compatibility
========================= */

// Older UI imports this name
export type AnalyzeResponse = {
  snap: EngineSnapshot;
  out: EngineOutput;
};
