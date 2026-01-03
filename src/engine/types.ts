/**
 * Knox 007 — Contract Types (canonical)
 * Goal: keep frontend stable while backend evolves.
 * This file is the single source of truth for snapshot shape.
 */

/* ---------- Shared small types ---------- */

export type Bias = "BULLISH" | "BEARISH" | "NEUTRAL" | "HOLD" | string;

export type ZoneStrength = "HIGH" | "MED" | "LOW" | string;

export type ZoneEntry = {
  price: number;
  label?: string;
  strength?: ZoneStrength;
};

export type StopZone = {
  price: number;
  label?: string;
};

export type TargetZone = {
  price: number;
  label?: string;
};

export type ZonesBlock = {
  entry?: ZoneEntry[];
  stop?: StopZone;
  targets?: TargetZone[];
};

export type DecisionBlock = {
  bias?: Bias;
  tier?: number;

  /** Prob up: 0..1 (preferred) */
  p_up?: number;

  /** Expected value ratio */
  ev?: number;

  /** Suggested position size percent */
  sizePct?: number;

  /** Confidence percent 0..100 */
  confidence?: number;

  /** Bullet reasoning lines */
  bullets?: string[];
};

export type TrimSignal = {
  /** Trim Intensity Score 0..100 */
  tis?: number;

  /** Next window in minutes */
  nextWindowMin?: number;

  /** Suggested trim percent of initial */
  suggestedPct?: number;

  /** Optional: human-readable window label */
  nextTrimWindow?: string;
};

export type StructureBlock = {
  /** 0..1 health score (preferred) */
  health?: number;

  /** Human / enum status e.g. STRUCTURE_OK | STRUCTURE_FAIL */
  status?: string;

  /** Optional notes */
  notes?: string[];
};

export type LiquidityBlock = {
  state?: string;
  voidZones?: number;
  absorptionShelves?: number;
};

export type MomentumBlock = {
  state?: string;
  orderbook?: string;
};

/* ---------- Canonical snapshot ---------- */

/**
 * EngineSnapshot = the payload our UI renders.
 * Backend should return this (or superset).
 */
export type EngineSnapshot = {
  ticker?: string;
  headline?: string;

  decision?: DecisionBlock;
  zones?: ZonesBlock;
  trim?: TrimSignal;

  structure?: StructureBlock;
  liquidity?: LiquidityBlock;
  momentum?: MomentumBlock;

  /** Allow backend to add fields without breaking builds */
  [k: string]: unknown;
};

/**
 * EngineOutput = legacy alias used by UI stack.
 * We keep it as the same shape as EngineSnapshot to prevent
 * cascading TS breakage in cards and pages.
 */
export type EngineOutput = EngineSnapshot;

/* ---------- Optional: helpers for strict consumers ---------- */

export function normalizeSnapshot(input: any): EngineSnapshot {
  // Shallow normalize so UI never explodes on missing blocks.
  const snap: EngineSnapshot = (input ?? {}) as EngineSnapshot;

  if (typeof snap.decision?.p_up === "number" && snap.decision.p_up > 1) {
    // If backend sends percent (0..100), convert to 0..1
    snap.decision.p_up = snap.decision.p_up / 100;
  }

  return snap;
}
