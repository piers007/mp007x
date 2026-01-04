// src/engine/api.ts
import type { EngineSnapshot, EngineOutput } from "./types";

const DEFAULT_BASE_URL =
  (import.meta as any).env?.VITE_KNOX_API_BASE ??
  (import.meta as any).env?.VITE_API_BASE ??
  "http://localhost:8000";

export type EngineFetchResult = {
  snap: EngineSnapshot;
  out: EngineOutput;
};

async function httpGetJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText} :: ${text}`);
  }
  return (await res.json()) as T;
}

/**
 * Fetches the latest engine snapshot+output for a ticker.
 * Backend contract (recommended):
 *   GET /api/engine?ticker=SEV
 *   -> { snap: EngineSnapshot, out: EngineOutput }
 */
export async function fetchEngine(ticker: string, baseUrl: string = DEFAULT_BASE_URL): Promise<EngineFetchResult> {
  const t = ticker.trim().toUpperCase();
  const url = `${baseUrl.replace(/\/$/, "")}/api/engine?ticker=${encodeURIComponent(t)}`;
  return await httpGetJson<EngineFetchResult>(url);
}

/**
 * Simple health check for Render/Backend.
 * GET /health -> { ok: true }
 */
export async function fetchHealth(baseUrl: string = DEFAULT_BASE_URL): Promise<{ ok: boolean }> {
  const url = `${baseUrl.replace(/\/$/, "")}/health`;
  return await httpGetJson<{ ok: boolean }>(url);
}
