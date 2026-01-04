// src/test/mockEngineOutput.ts
import type { EngineFetchResult } from "../engine/api";
import type { EngineSnapshot, EngineOutput } from "../engine/types";

export function makeMockEngine(ticker: string = "SEV"): EngineFetchResult {
  const t = ticker.trim().toUpperCase();

  const snap: EngineSnapshot = {
    ticker: t,
    headline: "Liquidity supportive; structure intact. Favor controlled trims.",

    price: 9.24,
    p_up: 0.72,
    ev: 0.18,
    tier: 2,
    sizePct: 50,
    verdict: "BUY",

    bullets: [
      "BUY zone active; stop defined; TPs clean & horizontal.",
      "Order-book conviction steady; no major sell wall above TP1.",
      "Runner probability elevated—trim lighter if extension persists."
    ],

    zones: {
      buyZone: { low: 9.10, high: 9.25, label: "BUY ZONE" },
      stopZone: { low: 8.92, high: 8.98, label: "STOP ZONE" },
      support: [{ price: 9.00, label: "SUP1" }],
      resistance: [{ price: 9.55, label: "R1" }],
      tpLevels: [
        { price: 10.40, label: "TP1" },
        { price: 10.80, label: "TP2" },
        { price: 11.00, label: "TP3" }
      ]
    },

    trim: {
      tis: 47,
      suggestedTrimPct: 0,
      mode: "NORMAL",
      english: "No trim yet—edge still building; wait for TIS≥60 near TP.",
      nextWindow: "Near TP1"
    },

    micro: {
      obConviction: 71,
      obi: 0.24,
      spoofRisk: "low",
      vacuum: "med",
      notes: [
        { title: "Bid shelves", value: "stacked 9.10–9.15", status: "green" },
        { title: "Ask", value: "thin above 9.40", status: "green" },
        { title: "Spoof", value: "no pull detected", status: "neutral" }
      ],
      english: "Buy-side liquidity supports continuation; ask thins into TP1."
    },

    runner: {
      runnerProbability: 82,
      runnerMode: true,
      addOnPermission: "PULLBACK_ADD",
      trimBias: 0.5,
      gates: {
        rpGte70: true,
        structureValid: true,
        obConvictionGte65: true,
        kGte60: true,
        hardVetoFree: true
      },
      english: "Runner mode ON: vacuum + delta pressure accelerating; favor lighter trims."
    },

    delta: {
      kScore: 74,
      vDelta1k: 0.62,
      vDelta5k: 0.48,
      aDelta: 0.31,
      vPrice: 0.44,
      aPrice: 0.12,
      alignment: 0.86,
      persistence: 0.74,
      accelScore: 0.62,
      eventScore: 0.15,
      direction: "up",
      regime: "supportive",
      lastEvent: {
        type: "print_disappear",
        classification: "bullish_ignition",
        ts: new Date().toISOString(),
        magnitude: 0.58,
        notes: "5k print vanished; price held; bid refilled"
      },
      english: "Delta accelerating with price; 1k+5k aligned—continuation pressure present."
    }
  };

  const out: EngineOutput = {
    structure: {
      structureValid: true,
      trend: "up",
      keyLevel: 9.10,
      english: "Structure intact with higher lows; reclaim holding above key demand."
    },
    entry: {
      entryBias: "long",
      idealEntry: { low: 9.10, high: 9.25, label: "BUY ZONE" },
      invalidation: 8.95,
      english: "Prefer entries on pullback into buy zone; invalidate below stop shelf."
    },
    momentum: {
      state: "continuation",
      sigmaRegime: "normal",
      english: "Momentum supportive; avoid chasing—use pullback adds if runner holds."
    },
    liquidity: {
      shelves: [
        { side: "bid", price: 9.15, strength: 0.82 },
        { side: "bid", price: 9.10, strength: 0.76 }
      ],
      walls: [{ side: "ask", price: 9.55, strength: 0.55 }],
      english: "Bid shelves persistent under price; light resistance into first target."
    },
    targets: {
      runnerProbability: 82,
      massiveBreakout: false,
      tp1: 10.4,
      tp2: 10.8,
      tp3: 11.0,
      english: "Targets laddered at liquidity nodes; trim only when TIS triggers."
    },
    runner: snap.runner,
    delta: snap.delta
  };

  return { snap, out };
}
