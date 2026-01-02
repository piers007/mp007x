import type { EngineOutput } from '../engine/types'

export function mockEngineOutput(ticker: string): EngineOutput {
  const now = Date.now()
  const seed = ticker.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const tis = Math.min(92, Math.max(12, (seed % 70) + 25))

  const structureState: EngineOutput['structure']['state'] = tis > 88 ? 'DEGRADED' : 'INTACT'
  const harvestMode = tis >= 60

  return {
    ticker,
    ts: now,
    structure: {
      state: structureState,
      confidence: structureState === 'INTACT' ? 84 : 66,
      reason: structureState === 'INTACT'
        ? 'VWAP support holding; structure accepted.'
        : 'Extension risk rising; watch acceptance.',
    },
    entry: {
      primaryBuy: { low: 4.02, high: 4.08 },
      secondaryBuy: { low: 3.94, high: 3.99 },
      invalidBelow: 3.88,
    },
    momentum: {
      delta1k: 2400,
      delta5k: 7100,
      deltaSlope: 'UP',
      conversionEfficiency: 0.63,
      hiddenMomentum: true,
      summary: 'Buy pressure accelerating faster than price.',
    },
    trim: {
      tis,
      harvestMode,
      nextTrimWindow: harvestMode ? 'NOW' : 'NOT_APPLICABLE',
      trimNowPctOrig: harvestMode ? Math.min(35, Math.max(8, Math.round((tis - 55) * 0.6))) : undefined,
      reasons: harvestMode
        ? ['Conversion slowing', 'Liquidity thinning detected', 'Runner probability still elevated']
        : ['No harvest signal'],
    },
    targets: {
      tp1: 4.12,
      tp2: 4.20,
      tp3: 4.32,
      runnerProbability: 0.58,
      massiveBreakout: true,
    },
    liquidity: {
      mode: 'PROXY',
      bidAskRatio: 0.86,
      thinWarning: tis > 72,
      spoofRisk: tis > 80,
    },
  }
}
