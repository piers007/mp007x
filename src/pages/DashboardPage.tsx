import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchEngine } from "../engine/api";
import type { EngineSnapshot, EngineOutput } from "../engine/types";
import EngineCardStack from "../ui/EngineCardStack";

type WatchItem = {
  ticker: string;
  lastSnap?: EngineSnapshot | null;
  lastOut?: EngineOutput | null;
  updatedAt?: number;
};

const MAX_WATCH = 15;

function normTicker(s: string): string {
  return (s ?? "").trim().toUpperCase();
}

function parseCommand(raw: string): { cmd: "add" | "rm" | "none"; ticker?: string } {
  const t = (raw ?? "").trim();
  if (!t.startsWith("/")) return { cmd: "none" };

  const parts = t.split(/\s+/);
  const c = (parts[0] ?? "").toLowerCase();
  const arg = normTicker(parts[1] ?? "");

  if ((c === "/add" || c === "/watch" || c === "/w") && arg) return { cmd: "add", ticker: arg };
  if ((c === "/rm" || c === "/remove" || c === "/unwatch") && arg) return { cmd: "rm", ticker: arg };
  return { cmd: "none" };
}

function scoreSnap(s?: EngineSnapshot | null): number {
  if (!s) return -9999;
  const tier = Number.isFinite(s.tier) ? s.tier : 0;
  const pUp = Number.isFinite(s.p_up) ? s.p_up : 0;
  const ev = Number.isFinite(s.ev) ? s.ev : 0;

  const tierBoost = tier === 1 ? 3 : tier === 2 ? 2 : tier === 3 ? 1 : 0;
  return tierBoost * 1000 + pUp * 100 + ev * 10;
}

export default function DashboardPage() {
  const nav = useNavigate();

  const [query, setQuery] = useState<string>("");
  const [active, setActive] = useState<string>(""); // last analyzed ticker (optional)
  const [snap, setSnap] = useState<EngineSnapshot | null>(null);
  const [out, setOut] = useState<EngineOutput | null>(null);
  const [watch, setWatch] = useState<WatchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function quickAnalyze(t: string) {
    const tt = normTicker(t);
    if (!tt) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetchEngine(tt);
      setSnap(res.snap);
      setOut(res.out);
      setActive(tt);

      setWatch((prev) =>
        prev.map((w) =>
          w.ticker === tt ? { ...w, lastSnap: res.snap, lastOut: res.out, updatedAt: Date.now() } : w
        )
      );
    } catch (e: any) {
      console.error("[Knox] fetchEngine error:", e);
      setError("Load failed");
      setSnap(null);
      setOut(null);
    } finally {
      setLoading(false);
    }
  }

  function addToWatch(t: string) {
    const tt = normTicker(t);
    if (!tt) return;

    setWatch((prev) => {
      if (prev.some((w) => w.ticker === tt)) return prev;
      if (prev.length >= MAX_WATCH) return prev;
      return [...prev, { ticker: tt }];
    });
  }

  function removeFromWatch(t: string) {
    const tt = normTicker(t);
    if (!tt) return;
    setWatch((prev) => prev.filter((w) => w.ticker !== tt));

    if (active === tt) {
      setActive("");
      setSnap(null);
      setOut(null);
    }
  }

  function handleSubmit() {
    const raw = query.trim();
    if (!raw) return;

    const parsed = parseCommand(raw);

    if (parsed.cmd === "add" && parsed.ticker) {
      addToWatch(parsed.ticker);
      setQuery("");
      return;
    }
    if (parsed.cmd === "rm" && parsed.ticker) {
      removeFromWatch(parsed.ticker);
      setQuery("");
      return;
    }

    // Default: treat as ticker → go to detail page
    const t = normTicker(raw);
    if (t) nav(`/t/${encodeURIComponent(t)}`);
    setQuery("");
  }

  const sortedWatch = useMemo(() => {
    const copy = [...watch];
    copy.sort((a, b) => scoreSnap(b.lastSnap) - scoreSnap(a.lastSnap));
    return copy;
  }, [watch]);

  useEffect(() => {
    // no defaults
  }, []);

  return (
    <div className="knox-shell">
      {/* SECTION 1 — Ask Knox */}
      <div className="knox-topbar">
        <div className="knox-title">
          <h1>Knox 007</h1>
          <p>Intraday decision snapshot</p>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            className="input"
            placeholder='Type ticker or "/add SEV"'
            value={query}
            onChange={(e) => setQuery(e.target.value.toUpperCase())}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            style={{ width: 220 }}
          />

          <button
            className="badge purple"
            onClick={handleSubmit}
            disabled={loading || !query.trim()}
            style={{ cursor: "pointer" }}
          >
            Go
          </button>
        </div>
      </div>

      {/* SECTION 2 — Watchlist */}
      <div className="knox-card" style={{ marginBottom: 12 }}>
        <div className="card-header">
          <div className="card-title">Watchlist (≤ {MAX_WATCH})</div>
          <div className="badge">{sortedWatch.length} today</div>
        </div>

        {sortedWatch.length === 0 ? (
          <div style={{ color: "var(--text-muted)", fontSize: 12 }}>
            Add with <b>/add TICKER</b>. Example: <b>/add SEV</b>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {sortedWatch.map((w) => {
              const s = w.lastSnap;
              const verdict = s?.verdict ?? "—";
              const pUp = s?.p_up != null ? Math.round(s.p_up * 100) : null;
              const tier = s?.tier ?? null;

              const badgeClass =
                verdict === "BUY" ? "green" : verdict === "HOLD" ? "yellow" : verdict === "WAIT" ? "red" : "";

              return (
                <div
                  key={w.ticker}
                  className="watch-pill"
                  style={{ minWidth: "unset", width: "100%" }}
                  onClick={() => nav(`/t/${encodeURIComponent(w.ticker)}`)}
                >
                  <div className="pill-row">
                    <div>
                      <div className="pill-ticker" style={{ fontSize: 16 }}>
                        {w.ticker}
                      </div>
                      <div className="pill-sub">
                        {tier != null ? `Tier ${tier}` : "—"} • {pUp != null ? `P(up) ${pUp}%` : "P(up) —"}
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div className={`badge ${badgeClass}`}>{verdict}</div>

                      {/* Quick analyze (optional) */}
                      <button
                        className="badge"
                        onClick={(e) => {
                          e.stopPropagation();
                          quickAnalyze(w.ticker);
                        }}
                        style={{ cursor: "pointer" }}
                        aria-label={`Quick analyze ${w.ticker}`}
                      >
                        Analyze
                      </button>

                      <button
                        className="badge"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromWatch(w.ticker);
                        }}
                        style={{ cursor: "pointer" }}
                        aria-label={`Remove ${w.ticker}`}
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {s?.headline ? (
                    <div style={{ marginTop: 8, color: "var(--text-secondary)", fontSize: 12 }}>
                      {s.headline}
                    </div>
                  ) : (
                    <div style={{ marginTop: 8, color: "var(--text-muted)", fontSize: 12 }}>
                      Tap to open detail • or Analyze to cache snapshot
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* STATUS / ERROR */}
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

      {/* Optional quick preview stack (only if you used Analyze) */}
      {!loading && snap && out && <EngineCardStack data={{ snap, out }} />}

      {!loading && !snap && !error && (
        <div className="knox-card">
          <div className="card-title">No active ticker</div>
          <div style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 6 }}>
            Use <b>/add</b> to build your watchlist, then tap a card to open detail.
          </div>
        </div>
      )}
    </div>
  );
}
