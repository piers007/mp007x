import React, { useEffect, useState } from "react";
import { fetchEngine } from "../engine/api";
import type { EngineSnapshot, EngineOutput } from "../engine/types";

export default function DashboardPage() {
  const [ticker, setTicker] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [snap, setSnap] = useState<EngineSnapshot | null>(null);
  const [out, setOut] = useState<EngineOutput | null>(null);

  async function run(input: string) {
    const t = input.trim().toUpperCase();

    // 🛑 HARD GUARD — never call backend with empty ticker
    if (!t) {
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetchEngine(t);
      setSnap(res.snap);
      setOut(res.out);
    } catch (e: any) {
      console.error("[Knox] fetchEngine error:", e?.message ?? e, e?.stack ?? "");
      setError("Load failed");
      setSnap(null);
      setOut(null);
    } finally {
      setLoading(false);
    }
  }

  // 🚫 DO NOT auto-run on mount
  // Backend requires a non-empty ticker
  useEffect(() => {
    // intentionally empty
  }, []);

  return (
    <div style={{ padding: 16, maxWidth: 900, margin: "0 auto" }}>
      {/* Input Row */}
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <input
          value={ticker}
          placeholder="Ticker (e.g., QCLS)"
          onChange={(e) => setTicker(e.target.value)}
          style={{
            flex: 1,
            padding: 12,
            fontSize: 16,
            borderRadius: 8,
          }}
        />
        <button
          onClick={() => run(ticker)}
          disabled={loading}
          style={{
            padding: "12px 18px",
            fontSize: 16,
            borderRadius: 8,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Loading…" : "Analyze"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            borderRadius: 10,
            background: "rgba(180,40,40,0.15)",
            border: "1px solid rgba(255,90,90,0.6)",
          }}
        >
          <strong>Error</strong>
          <div>{error}</div>
        </div>
      )}

      {/* No data */}
      {!loading && !error && !snap && (
        <div style={{ marginTop: 20, opacity: 0.6 }}>No data yet.</div>
      )}

      {/* SNAPSHOT */}
      {snap && (
        <div style={{ marginTop: 24 }}>
          <h2>
            {snap.ticker} · {snap.verdict}
          </h2>
          <p>{snap.headline}</p>

          {/* Trim */}
          {snap.trim && (
            <div style={{ marginTop: 16 }}>
              <h3>Trim</h3>
              <div>
                TIS: {snap.trim.tis} · Suggested Trim:{" "}
                {snap.trim.suggestedTrimPct}% · Next:{" "}
                {snap.trim.nextWindow ?? "—"}
              </div>
              <div>{snap.trim.english}</div>
            </div>
          )}
        </div>
      )}

      {/* OUTPUT CARDS */}
      {out && (
        <div style={{ marginTop: 24 }}>
          {/* Entry */}
          {out.entry && (
            <div style={{ marginBottom: 16 }}>
              <h3>Entry</h3>
              {out.entry.idealEntry ? (
                <div>
                  Zone: {out.entry.idealEntry.low} –{" "}
                  {out.entry.idealEntry.high} · SL:{" "}
                  {out.entry.invalidation ?? "—"}
                </div>
              ) : (
                <div>No entry zone</div>
              )}
              <div>{out.entry.english}</div>
            </div>
          )}

          {/* Targets */}
          {out.targets && (
            <div style={{ marginBottom: 16 }}>
              <h3>Targets</h3>
              <div>
                TP1: {out.targets.tp1 ?? "—"} · TP2:{" "}
                {out.targets.tp2 ?? "—"} · TP3:{" "}
                {out.targets.tp3 ?? "—"}
              </div>
              <div>{out.targets.english}</div>
            </div>
          )}

          {/* Liquidity */}
          {out.liquidity && (
            <div style={{ marginBottom: 16 }}>
              <h3>Liquidity</h3>
              <div>{out.liquidity.english}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
