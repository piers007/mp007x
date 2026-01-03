import React, { useMemo, useState } from "react";
import { analyze } from "../engine/api";
import type { AnalyzeResponse } from "../engine/types";
import { mockEngineOutput } from "../test/mockEngineOutput";
import { EngineCardStack } from "../ui/EngineCardStack";

const WATCH = ["QCLS", "MTC", "SGBX", "REAL", "TSLA"];

function badgeColor(state: string) {
  if (state === "BUY") return "green";
  if (state === "TRIM") return "yellow";
  if (state === "EXIT") return "red";
  if (state === "NO_TRADE") return "red";
  return "purple";
}

export default function DashboardPage() {
  const [ticker, setTicker] = useState<string>(WATCH[0]);
  const [loading, setLoading] = useState(false);
  const [snap, setSnap] = useState<AnalyzeResponse | null>(mockEngineOutput);
  const [error, setError] = useState<string | null>(null);

  const decision = snap?.decision;

  const headline = useMemo(() => {
    if (!snap) return "Ready";
    const d = snap.decision;
    return `${snap.ticker} — ${d.state} (${d.bias})`;
  }, [snap]);

  async function run(t: string) {
    setError(null);
    setLoading(true);
    try {
      const out = await analyze({ ticker: t, mode: "INTRADAY" });
      setSnap(out);
    } catch (e: any) {
      setError(e?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="knox-shell">
      <div className="knox-topbar">
        <div className="knox-title">
          <h1>Knox 007 — Decision Snapshot</h1>
          <p>{headline}</p>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {decision && (
            <span className={`badge ${badgeColor(decision.state)}`}>
              {decision.state} • Tier {decision.tier}
            </span>
          )}
          <button
            className="badge"
            style={{ cursor: "pointer" }}
            onClick={() => run(ticker)}
            disabled={loading}
            title="Run /v1/analyze"
          >
            {loading ? "Running…" : "Analyze"}
          </button>
        </div>
      </div>

      <div className="knox-card">
        <input
          className="input"
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          placeholder="Ticker (e.g. QCLS)"
          autoCapitalize="characters"
          autoCorrect="off"
        />

        <div className="watchlist">
          {WATCH.map((t) => (
            <div
              key={t}
              className={`watch-pill ${t === ticker ? "active" : ""}`}
              onClick={() => {
                setTicker(t);
                run(t);
              }}
            >
              <div className="pill-row">
                <div className="pill-ticker">{t}</div>
                <span className="badge purple">INTRADAY</span>
              </div>
              <div className="pill-sub">Tap to run</div>
            </div>
          ))}
        </div>

        {error && (
          <div className="trim-overlay" style={{ borderColor: "rgba(224,108,117,0.35)" }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Error</div>
            <div style={{ color: "var(--text-secondary)", fontSize: 13 }}>{error}</div>
          </div>
        )}
      </div>

      {snap && (
        <div style={{ marginTop: 12 }}>
          <EngineCardStack snap={snap} />
        </div>
      )}
    </div>
  );
}
