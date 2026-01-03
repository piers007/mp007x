// src/engine/types.ts

export type Tier = 0 | 1 | 2 | 3 | 4 | 5;

export type TrimWindow = 'NOW' | 'NEXT_5M' | 'NEXT_15M' | 'NEXT_30M' | 'LATER';

export type ZoneLine = {
  label: string;
  price: number;
  pctFromPrice?: number;
  kind?: 'support' | 'resistance' | 'gap' | 'tp' | 'sl' | 'vwap' | 'pdh' | 'pdl' | 'cdh' | 'cdl';
};

export type Zones = {
  price?: number;

  // Core zones
  buyZone?: { low: number; high: number };
  support?: number;
  resistance?: number;

  // Optional level sets
  demandGaps?: ZoneLine[];
  takeProfits?: ZoneLine[];
  stopLoss?: ZoneLine;

  // Day levels
  prevDayHigh?: number;
  prevDayLow?: number;
  currDayHigh?: number;
  currDayLow?: number;

  // Any extra horizontal levels
  levels?: ZoneLine[];
};

export type TrimSignal = {
  nextTrimWindow: TrimWindow;
  trimNowPctOrig?: number;
  reasons: string[];
};

export type EntryBlock = {
  price?: number;
  stop?: number;
  invalidation?: number;
  notes?: string[];
};

export type MomentumBlock = {
  score: number; // 0–100
  notes?: string[];
};

export type StructureBlock = {
  score: number; // 0–100
  notes?: string[];
};

export type LiquidityBlock = {
  score: number; // 0–100
  notes?: string[];
};

export type TargetsBlock = {
  tp1?: number;
  tp2?: number;
  tp3?: number;
  runnerProbability?: number; // 0–1
  massiveBreakout?: boolean;
  notes?: string[];
};

export type MicroBlock = {
  mps?: number; // 0–100
  sps?: number; // 0–100
  sfi?: number; // 0–100
  spread?: number;
  imbalance?: number;
  notes?: string[];
};

export type EngineOutput = {
  // These nested blocks are what your cards expect
  entry?: EntryBlock;
  momentum?: MomentumBlock;
  structure?: StructureBlock;
  liquidity?: LiquidityBlock;
  targets?: TargetsBlock;

  // Trim card expects this
  trim: TrimSignal;

  // High-level metrics
  tis: number; // 0–100
};

export type EngineSnapshot = {
  // Your DashboardPage expects these fields directly on EngineSnapshot
  ticker: string;
  headline?: string;

  // Probabilities / EV / sizing that your page references
  p_up?: number;     // 0–1
  ev?: number;       // expected value (unitless)
  tier?: Tier;
  sizePct?: number;  // 0–100
  price?: number;

  bullets?: string[];

  zones?: Zones;

  micro?: MicroBlock;

  // Also include the full output object for card stack
  output: EngineOutput;

  // Timestamp for refresh/UX
  timestamp: string;
};
