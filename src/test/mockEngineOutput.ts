import { EngineSnapshot } from "../engine/types";

export const mockEngineOutput: EngineSnapshot = {
  ticker: "QCLS",
  headline: "QCLS — HOLD (BULLISH)",

  decision: {
    bias: "BULLISH",
    tier: 2,
    p_up: 0.57,
    ev: 0.22,
    sizePct: 18,
    confidence: 61,
    bullets: [
      "Bias bullish while structure health > 0.55.",
      "Trim box active (TIS>=60).",
      "Exit only allowed on structure failure (contract rule).",
    ],
  },

  zones: {
    entry: [
      { price: 12.5, label: "VWAP cluster + pivots (mock)", strength: "HIGH" },
      { price: 12.3, label: "Gap shelf retest (mock)", strength: "MED" },
    ],
    stop: { price: 11.5, label: "Structure invalidation (mock)" },
    targets: [
      { price: 13.5, label: "TP1 harvest" },
      { price: 14.4, label: "TP2 extension harvest" },
      { price: 15.5, label: "TP3 runner capture" },
    ],
  },

  trim: {
    tis: 62,
    nextWindowMin: 18,
    suggestedPct: 12,
    nextTrimWindow: "18m",
  },

  structure: {
    health: 0.66,
    status: "STRUCTURE_OK",
    notes: ["Exit only if: STRUCTURE_FAIL", "No failure reasons flagged."],
  },

  liquidity: {
    state: "BID_DOMINANT",
    voidZones: 0,
    absorptionShelves: 0,
  },

  momentum: {
    state: "ACCELERATING",
    orderbook: "BID_DOMINANT",
  },
};
