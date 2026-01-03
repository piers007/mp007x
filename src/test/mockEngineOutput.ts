import type { AnalyzeResponse } from "../engine/types";

export const mockEngineOutput: AnalyzeResponse = {
  contract_version: "1.0",
  engine_rev: "r000",
  ticker: "QCLS",
  as_of: new Date().toISOString(),

  decision: {
    state: "HOLD",
    bias: "BULLISH",
    confidence: 0.61,
    p_up: 0.57,
    ev_r: 0.22,
    tier: 2,
    size_pct: 18,
    pillar_agreement: 4,
  },

  zones: {
    entry: [
      { price: 12.5, strength: "HIGH", why: "VWAP cluster + pivots (mock)" },
      { price: 12.3, strength: "MED", why: "Gap shelf retest (mock)" },
    ],
    take_profit: [
      { price: 13.5, trim_pct_of_initial: 18, reason: "TP1 harvest", tis: 62 },
      { price: 14.4, trim_pct_of_initial: 22, reason: "TP2 extension harvest", tis: 62 },
      { price: 15.5, trim_pct_of_initial: 30, reason: "TP3 runner capture", tis: 62 },
    ],
    stop: { price: 11.5, stop_mult: 1.15, reason: "Structure invalidation (mock)" },
    extension: { runner_mode: true, target: 16.7, reason: "If trend holds (mock)" },
  },

  trim: {
    tis: 62,
    next_trim_window_sec: 1080,
    trim_box: { active: true, suggested_trim_pct_of_initial: 12, reason: "TIS>=60" },
  },

  structure: { structure_health: 0.66, exit_only_if: "STRUCTURE_FAIL", fail_reasons: [] },

  flow: {
    delta_state: "ACCELERATING",
    orderbook_state: "BID_DOMINANT",
    liquidity_map: { void_zones: [], absorption_shelves: [] },
  },

  explain: {
    bullets: [
      "Bias bullish while structure health > 0.55.",
      "Trim box active (TIS>=60).",
      "Exit only allowed on structure failure (contract rule).",
    ],
    vetoes: [],
    top_drivers: [
      { name: "Structure Health", score: 0.66, direction: 1 },
      { name: "Trim TIS", score: 0.62, direction: 1 },
      { name: "Orderbook State", score: 0.58, direction: 1 },
    ],
  },
};
