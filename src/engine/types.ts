// src/engine/types.ts

export type TrimWindow =
  | 'NOW'
  | 'NEXT_5M'
  | 'NEXT_15M'
  | 'NEXT_30M'
  | 'LATER';

export interface TrimSignal {
  nextTrimWindow: TrimWindow;
  trimNowPctOrig?: number;
  reasons: string[];
}

export interface EngineOutput {
  ticker: string;

  tis: number;
  confidence: number;

  momentumScore: number;
  structureScore: number;
  liquidityScore: number;

  entryPrice?: number;
  stopLoss?: number;
  targets?: number[];

  trim: TrimSignal;
}

export interface EngineSnapshot {
  timestamp: string;
  output: EngineOutput;
}
