// src/engine/types.ts
// Knox 007 — Frontend contract types (v1.1)
// Goal: match UI expectations + keep engine modular + allow nulls when feeds unavailable.

export type Verdict = "BUY" | "HOLD" | "WAIT";

export type Tier = 0 | 1 | 2 | 3 | 4;

export type DeltaDirection = "up" | "down" | "flat";

export type DeltaEventType =
  | "print_disappear"
  | "print_persist"
  | "sweep_buy"
  | "sweep_sell"
  | "unknown";

export type DeltaEventClassification =
  | "bullish_ignition"
  | "bearish_exhaustion"
  | "neutral"
  | "spoof_risk";

export interface PricePoint {
  price: number;
  label?: string;
}

export interface RangeBand {
  low: number;
  high: number;
  label?: string;
}

export interface ZoneSet {
  buyZone?: RangeBand | null;
  stopZone?: RangeBand | null;
  support?: PricePoint[] | null;
  resistance?: PricePoint[] | null;
  tpLevels?: PricePoint[] | null; // TP1/2/3 etc. Always horizontal lines in UI.
}

export interface TrimSignal {
  tis: number; // 0–100
  suggestedTrimPct: number; // 0–100 (of initial position)
  mode?: "NORMAL" | "EXTENSION";
  english: string; // 1 sentence
  nextWindow?: string; // short string, e.g. "Near TP1", "Into TP2", "On pullback"
}

export interface MicroNote {
  title: string;
  value?: string;
  status?: "green" | "yellow" | "red" | "purple" | "neutral"; // UI may map colors
}

export interface MicroBlock {
  obConviction?: number; // 0–100
  obi?: number; // -1..+1
  spoofRisk?: "low" | "med" | "high";
  vacuum?: "weak" | "med" | "strong";
  notes?: MicroNote[];
  english?: string; // 1 sentence max
}

export interface StructureBlock {
  structureValid: boolean;
  trend: "up" | "down" | "range";
  keyLevel?: number | null;
  english: string;
}

export interface EntryBlock {
  entryBias: "long" | "short" | "neutral";
  idealEntry?: RangeBand | null;
  invalidation?: number | null; // stop / invalidation price
  english: string;
}

export interface MomentumBlock {
  state: "ignition" | "continuation" | "exhaustion" | "chop";
  sigmaRegime?: "calm" | "normal" | "stress" | "vacuum";
  english: string;
}

export interface LiquidityBlock {
  shelves?: Array<{ side: "bid" | "ask"; price: number; strength: number }>;
  walls?: Array<{ side: "bid" | "ask"; price: number; strength: number }>;
  english: string;
}

export interface TargetsBlock {
  // Your TargetsCard was expecting runnerProbability & massiveBreakout
  runnerProbability: number; // 0–100
  massiveBreakout: boolean;
  tp1?: number | null;
  tp2?: number | null;
  tp3?: number | null;
  english: string;
}

export interface RunnerBlock {
  runnerProbability: number; // 0–100
  runnerMode: boolean;
  addOnPermission: "NONE" | "PULLBACK_ADD" | "BREAKOUT_ADD";
  trimBias: number; // 0.75 / 0.50 / 0.35 etc
  gates?: {
    rpGte70: boolean;
    structureValid: boolean;
    obConvictionGte65: boolean;
    kGte60: boolean;
    hardVetoFree: boolean;
  };
  english: string;
}

export interface DeltaPressure {
  // Core output
  kScore: number; // 0–100

  // Multi-scale slopes (normalized)
  vDelta1k: number | null;
  vDelta5k: number | null;
  aDelta: number | null;

  // Price slope/accel for alignment (normalized)
  vPrice: number | null;
  aPrice: number | null;

  // Diagnostics (0–1)
  alignment: number | null;
  persistence: number | null;
  accelScore: number | null;
  eventScore: number | null;

  direction: DeltaDirection;
  regime: "supportive" | "mixed" | "opposing";

  lastEvent?: {
    type: DeltaEventType;
    classification: DeltaEventClassification;
    ts: string; // ISO
    magnitude?: number | null;
    notes?: string;
  };

  english: string; // 1 sentence max
}

export interface EngineSnapshot {
  // What TS errors showed were missing:
  ticker: string;
  headline: string;

  // Core headline numbers
  price: number;
  p_up: number; // 0–1 probability
  ev: number; // expected value (unitless or % depending your engine)
  tier: Tier;
  sizePct: number; // 0–100 suggested size
  verdict: Verdict;

  // Bullets for top-of-page quick read
  bullets: string[];

  // Levels/zones
  zones: ZoneSet;

  // Trim system
  trim: TrimSignal;

  // Micro / L2-L4 summary
  micro: MicroBlock;

  // Optional: when the UI needs richer grouped cards
  runner?: RunnerBlock;
  delta?: DeltaPressure;
}

export interface EngineOutput {
  // Card components were expecting these keys:
  structure: StructureBlock;
  entry: EntryBlock;
  momentum: MomentumBlock;
  liquidity: LiquidityBlock;
  targets: TargetsBlock;

  // Optional: pass-through
  runner?: RunnerBlock;
  delta?: DeltaPressure;
}
