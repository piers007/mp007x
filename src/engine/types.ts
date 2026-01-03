export type AnalyzeMode = "INTRADAY" | "SWING";

export type AnalyzeRequest = {
  ticker: string;
  as_of?: string;
  mode?: AnalyzeMode;
};

export type DecisionState = "BUY" | "HOLD" | "NO_TRADE" | "TRIM" | "EXIT";
export type Bias = "BULLISH" | "BEARISH" | "NEUTRAL";

export type Decision = {
  state: DecisionState;
  bias: Bias;
  confidence: number;
  p_up: number;
  ev_r: number;
  tier: number;
  size_pct: number;
  pillar_agreement: number;
};

export type EntryZone = { price: number; strength: "HIGH" | "MED" | "LOW"; why: string };
export type TakeProfit = { price: number; trim_pct_of_initial: number; reason: string; tis: number };
export type StopZone = { price: number; stop_mult: number; reason: string };
export type Extension = { runner_mode: boolean; target: number; reason: string };

export type Zones = {
  entry: EntryZone[];
  take_profit: TakeProfit[];
  stop: StopZone;
  extension: Extension;
};

export type TrimBox = {
  active: boolean;
  suggested_trim_pct_of_initial: number;
  reason: string;
};

export type Trim = {
  tis: number; // 0-100
  next_trim_window_sec: number;
  trim_box: TrimBox;
};

export type Structure = {
  structure_health: number;
  exit_only_if: "STRUCTURE_FAIL";
  fail_reasons: string[];
};

export type LiquidityMap = { void_zones: any[]; absorption_shelves: any[] };

export type Flow = {
  delta_state: "ACCELERATING" | "NEUTRAL" | "EXHAUSTING" | "UNKNOWN";
  orderbook_state: "BID_DOMINANT" | "ASK_DOMINANT" | "THINNING_BID" | "THINNING_ASK" | "UNKNOWN";
  liquidity_map: LiquidityMap;
};

export type Veto = { engine: string; type: "soft" | "hard"; reason_code: string; note: string };
export type Driver = { name: string; score: number; direction: -1 | 1 };

export type Explain = {
  bullets: string[];
  vetoes: Veto[];
  top_drivers: Driver[];
};

export type AnalyzeResponse = {
  contract_version: string;
  engine_rev: string;
  ticker: string;
  as_of: string;

  decision: Decision;
  zones: Zones;
  trim: Trim;
  structure: Structure;
  flow: Flow;
  explain: Explain;
};

/**
 * Back-compat aliases for earlier UI code.
 * These stop the TS errors you saw (EngineSnapshot/EngineOutput missing fields).
 */
export type EngineSnapshot = AnalyzeResponse;
export type EngineOutput = AnalyzeResponse;
