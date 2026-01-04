import type { EngineSnapshot, EngineOutput } from "../engine/types";

/**
 * Mock engine output used for UI + test rendering.
 * Must match current src/engine/types.ts exactly.
 */

export const mockEngineSnapshot: EngineSnapshot = {
  ticker: "SEV",
  price: 9.24,

  verdict: "HOLD", // BUY | HOLD | WAIT
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

  runner: {
    probability: 42,
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
    // IMPORTANT: entryBias is type Bias in your codebase (NOT LONG/SHORT)
    entryBias: "BULLISH",
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
    walls: [{ side: "ask", price: 9.60, strength: 0.58 }]
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
 * Legacy adapter for UI components expecting AnalyzeResponse-like shape
 */
export const mockAnalyzeResponse = {
  snap: mockEngineSnapshot,
  out: mockEngineOutput
};
