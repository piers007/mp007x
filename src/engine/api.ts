import { EngineSnapshot, normalizeSnapshot } from "./types";

/**
 * Knox 007 — API client
 * Works in:
 * - Local dev (Vite)
 * - Render (same-origin or separate backend base URL)
 *
 * Env:
 * - VITE_API_BASE = "https://knox-007-backend.onrender.com" (optional)
 */
const API_BASE =
  (import.meta as any).env?.VITE_API_BASE?.trim?.() ||
  ""; // empty = same-origin

function join(base: string, path: string) {
  if (!base) return path;
  return base.replace(/\/+$/, "") + "/" + path.replace(/^\/+/, "");
}

export type AnalyzeParams = {
  ticker: string;
  timeframe?: string; // e.g. "INTRADAY" | "1m" | "5m" | "15m"
};

export async function analyzeTicker(params: AnalyzeParams): Promise<EngineSnapshot> {
  const ticker = (params.ticker || "").trim().toUpperCase();
  const timeframe = (params.timeframe || "INTRADAY").trim();

  if (!ticker) {
    // Return a safe empty snapshot rather than throwing
    return normalizeSnapshot({
      ticker: "",
      headline: "No ticker provided",
      decision: { bias: "NEUTRAL", tier: 0, p_up: 0.5, ev: 0, sizePct: 0, confidence: 0, bullets: [] },
    });
  }

  // Backend supports either:
  // - GET /api/analyze?ticker=QCLS&timeframe=INTRADAY
  // - GET /analyze?ticker=...
  // We try /api/analyze first, fallback to /analyze.
  const q = new URLSearchParams({ ticker, timeframe });

  const primaryUrl = join(API_BASE, `/api/analyze?${q.toString()}`);
  const fallbackUrl = join(API_BASE, `/analyze?${q.toString()}`);

  // Try primary
  try {
    const res = await fetch(primaryUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();
    return normalizeSnapshot(json);
  } catch (e) {
    // Fallback
    const res2 = await fetch(fallbackUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!res2.ok) {
      const text = await res2.text().catch(() => "");
      throw new Error(`Analyze failed (${res2.status}). ${text}`.trim());
    }

    const json2 = await res2.json();
    return normalizeSnapshot(json2);
  }
}
