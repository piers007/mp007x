export type StructureState = 'INTACT' | 'DEGRADED' | 'FAILED'
export type NextTrimWindow = 'NOW' | 'WAITING_FOR_MOMENTUM' | 'NOT_APPLICABLE'
export type PriceRange = { low: number; high: number }

export interface EngineOutput {
  ticker: string
  ts: number

  structure: { state: StructureState; confidence: number; reason: string }

  entry: { primaryBuy: PriceRange; secondaryBuy?: PriceRange; invalidBelow: number }

  momentum: {
    delta1k: number
    delta5k: number
    deltaSlope: 'UP' | 'FLAT' | 'DOWN'
    conversionEfficiency: number // 0..1
    hiddenMomentum: boolean
    summary: string
  }

  trim: {
    tis: number // 0..100
    harvestMode: boolean
    nextTrimWindow: NextTrimWindow
    trimNowPctOrig?: number
    plannedTrimPctOrig?: number
    reasons: string[]
  }

  targets: {
    tp1: number
    tp2: number
    tp3?: number
    runnerProbability: number // 0..1
    massiveBreakout: boolean
  }

  liquidity: {
    mode: 'L2' | 'PROXY'
    bidAskRatio: number
    thinWarning: boolean
    spoofRisk: boolean
  }
}
