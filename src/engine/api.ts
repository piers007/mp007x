import type { EngineSnapshot, EngineOutput } from "./types";

const DEFAULT_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE ??
  (import.meta as any).env?.VITE_KNOX_API_BASE ??
  "https://knox-007-backend.onrender.com";

// 🔎 TEMP DEBUG — REMOVE AFTER CONFIRMATION
console.info("[Knox] API_BASE =", DEFAULT_BASE_URL);

export type EngineFetchResult = {
  snap: EngineSnapshot;
  out: EngineOutput;
};

async function httpJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText} :: ${text}`);
  }
  return (await res.json()) as T;
}

/**
 * Backend returns a "contract payload" (decision/zones/trim/structure/flow/explain).
 * UI expects: { snap: EngineSnapshot, out: EngineOutput }
 * This adapter maps backend payload -> UI contract.
 */
function adaptBackendToUI(payload: any): EngineFetchResult {
  const t: string = String(payload?.ticker ?? "—").toUpperCase();

  const decision = payload?.decision ?? {};
  const zones = payload?.zones ?? {};
  const explain = payload?.explain ?? {};
  const trim = payload?.trim ?? {};
  const structure = payload?.structure ?? {};
  const flow = payload?.flow ?? {};

  // ---------- Prices ----------
  const entryPrices: number[] = Array.isArray(zones?.entry)
    ? zones.entry.map((z: any) => Number(z?.price)).filter((n: number) => Number.isFinite(n))
    : [];

  const entryLow = entryPrices.length ? Math.min(...entryPrices) : null;
  const entryHigh = entryPrices.length ? Math.max(...entryPrices) : null;

  const stopPrice: number | null =
    zones?.stop?.price != null && Number.isFinite(Number(zones.stop.price)) ? Number(zones.stop.price) : null;

  // No real last price yet — use first entry as stable placeholder so UI renders.
  const approxPrice: number = entryPrices.length ? entryPrices[0] : 0;

  // Take profits
  const tpArr: number[] = Array.isArray(zones?.take_profit)
    ? zones.take_profit.map((z: any) => Number(z?.price)).filter((n: number) => Number.isFinite(n))
    : [];

  const tp1 = tpArr[0] ?? null;
  const tp2 = tpArr[1] ?? null;
  const tp3 = tpArr[2] ?? null;

  // ---------- SNAP ----------
  const verdictRaw = String(decision?.state ?? "HOLD").toUpperCase();
  const verdict: "BUY" | "HOLD" | "WAIT" =
    verdictRaw === "BUY" ? "BUY" : verdictRaw === "WAIT" ? "WAIT" : "HOLD";

  const bullets: string[] = Array.isArray(explain?.bullets) ? explain.bullets.map(String) : [];

  const tisNum = Number(trim?.tis);
  const tis = Number.isFinite(tisNum) ? tisNum : 0;

  const suggestedTrimPct = Number(trim?.trim_box?.suggested_trim_pct_of_initial);
  const safeSuggestedTrimPct = Number.isFinite(suggestedTrimPct) ? suggestedTrimPct : 0;

  const nextWindowSec = Number(trim?.next_trim_window_sec);
  const safeNextWindow =
    Number.isFinite(nextWindowSec) && nextWindowSec > 0 ? `${Math.round(nextWindowSec / 60)}m` : null;

  const snap: any = {
    ticker: t,
    verdict,
    headline: bullets[0] ?? `${verdict} • engine payload`,
    price: approxPrice,
    p_up: Number(decision?.p_up ?? 0),
    ev: Number(decision?.ev_r ?? 0),
    tier: Number(decision?.tier ?? 0),
    sizePct: Number(decision?.size_pct ?? 0),
    bullets,

    trim: {
      tis,
      suggestedTrimPct: safeSuggestedTrimPct,
      nextWindow: safeNextWindow,
      english: String(trim?.trim_box?.reason ?? "—"),
    },
  };

  // ---------- OUT ----------
  const bias = String(decision?.bias ?? "NEUTRAL").toUpperCase();
  const entryBias = bias === "BULLISH" || bias === "BEARISH" ? bias : "NEUTRAL";

  const structureHealth = Number(structure?.structure_health ?? 0);
  const structureValid = Number.isFinite(structureHealth) ? structureHealth >= 0.55 : false;

  const runnerMode = Boolean(zones?.extension?.runner_mode);
  const runnerProb = Math.round(Number(decision?.confidence ?? 0) * 100); // placeholder

  const out: any = {
    entry: {
      entryBias: entryBias.toLowerCase(),
      idealEntry:
        entryLow != null && entryHigh != null
          ? { low: entryLow, high: entryHigh, label: "ENTRY ZONE" }
          : null,
      invalidation: stopPrice,
      english:
        entryPrices.length && Array.isArray(zones?.entry)
          ? String(zones.entry[0]?.why ?? "Entry derived from engine zones.")
          : "No entry zones available.",
    },

    targets: {
      tp1,
      tp2,
      tp3,
      massiveBreakout: runnerMode,
      runnerProbability: Number.isFinite(runnerProb) ? runnerProb : 0,
      english:
        Array.isArray(zones?.take_profit) && zones.take_profit.length
          ? "TP ladder derived from take_profit zones."
          : "No TP ladder available.",
    },

    momentum: {
      state: verdict === "BUY" ? "ignition" : verdict === "HOLD" ? "continuation" : "neutral",
      sigmaRegime: null,
      english: "Momentum state derived from decision state (placeholder until σ module is wired).",
    },

    structure: {
      structureValid,
      trend: bias === "BEARISH" ? "bearish" : bias === "BULLISH" ? "bullish" : "neutral",
      keyLevel: entryPrices.length ? entryPrices[0] : null,
      english: `Structure health ${(structureHealth * 100).toFixed(0)}% • exit_only_if=${String(
        structure?.exit_only_if ?? "—"
      )}`,
    },

    liquidity: {
      english: `OB: ${String(flow?.orderbook_state ?? "—")} • Δ: ${String(flow?.delta_state ?? "—")}`,
      shelves: Array.isArray(flow?.liquidity_map?.absorption_shelves) ? flow.liquidity_map.absorption_shelves : [],
      walls: [],
    },
  };

  return { snap, out } as EngineFetchResult;
}

/**
 * Fetch engine result for a ticker (canonical).
 * POST /v1/analyze (your backend main.py)
 */
export async function fetchEngine(
  ticker: string,
  baseUrl: string = DEFAULT_BASE_URL
): Promise<EngineFetchResult> {
  const t = ticker.trim().toUpperCase();
  const url = `${baseUrl.replace(/\/$/, "")}/v1/analyze`;

  const payload = await httpJson<any>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ticker: t }),
  });

  return adaptBackendToUI(payload);
}

/**
 * Health check (your backend)
 * GET /api/health -> { ok: true }
 */
export async function fetchHealth(baseUrl: string = DEFAULT_BASE_URL): Promise<{ ok: boolean }> {
  const url = `${baseUrl.replace(/\/$/, "")}/api/health`;
  return await httpJson<{ ok: boolean }>(url, { method: "GET" });
}
