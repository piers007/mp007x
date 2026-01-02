export type EngineSnapshot = {
  ticker: string;

  price: number;

  bias: "bullish" | "neutral" | "bearish";

  probability_up: number; // 0–1
  expected_value: number;

  tier: number; // 0–4

  buy_zones: {
    low: number;
    high: number;
  }[];

  take_profit_zones: {
    price: number;
    confidence: number;
  }[];

  stop_loss: number;

  trim: {
    tis: number; // Trim Intensity Score (0–100)
    suggested_trim_pct: number; // % of initial position
    reason: string;
  };

  structure_valid: boolean;
};
