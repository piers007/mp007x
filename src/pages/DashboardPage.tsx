import { useEffect, useState } from "react";

/**
 * DashboardPage
 * Contract-safe, backend-driven snapshot renderer.
 * No hard dependency on EngineSnapshot typing.
 */

type Snapshot = {
  ticker?: string;
  headline?: string;

  decision?: {
    bias?: string;
    tier?: number;
    p_up?: number;
    ev?: number;
    sizePct?: number;
    confidence?: number;
    bullets?: string[];
  };

  zones?: {
    entry?: { price: number; label?: string; strength?: string }[];
    stop?: { price: number; label?: string };
    targets?: { price: number; label?: string }[];
  };

  trim?: {
    tis?: number;
    nextWindowMin?: number;
    suggestedPct?: number;
  };

  structure?: {
    health?: number;
    status?: string;
    notes?: string[];
  };

  liquidity?: {
    state?: string;
    voidZones?: number;
    absorptionShelves?: number;
  };

  momentum?: {
    state?: string;
    orderbook?: string;
  };
};

export default function DashboardPage() {
  const [snap, setSnap] = useState<Snapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load(ticker: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/analyze?ticker=${ticker}`);
      if (!res.ok) throw new Error("Load failed");
      const json = await res.json();
      setSnap(json);
    } catch (e: any) {
      setError(e.message || "Load failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load("QCLS"); // default boot ticker
  }, []);

  if (loading) {
    return <div className="knox-card">Loading…</div>;
  }

  if (error) {
    return (
      <div className="knox-card" style={{ borderColor: "#E06C75" }}>
        <strong>Error</strong>
        <div>{error}</div>
      </div>
    );
  }

  if (!snap) return null;

  return (
    <div className="knox-shell">
      {/* HEADER */}
      <div className="knox-card">
        <div className="card-header">
          <div>
            <h2>{snap.ticker ?? "—"}</h2>
            <div style={{ color: "var(--text-muted)" }}>
              {snap.headline ?? "Decision Snapshot"}
            </div>
          </div>
          <button className="badge purple" onClick={() => load(snap.ticker ?? "QCLS")}>
            Analyze
          </button>
        </div>
      </div>

      {/* DECISION */}
      {snap.decision && (
        <div className="knox-card">
          <div className="card-header">
            <span className="card-title">Decision</span>
            <span className="badge purple">
              {snap.decision.bias ?? "—"} · Tier {snap.decision.tier ?? "—"}
            </span>
          </div>

          <div className="pill-row">
            <span className="badge green">p_up {Math.round((snap.decision.p_up ?? 0) * 100)}%</span>
            <span className="badge">EV/R {snap.decision.ev ?? "—"}</span>
            <span className="badge yellow">Size {snap.decision.sizePct ?? "—"}%</span>
            <span className="badge">Conf {snap.decision.confidence ?? "—"}%</span>
          </div>

          <ul style={{ marginTop: 10 }}>
            {(snap.decision.bullets ?? []).map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ENTRY ZONES */}
      {snap.zones?.entry && (
        <div className="knox-card">
          <div className="card-header">
            <span className="card-title">Entry Zones</span>
          </div>
          {snap.zones.entry.map((z, i) => (
            <div key={i} className="pill-row">
              <strong>${z.price.toFixed(2)}</strong>
              <span className="badge">{z.strength ?? z.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* TARGETS + STOP */}
      {snap.zones && (
        <div className="knox-card">
          <div className="card-header">
            <span className="card-title">Targets + Stop</span>
          </div>

          {snap.zones.stop && (
            <div className="pill-row">
              <strong>SL</strong>
              <span className="badge red">${snap.zones.stop.price.toFixed(2)}</span>
            </div>
          )}

          {(snap.zones.targets ?? []).map((t, i) => (
            <div key={i} className="pill-row">
              <strong>TP{i + 1}</strong>
              <span className="badge green">${t.price.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}

      {/* TRIM */}
      {snap.trim && (
        <div className="knox-card">
          <div className="card-header">
            <span className="card-title">Trim (TIS)</span>
            <span className="badge purple">TIS {snap.trim.tis}</span>
          </div>

          <div className="gauge">
            <div
              className="fill"
              style={{ width: `${Math.min(snap.trim.tis ?? 0, 100)}%` }}
            />
          </div>

          <div style={{ marginTop: 8 }}>
            Next Trim Window: {snap.trim.nextWindowMin ?? "—"}m
          </div>

          <div className="trim-overlay">
            Trim Suggested
            <strong style={{ display: "block", marginTop: 4 }}>
              {snap.trim.suggestedPct ?? "—"}% of initial
            </strong>
          </div>
        </div>
      )}

      {/* STRUCTURE */}
      {snap.structure && (
        <div className="knox-card">
          <div className="card-header">
            <span className="card-title">Structure</span>
            <span className="badge">{Math.round((snap.structure.health ?? 0) * 100)}%</span>
          </div>
          <div>Exit only if: {snap.structure.status}</div>
          {(snap.structure.notes ?? []).map((n, i) => (
            <div key={i}>• {n}</div>
          ))}
        </div>
      )}

      {/* LIQUIDITY */}
      {snap.liquidity && (
        <div className="knox-card">
          <div className="card-header">
            <span className="card-title">Liquidity</span>
            <span className="badge purple">{snap.liquidity.state}</span>
          </div>
          <div>Void zones: {snap.liquidity.voidZones}</div>
          <div>Absorption shelves: {snap.liquidity.absorptionShelves}</div>
        </div>
      )}

      {/* MOMENTUM */}
      {snap.momentum && (
        <div className="knox-card">
          <div className="card-header">
            <span className="card-title">Flow / Momentum</span>
            <span className="badge green">{snap.momentum.state}</span>
          </div>
          <div>Orderbook: {snap.momentum.orderbook}</div>
        </div>
      )}
    </div>
  );
}
