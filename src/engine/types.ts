// src/engine/types.ts

// ------------------------------
// Core enums / primitives
// ------------------------------

export type Verdict = "BUY" | "HOLD" | "WAIT";

export type Strength = "HIGH" | "MED" | "LOW";

export type Side = "bid" | "ask";

export type MomentumState =
  | "ignition"
  | "continuation"
  | "exhaustion"
  | "neutral";

export type Trend =
  | "bullish"
  | "bearish"
  | "neutral"
  | "up"     // legacy
  | "down";  // legacy

// ------------------------------
// Legacy compat shapes (for mocks)
// ------------------------------

export type RunnerCompat = {
  probability: number;
  /** legacy field some mocks use */
  runnerProbability?: number;
};

export type DeltaCompat = {
  state: string;
  /** legacy field some mocks use */
  KScore?: number;
};

// ------------------------------
// EngineSnapshot (home + legacy)
// ------------------------------

export type TrimSignal = {
  /** Trim Intensity Score 0–100 */
  tis: number;

  /** Suggested trim % of initial position */
  suggestedTrimPct: number;

  /** Next trim window label */
  nextWindow: string | null;

  /** Human explanation */
  english: string;

  /** LEGACY (used by mock tests) */
  mode?: string;
};

export type EngineSnapshot = {
  ticker: string;
  verdict: Verdict;
  headline: string;
  price: number;
  p_up: number;
  ev: number;
  tier: number;
  sizePct: number;
  bullets: string[];
  trim: TrimSignal;

  // --------------------
  // LEGACY SNAPSHOT FIELDS
  // --------------------
  runner?: RunnerCompat;
  delta?: DeltaCompat;
};

// ------------------------------
// EngineOutput (expanded view)
// ------------------------------

export type PriceZone = {
  low: number;
  high: number;
  label?: string | null;
};

export type EntryOutput = {
  entryBias: string;
  idealEntry: PriceZone | null;
  invalidation: number | null;
  english: string;
};

export type TargetOutput = {
  tp1: number | null;
  tp2: number | null;
  tp3: number | null;
  massiveBreakout: boolean;
  runnerProbability: number;
  english: string;
};

export type MomentumOutput = {
  state: MomentumState;
  sigmaRegime: string | null;
  english: string;
};

export type StructureOutput = {
  structureValid: boolean;
  trend: Trend;
  keyLevel: number | null;
  english: string;
};

export type LiquidityShelf = {
  side: Side;
  price: number;
  strength: number;
};

export type LiquidityWall = {
  side: Side;
  price: number;
  strength: number;
};

export type LiquidityOutput = {
  english: string;
  shelves?: LiquidityShelf[];
  walls?: LiquidityWall[];
};

export type EngineOutput = {
  structure: StructureOutput;
  entry: EntryOutput;
  momentum: MomentumOutput;
  liquidity: LiquidityOutput;
  targets: TargetOutput;

  // --------------------
  // LEGACY OUTPUT FIELD (mock uses out.runner)
  // --------------------
  runner?: RunnerCompat;
};

// ------------------------------
// Network + legacy aliases
// ------------------------------

export type EngineFetchResult = {
  snap: EngineSnapshot;
  out: EngineOutput;
};

export type AnalyzeResponse = {
  snap: EngineSnapshot;
  out: EngineOutput;
};
