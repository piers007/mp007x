import React, { useEffect, useState } from "react";
import { fetchEngine } from "../engine/api";
import type { EngineSnapshot, EngineOutput } from "../engine/types";

// If your repo uses different card components, keep those imports,
// but the important part is: DO NOT fetch('/api/analyze') anywhere.
export default function DashboardPage() {
  const [ticker, setTicker] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [snap, setSnap] = useState<EngineSnapshot | null>(null);
  const [out, setOut] = useState<EngineOutput | null>(null);

  async function run(t: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchEngine(t);
      setSnap(res.snap);
      setOut(res.out);
    } catch (e: any) {
      console.error("[Knox] fetchEngine error:", e);
      setError("Load failed");
      setSnap(null);
      setOut(null);
    } finally {
      setLoading(false);
    }
  }

  // Initial load
  useEffect(() => {
    run(ticker);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ padding: 16, maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <input
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          placeholder="Ticker (e.g., QCLS)"
          style={{
            flex: 1,
            padding: "12px 14px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(0,0,0,0.25)",
            color: "white",
          }}
        />
        <button
          onClick={() => run(ticker)}
          disabled={loading}
          style={{
            padding: "12px 14px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(255,255,255,0.08)",
            color: "white",
          }}
        >
          {loading ? "Loading..." : "Analyze"}
        </button>
      </div>

      {error ? (
        <div
          style={{
            marginTop: 14,
            padding: 14,
            borderRadius: 12,
            border: "1px solid rgba(255, 90, 90, 0.55)",
            background: "rgba(255, 90, 90, 0.10)",
            color: "white",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 4 }}>Error</div>
          <div>{error}</div>
        </div>
      ) : null}

      <div style={{ marginTop: 16 }}>
        {!snap || !out ? (
          <div style={{ opacity: 0.8, color: "white" }}>
            {loading ? "Loading engine…" : "No data yet."}
          </div>
        ) : (
          <div style={{ color: "white" }}>
            <div style={{ fontSize: 18, fontWeight: 800 }}>
              {snap.ticker} • {snap.verdict}
            </div>
            <div style={{ marginTop: 6, opacity: 0.85 }}>{snap.headline}</div>

            <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
              <div style={{ padding: 12, borderRadius: 12, background: "rgba(255,255,255,0.06)" }}>
                <div style={{ fontWeight: 700 }}>Trim</div>
                <div style={{ opacity: 0.9, marginTop: 6 }}>
                  TIS: {snap.trim?.tis ?? 0} • Suggested Trim: {snap.trim?.suggestedTrimPct ?? 0}% • Next:{" "}
                  {snap.trim?.nextWindow ?? "—"}
                </div>
                <div style={{ opacity: 0.85, marginTop: 6 }}>{snap.trim?.english ?? "—"}</div>
              </div>

              <div style={{ padding: 12, borderRadius: 12, background: "rgba(255,255,255,0.06)" }}>
                <div style={{ fontWeight: 700 }}>Entry</div>
                <div style={{ opacity: 0.9, marginTop: 6 }}>
                  Zone:{" "}
                  {out.entry?.idealEntry
                    ? `${out.entry.idealEntry.low} – ${out.entry.idealEntry.high}`
                    : "—"}{" "}
                  • SL: {out.entry?.invalidation ?? "—"}
                </div>
                <div style={{ opacity: 0.85, marginTop: 6 }}>{out.entry?.english ?? "—"}</div>
              </div>

              <div style={{ padding: 12, borderRadius: 12, background: "rgba(255,255,255,0.06)" }}>
                <div style={{ fontWeight: 700 }}>Targets</div>
                <div style={{ opacity: 0.9, marginTop: 6 }}>
                  TP1: {out.targets?.tp1 ?? "—"} • TP2: {out.targets?.tp2 ?? "—"} • TP3: {out.targets?.tp3 ?? "—"}
                </div>
                <div style={{ opacity: 0.85, marginTop: 6 }}>{out.targets?.english ?? "—"}</div>
              </div>

              <div style={{ padding: 12, borderRadius: 12, background: "rgba(255,255,255,0.06)" }}>
                <div style={{ fontWeight: 700 }}>Liquidity</div>
                <div style={{ opacity: 0.85, marginTop: 6 }}>{out.liquidity?.english ?? "—"}</div>
              </div>
            </div>

            {Array.isArray(snap.bullets) && snap.bullets.length ? (
              <div style={{ marginTop: 16 }}>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Notes</div>
                <ul style={{ margin: 0, paddingLeft: 18, opacity: 0.9 }}>
                  {snap.bullets.map((b: string, i: number) => (
                    <li key={i} style={{ marginBottom: 6 }}>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
