import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { fetchEngine } from "../engine/api";
import type { EngineSnapshot, EngineOutput } from "../engine/types";
import EngineCardStack from "../ui/EngineCardStack";

function normTicker(s: string): string {
  return (s ?? "").trim().toUpperCase();
}

export default function StockDetailPage() {
  const nav = useNavigate();
  const params = useParams();
  const ticker = useMemo(() => normTicker(params.ticker ?? ""), [params.ticker]);

  const [snap, setSnap] = useState<EngineSnapshot | null>(null);
  const [out, setOut] = useState<EngineOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    if (!ticker) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchEngine(ticker);
      setSnap(res.snap);
      setOut(res.out);
    } catch (e) {
      console.error("[Knox] Detail fetchEngine error:", e);
      setError("Load failed");
      setSnap(null);
      setOut(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticker]);

  return (
    <div className="knox-shell">
      {/* Top bar */}
      <div className="knox-topbar">
        <div className="knox-title">
          <h1 style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              className="badge"
              onClick={() => nav("/")}
              style={{ cursor: "pointer" }}
              aria-label="Back to watchlist"
            >
              ← Back
            </button>
            {ticker || "—"} Detail
          </h1>
          <p>Overview • Snapshot • Levels • Flow</p>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            className="badge purple"
            onClick={run}
            disabled={loading || !ticker}
            style={{ cursor: "pointer" }}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Section A — Simple chart placeholder (we’ll upgrade next step) */}
      <div className="knox-card span-2" style={{ marginBottom: 12 }}>
        <div className="card-header">
          <div className="card-title">Chart (fast view)</div>
          <div className="badge">Helsinki candles • TP lines • Zones (next step)</div>
        </div>

        <div
          style={{
            height: 180,
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(18,22,35,0.35)",
            display: "grid",
            placeItems: "center",
            color: "var(--text-muted)",
            fontSize: 12,
          }}
        >
          Chart renders here next step (lightweight, uncluttered).
        </div>

        <div style={{ marginTop: 10, color: "var(--text-secondary)", fontSize: 12 }}>
          Goal: simple + fast chart, shaded horizontal zones, TP ladder (green), stop/invalidation, and a
          table summary below.
        </div>
      </div>

      {/* Status / Error */}
      {loading && (
        <div className="knox-card">
          <div className="card-title">Loading…</div>
        </div>
      )}

      {error && (
        <div className="knox-card">
          <div className="card-title">Error</div>
          <div style={{ color: "var(--status-red)", marginTop: 6 }}>{error}</div>
        </div>
      )}

      {/* Section B — Engine cards */}
      {!loading && snap && out && <EngineCardStack data={{ snap, out }} />}

      {/* Section C — Volume Profile + Order Book placeholders (wired next) */}
      <div className="grid-cards" style={{ marginTop: 12 }}>
        <div className="knox-card">
          <div className="card-header">
            <div className="card-title">Volume Profile</div>
            <div className="badge">POC / value area</div>
          </div>
          <div style={{ color: "var(--text-muted)", fontSize: 12 }}>
            Placeholder — next step: volume profile chart below price chart + English summary under it.
          </div>
        </div>

        <div className="knox-card">
          <div className="card-header">
            <div className="card-title">Order Book</div>
            <div className="badge">L2/L3/L4 aggregation</div>
          </div>
          <div style={{ color: "var(--text-muted)", fontSize: 12 }}>
            Placeholder — next step: order book + volume flow below profile.
          </div>
        </div>
      </div>
    </div>
  );
}
