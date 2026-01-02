// src/engine/types.ts

export type ConfidenceTier = 0 | 1 | 2 | 3 | 4;

export type NextTrimWindow = "NOW" | "SOON" | "WAIT";

export type TrimIntensity = {
  tis: number;                 // 0..100
  nextTrimWindow: NextTrimWindow;
  trimNowPctOrig?: number;     // % of ORIGINAL position (dynamic)
  harvestMode?: boolean;       // true if extension harvest mode
  reasons: string[];           // short bullet reasons
};

export type Zones = {
  buyZone: { lo: number; hi: number; rationale: string[] };
  invalidation: { price: number; rationale: string[] };
  tpLadder: Array<{ level: number; pctTrim: number; label: string; rationale: string[] }>;
};

export type Microstructure = {
  obeScore?: number;           // 0..100
  bidAskImbalance?: number;    // -1..+1
  thinAsk?: boolean;
  thinBid?: boolean;
  notes?: string[];
};

export type EngineSnapshot = {
  ticker: string;
  ts: string;                  // ISO timestamp
  price?: number;

  p_up: number;                // 0..1
  ev: number;                  // expected value (normalized)
  tier: ConfidenceTier;
  sizePct: number;             // 0..125

  zones: Zones;
  trim: TrimIntensity;
  micro: Microstructure;

  headline: string;            // 1-line decision summary
  bullets: string[];           // explanation bullets
};
