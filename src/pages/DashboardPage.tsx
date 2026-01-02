// src/pages/DashboardPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import type { EngineSnapshot } from "../engine/types";
import { fetchSnapshot } from "../engine/api";
import TrimCard from "../ui/cards/TrimCard";

function formatPct(x: number) {
  const v = Math.round(x * 100);
  return `${v}%`;
}

export default function DashboardPage() {
  const [ticker, setTicker] = useState("QCLS");
  const [loading, setLoading] = useState(false);
  const [snap, setSnap] = useState<EngineSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);

  const safeTicker = useMemo(() => (ticker || "").toUpperCase().trim(), [ticker]);

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const s = await fetchSnapshot(safeTicker);
      setSnap(s);
    } catch (e: any) {
      setError("Snapshot fetch failed.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // initial load
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page">
      <div className="topbar">
        <div>
          <div className="h1">Knox 007</div>
          <div className="sub">Ticker → Snapshot → Zones → TP/Trim (intraday)</div>
        </div>

        <div className="ticker-input">
          <input
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            placeholder="Enter ticker (e.g., QCLS)"
            autoCapitalize="characters"
          />
          <button className="btn" onClick={run} disabled={loading || !safeTicker}>
            {loading ? "Loading..." : "Run"}
          </button>
        </div>
      </div>

      {error ? <div className="card" style={{ borderColor: "rgba(255,80,80,.35)" }}>{error}</div> : null}

      {!snap ? (
        <div className="grid">
          <div className="card">Loading snapshot…</div>
        </div>
      ) : (
        <div className="grid">
          {/* Decision / Summary */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Decision Snapshot</div>
              <span className="badge">{snap.ticker}</span>
            </div>

            <div style={{ marginTop: 8, fontSize: 18, fontWeight: 700 }}>
              {snap.headline}
            </div>

            <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <span className="badge blue">P↑ {formatPct(snap.p_up)}</span>
              <span className="badge green">EV {snap.ev.toFixed(2)}</span>
              <span className="badge purple">Tier {snap.tier}</span>
              <span className="badge">Size {snap.sizePct}%</span>
              {typeof snap.price === "number" ? <span className="badge">Px {snap.price.toFixed(2)}</span> : null}
            </div>

            <div style={{ marginTop: 12, color: "var(--text-secondary)", fontSize: 13 }}>
              {snap.bullets.slice(0, 3).map((b, i) => (
                <div key={i}>• {b}</div>
              ))}
            </div>
          </div>

          {/* Buy / Invalidation / TP Ladder */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Zones</div>
              <span className="badge">Intraday</span>
            </div>

            <div style={{ marginTop: 10 }}>
              <div className="row">
                <div className="label">Buy Zone</div>
                <div className="value">
                  {snap.zones.buyZone.lo.toFixed(2)} – {snap.zones.buyZone.hi.toFixed(2)}
                </div>
              </div>
              <div className="muted">
                • {snap.zones.buyZone.rationale.slice(0, 2).join(" • ")}
              </div>

              <div style={{ height: 10 }} />

              <div className="row">
                <div className="label">Invalidation</div>
                <div className="value">
                  {snap.zones.invalidation.price.toFixed(2)}
                </div>
              </div>
              <div className="muted">
                • {snap.zones.invalidation.rationale.slice(0, 2).join(" • ")}
              </div>

              <div style={{ height: 14 }} />

              <div className="card-title" style={{ fontSize: 14 }}>TP Ladder</div>
              <div style={{ marginTop: 8, display: "grid", gap: 8 }}>
                {snap.zones.tpLadder.map((tp) => (
                  <div key={tp.label} className="tp-row">
                    <div className="tp-pill">{tp.label}</div>
                    <div className="tp-level">{tp.level.toFixed(2)}</div>
                    <div className="tp-pct">{tp.pctTrim}% trim</div>
                  </div>
                ))}
              </div>
              <div className="muted" style={{ marginTop: 8 }}>
                Sell in momentum always. No “exit” unless invalidation / collapse.
              </div>
            </div>
          </div>

          {/* Trim Intensity Card */}
          <TrimCard snap={snap} />

          {/* Microstructure (L2/L3/L4 hook point) */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Order-Book / Microstructure</div>
              <span className="badge purple">OBE</span>
            </div>

            <div style={{ marginTop: 10 }} className="row">
              <div className="label">OBE Score</div>
              <div className="value">{typeof snap.micro.obeScore === "number" ? snap.micro.obeScore : "—"}</div>
            </div>

            <div className="row">
              <div className="label">Imbalance</div>
              <div className="value">
                {typeof snap.micro.bidAskImbalance === "number" ? snap.micro.bidAskImbalance.toFixed(2) : "—"}
              </div>
            </div>

            <div style={{ marginTop: 10 }} className="muted">
              • “Sell all” is reserved for confirmed structural failure + thinning/void conditions (not just noise).
            </div>

            {snap.micro.notes?.length ? (
              <div style={{ marginTop: 10 }} className="muted">
                {snap.micro.notes.slice(0, 3).map((n, i) => (
                  <div key={i}>• {n}</div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
