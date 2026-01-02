// src/pages/DashboardPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import type { EngineSnapshot } from "../engine/types";
import { fetchSnapshot } from "../engine/api";
import TrimCard from "../ui/cards/TrimCard";

function pct(x: number) {
  const v = Math.round(x * 100);
  return `${v}%`;
}

function statusColorFromTier(tier: number) {
  if (tier >= 3) return "green";
  if (tier === 2) return "yellow";
  return "red";
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
    } catch {
      setError("Snapshot fetch failed.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tierDot = snap ? statusColorFromTier(snap.tier) : "yellow";

  return (
    <>
      {/* TOP BAR */}
      <div className="knox-topbar">
        <div className="knox-title">
          <h1>Knox 007</h1>
          <p>Intraday engine • Snapshot cards • Trim in momentum • Exit only on invalidation</p>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div className={`status-dot ${tierDot}`} />
          <div style={{ width: 180 }}>
            <input
              className="input"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              placeholder="Ticker (e.g., QCLS)"
              autoCapitalize="characters"
            />
          </div>
          <button
            onClick={run}
            disabled={loading || !safeTicker}
            style={{
              borderRadius: "var(--radius-md)",
              border: "1px solid rgba(122,92,255,0.20)",
              background: "rgba(18,22,35,0.55)",
              color: "var(--text-primary)",
              padding: "12px 12px",
              cursor: loading ? "default" : "pointer",
              transition: "box-shadow var(--t-fast) var(--ease)",
            }}
          >
            {loading ? "Loading…" : "Run"}
          </button>
        </div>
      </div>

      {error ? (
        <div className="knox-card" style={{ borderColor: "rgba(224,108,117,0.35)" }}>
          <div className="card-title">Error</div>
          <div style={{ marginTop: 6 }}>{error}</div>
        </div>
      ) : null}

      {/* GRID */}
      <div className="grid-cards">
        {/* DECISION SNAPSHOT */}
        <div className="knox-card span-2">
          <div className="card-header">
            <div className="card-title">Decision Snapshot</div>
            <span className="badge">{snap?.ticker ?? "—"}</span>
          </div>

          {!snap ? (
            <div style={{ color: "var(--text-secondary)" }}>Loading snapshot…</div>
          ) : (
            <>
              <div style={{ fontSize: 18, fontWeight: 800 }}>{snap.headline}</div>

              <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <span className="badge purple">P↑ {pct(snap.p_up)}</span>
                <span className="badge green">EV {snap.ev.toFixed(2)}</span>
                <span className="badge yellow">Tier {snap.tier}</span>
                <span className="badge">Size {snap.sizePct}%</span>
                {typeof snap.price === "number" ? (
                  <span className="badge">Px {snap.price.toFixed(2)}</span>
                ) : null}
              </div>

              <div style={{ marginTop: 10, color: "var(--text-secondary)", fontSize: 12 }}>
                {snap.bullets.slice(0, 3).map((b, i) => (
                  <div key={i}>• {b}</div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ZONES */}
        <div className="knox-card">
          <div className="card-header">
            <div className="card-title">Zones</div>
            <span className="badge purple">Knox</span>
          </div>

          {!snap ? (
            <div style={{ color: "var(--text-secondary)" }}>—</div>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div>
                  <div className="card-title" style={{ textTransform: "none" }}>Buy Zone</div>
                  <div style={{ fontSize: 16, fontWeight: 800 }}>
                    {snap.zones.buyZone.lo.toFixed(2)} – {snap.zones.buyZone.hi.toFixed(2)}
                  </div>
                  <div style={{ marginTop: 6, fontSize: 12, color: "var(--text-secondary)" }}>
                    • {snap.zones.buyZone.rationale.slice(0, 2).join(" • ")}
                  </div>
                </div>
              </div>

              <div style={{ height: 12 }} />

              <div>
                <div className="card-title" style={{ textTransform: "none" }}>Invalidation</div>
                <div style={{ fontSize: 16, fontWeight: 800 }}>
                  {snap.zones.invalidation.price.toFixed(2)}
                </div>
                <div style={{ marginTop: 6, fontSize: 12, color: "var(--text-secondary)" }}>
                  • {snap.zones.invalidation.rationale.slice(0, 2).join(" • ")}
                </div>
              </div>

              <div style={{ height: 12 }} />

              <div>
                <div className="card-title" style={{ textTransform: "none" }}>TP Ladder</div>
                <div style={{ marginTop: 8, display: "grid", gap: 8 }}>
                  {snap.zones.tpLadder.map((tp) => (
                    <div
                      key={tp.label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 10,
                        padding: "10px",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid rgba(122,92,255,0.14)",
                        background: "rgba(18,22,35,0.45)",
                      }}
                    >
                      <span className="badge">{tp.label}</span>
                      <div style={{ fontWeight: 800 }}>{tp.level.toFixed(2)}</div>
                      <span className="badge yellow">{tp.pctTrim}% trim</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 10, fontSize: 12, color: "var(--text-muted)" }}>
                  Rule: trim in momentum only. Exit only on invalidation / math-collapse.
                </div>
              </div>
            </>
          )}
        </div>

        {/* TRIM */}
        {snap ? <TrimCard snap={snap} /> : <div className="knox-card">Loading trim…</div>}

        {/* MICROSTRUCTURE */}
        <div className="knox-card">
          <div className="card-header">
            <div className="card-title">Order Book / Microstructure</div>
            <span className="badge purple">L2/L3/L4</span>
          </div>

          {!snap ? (
            <div style={{ color: "var(--text-secondary)" }}>—</div>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div style={{ color: "var(--text-secondary)", fontSize: 12 }}>OBE Score</div>
                <div style={{ fontWeight: 800 }}>
                  {typeof snap.micro.obeScore === "number" ? snap.micro.obeScore : "—"}
                </div>
              </div>

              <div style={{ height: 10 }} />

              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div style={{ color: "var(--text-secondary)", fontSize: 12 }}>Imbalance</div>
                <div style={{ fontWeight: 800 }}>
                  {typeof snap.micro.bidAskImbalance === "number"
                    ? snap.micro.bidAskImbalance.toFixed(2)
                    : "—"}
                </div>
              </div>

              <div style={{ marginTop: 10, fontSize: 12, color: "var(--text-secondary)" }}>
                • “Sell all” is reserved for confirmed structural failure + thinning/void conditions.
              </div>

              {snap.micro.notes?.length ? (
                <div style={{ marginTop: 10, fontSize: 12, color: "var(--text-secondary)" }}>
                  {snap.micro.notes.slice(0, 3).map((n, i) => (
                    <div key={i}>• {n}</div>
                  ))}
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </>
  );
}
