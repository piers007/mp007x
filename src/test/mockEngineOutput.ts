import type { EngineSnapshot, EngineOutput } from "../engine/types";

/**
 * Mock engine output used for UI + test rendering.
 * MUST stay contract-aligned with types.ts
 * Last synced: 2026-01-03 (Knox 007)
 */

export const mockEngineSnapshot: EngineSnapshot = {
  ticker: "SEV",
  price: 9.24,

  verdict: "HOLD", // allowed: BUY | HOLD | WAIT
  bias: "BULLISH", // allowed: BULLISH | BEARISH | NEUTRAL

  tier: 2,
  sizePct: 18,
  p_up: 0.57,
  ev: 0.22,

  headline: "Structure intact with controlled momentum",
  bullets: [
    "VWAP reclaim holding (mock)",
    "Delta acceleration present (mock)",
    "Trim box active but no forced exit"
  ],

  // Runner + delta summary (snapshot-level)
  runner: {
    probability: 42,
    mode: "NORMAL" as "NORMAL" | "EXTENSION", // UI-safe
    addOnPermission: true
  },

  delta: {
    state: "ACCELERATING",
    KScore: 72
  },

  trim: {
    tis: 62,
    suggestedTrimPct: 12,
    nextWindow: "Near VWAP extension",
    english: "Trim lightly into strength if momentum spikes"
  }
};

export const mockEngineOutput: EngineOutput = {
  entry: {
    entryBias: "LONG",
    idealEntry: {
      low: 9.05,
      high: 9.30,
      label: "BUY ZONE"
    },
    invalidation: 8.72,
    english: "Pullbacks into VWAP-confluent zone favored"
  },

  structure: {
    trend: "UP",
    structureValid: true,
    keyLevel: 8.95,
    english: "Higher-low structure intact above demand shelf"
  },

  momentum: {
    state: "continuation",
    sigmaRegime: "MID",
    english: "Momentum holding but not yet ignition"
  },

  liquidity: {
    english: "Bid absorption below with light overhead supply",
    shelves: [
      { side: "bid", price: 9.10, strength: 0.74 },
      { side: "bid", price: 8.95, strength: 0.61 }
    ],
    walls: [
      { side: "ask", price: 9.60, strength: 0.58 }
    ]
  },

  targets: {
    tp1: 9.90,
    tp2: 10.60,
    tp3: 11.20,
    massiveBreakout: false,
    runnerProbability: 42,
    english: "Trim into TP1, hold core for TP2+ only on delta continuation"
  }
};

/**
 * Combined export for legacy UI components
 */
export const mockAnalyzeResponse = {
  snap: mockEngineSnapshot,
  out: mockEngineOutput
};
