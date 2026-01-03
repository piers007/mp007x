// src/pages/DashboardPage.tsx
import React, { useEffect, useMemo, useState } from 'react';
import type { EngineSnapshot, ZoneLine } from '../engine/types';
import { fetchSnapshot } from '../engine/api';

function pct(n?: number): string {
  if (typeof n !== 'number' || Number.isNaN(n)) return '—';
  return `${Math.round(n * 100)}%`;
}

function num(n?: number, digits: number = 2): string {
  if (typeof n !== 'number' || Number.isNaN(n)) return '—';
  return n.toFixed(digits);
}

function money(n?: number): string {
  if (typeof n !== 'number' || Number.isNaN(n)) return '—';
  return `$${n.toFixed(2)}`;
}

function badgeForTier(t?: number): { label: string; cls: string } {
  const tier = typeof t === 'number' ? t : -1;
  if (tier >= 4) return { label: `Tier ${tier}`, cls: 'badge green' };
  if (tier >= 2) return { label: `Tier ${tier}`, cls: 'badge purple' };
  if (tier >= 0) return { label: `Tier ${tier}`, cls: 'badge yellow' };
  return { label: 'Tier —', cls: 'badge' };
}

function dotForTIS(tis?: number): { cls: string; label: string } {
  const v = typeof tis === 'number' ? tis : -1;
  if (v >= 70) return { cls: 'status-dot green', label: 'Strong' };
  if (v >= 50) return { cls: 'status-dot yellow', label: 'Neutral' };
  if (v >= 0) return { cls: 'status-dot red', label: 'Weak' };
  return { cls: 'status-dot', label: '—' };
}

function safeList<T>(arr?: T[]): T[] {
  return Array.isArray(arr) ? arr : [];
}

function renderLine(line: ZoneLine, i: number): JSX.Element {
  return (
    <div key={`${line.label}-${i}`} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
      <div style={{ color: 'var(--text-secondary)' }}>{line.label}</div>
      <div style={{ fontWeight: 700 }}>
        {money(line.price)}
        {typeof line.pctFromPrice === 'number' ? (
          <span style={{ marginLeft: 10, color: 'var(--text-muted)', fontWeight: 600 }}>
            ({line.pctFromPrice.toFixed(1)}%)
          </span>
        ) : null}
      </div>
    </div>
  );
}

export default function DashboardPage(): JSX.Element {
  const watchlist = useMemo<string[]>(
    () => ['SPY', 'QQQ', 'TSLA', 'NVDA', 'AAPL', 'AMD', 'MARA', 'GME'],
    []
  );

  const [ticker, setTicker] = useState<string>(watchlist[0] ?? 'SPY');
  const [active, setActive] = useState<string>(watchlist[0] ?? 'SPY');

  const [snap, setSnap] = useState<EngineSnapshot | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string | null>(null);

  async function load(t: string): Promise<void> {
    const sym = t.trim().toUpperCase();
    if (!sym) return;

    setLoading(true);
    setErr(null);

    try {
      const s = await fetchSnapshot(sym);
      setSnap(s);
      setActive(sym);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load(active);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tis = snap?.output?.tis;
  const tisDot = dotForTIS(tis);
  const tierBadge = badgeForTier(snap?.tier);

  const zones = snap?.zones;
  const tps = safeList<ZoneLine>(zones?.takeProfits);
  const gaps = safeList<ZoneLine>(zones?.demandGaps);
  const levels = safeList<ZoneLine>(zones?.levels);

  const trim = snap?.output?.trim;

  return (
    <div className="knox-shell">
      <div className="knox-topbar">
        <div className="knox-title">
          <h1>Knox 007 — Dashboard</h1>
          <p>
            iPhone-first snapshot · {snap?.timestamp ? new Date(snap.timestamp).toLocaleString() : '—'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div className={tierBadge.cls}>{tierBadge.label}</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div className={tisDot.cls} />
            <div className="badge purple">TIS {typeof tis === 'number' ? `${Math.round(tis)}%` : '—'}</div>
          </div>
        </div>
      </div>

      <div className="knox-card" style={{ marginBottom: 12 }}>
        <div className="card-header">
          <div className="card-title">Ticker</div>
          <div className="badge">{loading ? 'Loading…' : 'Ready'}</div>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <input
            className="input"
            value={ticker}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTicker(e.target.value)}
            placeholder="e.g. TSLA"
            autoCapitalize="characters"
            autoCorrect="off"
          />
          <button
            className="badge purple"
            style={{ cursor: 'pointer', padding: '10px 12px' }}
            onClick={() => void load(ticker)}
          >
            Run
          </button>
          <button
            className="badge"
            style={{ cursor: 'pointer', padding: '10px 12px' }}
            onClick={() => void load(active)}
          >
            Refresh
          </button>
        </div>

        <div className="watchlist">
          {watchlist.map((w: string) => (
            <div
              key={w}
              className={`watch-pill ${active === w ? 'active' : ''}`}
              onClick={() => {
                setTicker(w);
                void load(w);
              }}
            >
              <div className="pill-row">
                <div className="pill-ticker">{w}</div>
                <span className="badge">{active === w ? 'Active' : 'Tap'}</span>
              </div>
              <div className="pill-sub">Quick load</div>
            </div>
          ))}
        </div>

        {err ? (
          <div className="trim-overlay" style={{ borderColor: 'rgba(224,108,117,0.35)' }}>
            <div style={{ fontWeight: 800 }}>Build/Fetch Error</div>
            <div style={{ marginTop: 6, color: 'var(--text-secondary)' }}>{err}</div>
          </div>
        ) : null}
      </div>

      <div className="grid-cards">
        {/* OVERVIEW */}
        <div className="knox-card">
          <div className="card-header">
            <div className="card-title">Overview</div>
            <div className="badge">{snap?.headline ?? '—'}</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Ticker</div>
              <div style={{ fontWeight: 800, fontSize: 18 }}>{snap?.ticker ?? active}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Price</div>
              <div style={{ fontWeight: 800, fontSize: 18 }}>{money(snap?.price ?? zones?.price)}</div>
            </div>

            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>P(up)</div>
              <div style={{ fontWeight: 800 }}>{pct(snap?.p_up)}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>EV</div>
              <div style={{ fontWeight: 800 }}>{num(snap?.ev, 3)}</div>
            </div>

            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Tier</div>
              <div style={{ fontWeight: 800 }}>{typeof snap?.tier === 'number' ? snap.tier : '—'}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Size %</div>
              <div style={{ fontWeight: 800 }}>{typeof snap?.sizePct === 'number' ? `${snap.sizePct}%` : '—'}</div>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Bullets</div>
            <div style={{ marginTop: 6, color: 'var(--text-secondary)' }}>
              {safeList<string>(snap?.bullets).length ? (
                <ul style={{ paddingLeft: 18, margin: 0 }}>
                  {safeList<string>(snap?.bullets).map((b: string, i: number) => (
                    <li key={`${i}-${b}`}>{b}</li>
                  ))}
                </ul>
              ) : (
                <div>—</div>
              )}
            </div>
          </div>
        </div>

        {/* ZONES */}
        <div className="knox-card">
          <div className="card-header">
            <div className="card-title">Zones</div>
            <div className="badge">Levels</div>
          </div>

          <div style={{ display: 'grid', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ color: 'var(--text-secondary)' }}>Buy Zone</div>
              <div style={{ fontWeight: 800 }}>
                {zones?.buyZone ? `${money(zones.buyZone.low)} – ${money(zones.buyZone.high)}` : '—'}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ color: 'var(--text-secondary)' }}>Support</div>
              <div style={{ fontWeight: 800 }}>{money(zones?.support)}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ color: 'var(--text-secondary)' }}>Resistance</div>
              <div style={{ fontWeight: 800 }}>{money(zones?.resistance)}</div>
            </div>

            {zones?.stopLoss ? (
              <div style={{ marginTop: 6 }} className="trim-overlay">
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ color: 'var(--text-secondary)' }}>{zones.stopLoss.label ?? 'SL'}</div>
                  <div style={{ fontWeight: 900 }}>{money(zones.stopLoss.price)}</div>
                </div>
              </div>
            ) : null}

            {tps.length ? (
              <div style={{ marginTop: 6 }}>
                <div style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 6 }}>Take Profits</div>
                <div style={{ display: 'grid', gap: 8 }}>
                  {tps.map((line: ZoneLine, i: number) => renderLine(line, i))}
                </div>
              </div>
            ) : null}

            {gaps.length ? (
              <div style={{ marginTop: 10 }}>
                <div style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 6 }}>Demand Gaps</div>
                <div style={{ display: 'grid', gap: 8 }}>
                  {gaps.map((line: ZoneLine, i: number) => renderLine(line, i))}
                </div>
              </div>
            ) : null}

            {levels.length ? (
              <div style={{ marginTop: 10 }}>
                <div style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 6 }}>Extra Levels</div>
                <div style={{ display: 'grid', gap: 8 }}>
                  {levels.map((line: ZoneLine, i: number) => renderLine(line, i))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* TRIM */}
        <div className="knox-card">
          <div className="card-header">
            <div className="card-title">Trim Logic</div>
            <div className="badge purple">Next: {trim?.nextTrimWindow ?? '—'}</div>
          </div>

          <div style={{ display: 'grid', gap: 10 }}>
            <div className="gauge">
              <div
                className="fill"
                style={{ width: `${Math.max(0, Math.min(100, typeof tis === 'number' ? tis : 0))}%` }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ color: 'var(--text-secondary)' }}>Trim Now (% of original)</div>
              <div style={{ fontWeight: 900 }}>
                {typeof trim?.trimNowPctOrig === 'number' ? `${trim.trimNowPctOrig}%` : '—'}
              </div>
            </div>

            <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Reasons</div>
            {safeList<string>(trim?.reasons).length ? (
              <div style={{ color: 'var(--text-secondary)' }}>
                {safeList<string>(trim?.reasons)
                  .slice(0, 6)
                  .map((r: string, i: number) => (
                    <div key={`${i}-${r}`}>• {r}</div>
                  ))}
              </div>
            ) : (
              <div style={{ color: 'var(--text-secondary)' }}>—</div>
            )}

            {tis !== undefined && tis >= 60 ? (
              <div className="trim-overlay">
                <div style={{ fontWeight: 900 }}>TIS ≥ 60: Trim Box Armed</div>
                <div style={{ marginTop: 6, color: 'var(--text-secondary)' }}>
                  Trim only into momentum. Exit only on structural invalidation.
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* MICRO */}
        <div className="knox-card">
          <div className="card-header">
            <div className="card-title">Microstructure</div>
            <div className="badge">Module A/B/D</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>MPS</div>
              <div style={{ fontWeight: 900, fontSize: 18 }}>
                {typeof snap?.micro?.mps === 'number' ? snap.micro.mps : '—'}
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>SPS</div>
              <div style={{ fontWeight: 900, fontSize: 18 }}>
                {typeof snap?.micro?.sps === 'number' ? snap.micro.sps : '—'}
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>SFI</div>
              <div style={{ fontWeight: 900, fontSize: 18 }}>
                {typeof snap?.micro?.sfi === 'number' ? snap.micro.sfi : '—'}
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Spread</div>
              <div style={{ fontWeight: 900, fontSize: 18 }}>
                {typeof snap?.micro?.spread === 'number' ? num(snap.micro.spread, 4) : '—'}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Notes</div>
            {safeList<string>(snap?.micro?.notes).length ? (
              <div style={{ marginTop: 6, color: 'var(--text-secondary)' }}>
                {safeList<string>(snap?.micro?.notes)
                  .slice(0, 8)
                  .map((n: string, i: number) => (
                    <div key={`${i}-${n}`}>• {n}</div>
                  ))}
              </div>
            ) : (
              <div style={{ marginTop: 6, color: 'var(--text-secondary)' }}>—</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
