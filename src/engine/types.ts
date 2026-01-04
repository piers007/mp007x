// src/engine/types.ts

// ------------------------------
// Core enums / primitives
// ------------------------------

export type Verdict = "BUY" | "HOLD" | "WAIT";

export type Strength = "HIGH" | "MED" | "LOW";

export type Side = "bid" | "ask";

export type MomentumState = "ignition" | "continuation" | "exhaustion" | "neutral";

export type Trend = "bullish" | "bearish" | "neutral";

// ------------------------------
// EngineSnapshot (top-level, home cards)
// ------------------------------

export type TrimSignal = {
  /** Trim Intensity Score 0–100 */
  tis: number;
  /** Suggested trim % of initial position (0–100) */
  suggestedTrimPct: number;
  /** Next trim window label, e.g. "18m" */
  nextWindow: string | null;
  /** English rationale displayed in Trim card */
  english: string;
};

export type EngineSnapshot = {
  ticker: string;
  verdict: Verdict;

  /** One-line headline used under ticker */
  headline: string;

  /** Approx/last price used in cards */
  price: number;

  /** Probability price goes up in next horizon (0–1) */
  p_up: number;

  /** Expectancy value in R-units (can be negative) */
  ev: number;

  /** Tier (1..N) */
  tier: number;

  /** Suggested size % (0..100) */
  sizePct: number;

  /** Bullet list for quick scan */
  bullets: string[];

  /** Trim module summary for cards */
  trim: TrimSignal;
};

// ------------------------------
// EngineOutput (detailed / expanded cards)
// ------------------------------

export type PriceZone = {
  low: number;
  high: number;
  label?: string | null;
};

export type EntryOutput = {
  /** bullish/bearish/neutral as string for badge */
  entryBias: string;
  idealEntry: PriceZone | null;
  invalidation: number | null;
  english: string;
};

export type TargetOutput = {
  tp1: number | null;
  tp2: number | null;
  tp3: number | null;

  /** runner / massive breakout mode */
  massiveBreakout: boolean;

  /** 0–100 integer probability */
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
  side: Side; // "bid" | "ask"
  price: number;
  strength: number; // 0..1
};

export type LiquidityWall = {
  side: Side;
  price: number;
  strength: number; // 0..1
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
};

// ------------------------------
// Network response shape (front end expects this)
// ------------------------------

export type EngineFetchResult = {
  snap: EngineSnapshot;
  out: EngineOutput;
};

// ------------------------------
// Backward-compat alias (legacy UI imports)
// ------------------------------
// Some UI modules still import AnalyzeResponse.
// Keep this alias so older components compile.
export type AnalyzeResponse = {
  snap: EngineSnapshot;
  out: EngineOutput;
};
