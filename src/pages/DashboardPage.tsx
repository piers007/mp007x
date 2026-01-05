import React, { useEffect, useState } from "react";
import { fetchEngine } from "../engine/api";
import type { EngineSnapshot, EngineOutput } from "../engine/types";
import EngineCardStack from "../ui/EngineCardStack";

export default function DashboardPage() {
  const [ticker, setTicker] = useState<string>(""); // start empty
  const [snap, setSnap] = useState<EngineSnapshot | null>(null);
  const [out, setOut] = useState<EngineOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---- core runner ----
  async function run(t: string) {
    const tt = (t ?? "").trim().toUpperCase();
    if (!tt) return; // ✅ guard: never hit backend with empty ticker

    setLoading(true);
    setError(null);

    try {
      const res = await fetchEngine(tt);
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

  // ---- initial load guard ----
  useEffect(() => {
    const tt = (ticker ?? "").trim();
    if (!tt) return; // ✅ prevents initial 422
    run(tt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="knox-shell">
      {/* =========================
          TOP BAR / SEARCH
         ========================= */}
      <div className="knox-topbar">
        <div className="knox-title">
          <h1>Knox 007</h1>
          <p>Decision snapshot</p>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <input
            className="input"
            placeholder="Ask Knox about a ticker…"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            onKeyDown={(e) => {
              if (e.key === "Enter") run(ticker);
            }}
            style={{ width: 160 }}
          />
          <button
            className="badge purple"
            onClick={() => run(ticker)}
            disabled={loading || !ticker.trim()}
            style={{ cursor: "pointer" }}
          >
            Analyze
          </button>
        </div>
      </div>

      {/* =========================
          STATUS / ERROR
         ========================= */}
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

      {/* =========================
          MAIN CONTENT
         ========================= */}
      {!loading && snap && out && (
        <EngineCardStack data={{ snap, out }} />
      )}

      {!loading && !snap && !error && (
        <div className="knox-card">
          <div className="card-title">No data yet</div>
          <div style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 6 }}>
            Enter a ticker above and press Analyze.
          </div>
        </div>
      )}
    </div>
  );
}
