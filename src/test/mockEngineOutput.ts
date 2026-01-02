// src/test/mockEngineOutput.ts
import type { EngineSnapshot } from "../engine/types";

export function mockEngineSnapshot(ticker: string): EngineSnapshot {
  const t = (ticker || "MOCK").toUpperCase();

  return {
    ticker: t,
    ts: new Date().toISOString(),
    price: 5.23,

    p_up: 0.62,
    ev: 0.18,
    tier: 2,
    sizePct: 50,

    zones: {
      buyZone: {
        lo: 5.05,
        hi: 5.18,
        rationale: ["Pullback into demand gap", "σ-regime favorable", "VWAP reclaim bias"],
      },
      invalidation: {
        price: 4.92,
        rationale: ["Structure breaks + VWAP loss", "Demand gap fails"],
      },
      tpLadder: [
        { level: 5.45, pctTrim: 15, label: "TP1", rationale: ["First supply shelf"] },
        { level: 5.70, pctTrim: 20, label: "TP2", rationale: ["Prior high magnet"] },
        { level: 6.10, pctTrim: 25, label: "TP3", rationale: ["Extension harvest zone (+15%)"] },
      ],
    },

    trim: {
      tis: 63,
      nextTrimWindow: "NOW",
      trimNowPctOrig: 15,
      harvestMode: true,
      reasons: ["TIS≥60 (trim box)", "+15% extension harvest", "Ask liquidity risk rising"],
    },

    micro: {
      obeScore: 78,
      bidAskImbalance: 0.31,
      thinAsk: false,
      thinBid: false,
      notes: ["Order book stable; no emergency exit condition detected"],
    },

    headline: "Hold bias. Trim suggested in momentum only.",
    bullets: [
      "Exit only on invalidation / math collapse (rule).",
      "Trim intensity elevated; harvest mode active beyond +15%.",
      "No L2/L3 vacuum-triggered 'sell all' condition detected.",
    ],
  };
}
