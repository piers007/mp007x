// src/engine/lfrs.ts
export type LFRSInputs = {
  floatShares?: number | null;      // shares
  volumeToday?: number | null;      // shares
  adv30?: number | null;            // shares
  bid?: number | null;
  ask?: number | null;
  mid?: number | null;
  depthBidTotal?: number | null;    // aggregated size
  depthAskTotal?: number | null;    // aggregated size
  entropyAsk?: number | null;       // 0..1 (optional)
  atr1m?: number | null;            // price units
  price?: number | null;            // last
};

export type LFRSResult = {
  score: number; // 0..100
  state: "STABLE" | "WATCH" | "UNSTABLE" | "EXPLOSIVE";
  english: string;
  drivers: Array<{ name: string; value: number; weight: number; note: string }>;
};

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}
function safeNum(x: any): number | null {
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
}

function log10(x: number) {
  return Math.log(x) / Math.log(10);
}

export function computeLFRS(inp: LFRSInputs): LFRSResult {
  const w = {
    float: 0.32,
    rot: 0.22,
    rvol: 0.12,
    spread: 0.10,
    ob: 0.14,
    halt: 0.10,
  };

  const floatShares = safeNum(inp.floatShares);
  const vol = safeNum(inp.volumeToday);
  const adv30 = safeNum(inp.adv30);
  const bid = safeNum(inp.bid);
  const ask = safeNum(inp.ask);
  const mid = safeNum(inp.mid) ?? (bid != null && ask != null ? (bid + ask) / 2 : null);
  const depthBid = safeNum(inp.depthBidTotal);
  const depthAsk = safeNum(inp.depthAskTotal);
  const entropyAsk = safeNum(inp.entropyAsk);
  const atr1m = safeNum(inp.atr1m);
  const price = safeNum(inp.price) ?? mid;

  // A) Float risk
  let floatRisk = 0.35;
  let floatNote = "estimated";
  if (floatShares != null && floatShares > 0) {
    const floatM = floatShares / 1_000_000;
    const top = log10(50) - log10(floatM);
    const bot = log10(50) - log10(2);
    floatRisk = clamp01(top / bot);
    floatNote = `${floatM.toFixed(1)}M`;
  }

  // B) Rotation
  let rotRisk = 0.25;
  let rotNote = "estimated";
  if (vol != null && floatShares != null && floatShares > 0) {
    const rot = vol / floatShares;
    rotRisk = clamp01(rot / 1.25);
    rotNote = `rot ${(rot * 100).toFixed(0)}%`;
  }

  // C) RVOL
  let rvolRisk = 0.20;
  let rvolNote = "estimated";
  if (vol != null && adv30 != null && adv30 > 0) {
    const rvol = vol / adv30;
    rvolRisk = clamp01((rvol - 1.0) / 4.0);
    rvolNote = `RVOL ${rvol.toFixed(2)}x`;
  }

  // D) Spread
  let spreadRisk = 0.25;
  let spreadNote = "estimated";
  if (bid != null && ask != null && mid != null && mid > 0) {
    const spread = (ask - bid) / mid;
    spreadRisk = clamp01(spread / 0.008);
    spreadNote = `${(spread * 100).toFixed(2)}%`;
  }

  // E) Orderbook thinness
  let obRisk = 0.30;
  let obNote = "no L2";
  if (depthBid != null && depthAsk != null && depthBid > 0 && depthAsk > 0) {
    const depthRatio = depthBid / depthAsk;
    const obi = (depthBid - depthAsk) / (depthBid + depthAsk);
    const vacuumUp = clamp01((depthRatio - 1.2) / 1.0);
    const vacuumDn = clamp01(((1 / depthRatio) - 1.2) / 1.0);
    obRisk = clamp01(0.55 * Math.max(vacuumUp, vacuumDn) + 0.45 * Math.abs(obi));

    if (entropyAsk != null) {
      obRisk = clamp01(obRisk + 0.15 * clamp01((0.55 - entropyAsk) / 0.55));
    }
    obNote = `OBI ${(obi * 100).toFixed(0)}%`;
  }

  // F) Halt proxy
  let haltRisk = 0.25;
  let haltNote = "estimated";
  if (atr1m != null && price != null && price > 0) {
    const v = atr1m / price;
    haltRisk = clamp01((v - 0.004) / 0.012);
    haltNote = `ATR% ${(v * 100).toFixed(2)}%`;
  }

  const raw =
    w.float * floatRisk +
    w.rot * rotRisk +
    w.rvol * rvolRisk +
    w.spread * spreadRisk +
    w.ob * obRisk +
    w.halt * haltRisk;

  const score = Math.round(100 * clamp01(raw));

  const state =
    score >= 70 ? "EXPLOSIVE" :
    score >= 50 ? "UNSTABLE" :
    score >= 25 ? "WATCH" : "STABLE";

  const english =
    state === "EXPLOSIVE"
      ? `Supply is extremely unstable (LFRS ${score}) — expect sharp wicks/halts and fast breakouts/failures.`
      : state === "UNSTABLE"
      ? `Supply is unstable (LFRS ${score}) — manage with disciplined trims and avoid chasing highs.`
      : state === "WATCH"
      ? `Supply risk is moderate (LFRS ${score}) — tradable, but watch spreads and pullbacks.`
      : `Supply is relatively stable (LFRS ${score}) — smoother price action, fewer whipsaw risks.`;

  const drivers = [
    { name: "Float risk", value: floatRisk, weight: w.float, note: floatNote },
    { name: "Rotation risk", value: rotRisk, weight: w.rot, note: rotNote },
    { name: "RVOL risk", value: rvolRisk, weight: w.rvol, note: rvolNote },
    { name: "Spread risk", value: spreadRisk, weight: w.spread, note: spreadNote },
    { name: "Orderbook risk", value: obRisk, weight: w.ob, note: obNote },
    { name: "Halt proxy", value: haltRisk, weight: w.halt, note: haltNote },
  ]
    .sort((a, b) => (b.value * b.weight) - (a.value * a.weight))
    .slice(0, 5);

  return { score, state, english, drivers };
}
