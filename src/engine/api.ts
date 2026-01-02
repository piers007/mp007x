// src/engine/api.ts
import type { EngineSnapshot } from "./types";
import { mockEngineSnapshot } from "../test/mockEngineOutput";

/**
 * Calls backend contract:
 *   POST /api/007/snapshot
 *   body: { ticker: "QCLS" }
 *
 * If the backend is down (or not wired yet), we return a mock snapshot
 * so the UI stays functional on Render.
 */
export async function fetchSnapshot(ticker: string): Promise<EngineSnapshot> {
  const t = (ticker || "").toUpperCase().trim();
  if (!t) return mockEngineSnapshot("AAPL");

  try {
    const res = await fetch("/api/007/snapshot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticker: t }),
    });

    if (!res.ok) {
      // fallback
      return mockEngineSnapshot(t);
    }

    const data = (await res.json()) as EngineSnapshot;

    // minimal guardrails
    if (!data?.ticker || !data?.zones || !data?.trim) return mockEngineSnapshot(t);

    return data;
  } catch {
    return mockEngineSnapshot(t);
  }
}
