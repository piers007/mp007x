// src/test/mockEngineOutput.ts
import { EngineSnapshot } from '../engine/types';

export const mockSnapshot: EngineSnapshot = {
  ticker: 'SAMPLE',
  headline: 'Mock Snapshot (UI Smoke Test)',

  p_up: 0.58,
  ev: 0.14,
  tier: 3,
  sizePct: 25,
  price: 12.34,

  bullets: [
    'RVOL elevated vs 30D ADV',
    'Float rotation pressure building',
    'Microstructure stable (no collapse)',
  ],

  zones: {
    price: 12.34,
    buyZone: { low: 11.90, high: 12.10 },
    support: 11.70,
    resistance: 12.85,
    takeProfits: [
      { label: 'TP1', price: 12.85, kind: 'tp' },
      { label: 'TP2', price: 13.40, kind: 'tp' },
      { label: 'TP3', price: 14.10, kind: 'tp' },
    ],
    stopLoss: { label: 'SL', price: 11.55, kind: 'sl' },
    levels: [
      { label: 'PDH', price: 13.05, kind: 'pdh' },
      { label: 'PDL', price: 11.20, kind: 'pdl' },
    ],
  },

  micro: {
    mps: 62,
    sps: 55,
    sfi: 48,
    notes: ['Bid resilience present', 'No heavy spread expansion'],
  },

  output: {
    tis: 66,
    trim: {
      nextTrimWindow: 'NEXT_15M',
      trimNowPctOrig: 0,
      reasons: ['TIS>60 watch trim box', 'No exhaustion trigger yet'],
    },
    entry: { price: 12.05, stop: 11.55, notes: ['Enter near buy zone'] },
    momentum: { score: 61, notes: ['EMA/VWAP aligned'] },
    structure: { score: 58, notes: ['Holding above prior pivot'] },
    liquidity: { score: 54, notes: ['No liquidity vacuum yet'] },
    targets: {
      tp1: 12.85,
      tp2: 13.40,
      tp3: 14.10,
      runnerProbability: 0.22,
      massiveBreakout: false,
      notes: ['Scale out into momentum only'],
    },
  },

  timestamp: new Date().toISOString(),
};
