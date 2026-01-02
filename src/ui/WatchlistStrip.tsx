type StructureState = 'INTACT' | 'DEGRADED' | 'FAILED'
type Bias = 'BULL' | 'NEUTRAL' | 'CAUTION'

export function WatchlistStrip(props: {
  tickers: string[]
  active: string
  onSelect: (t: string) => void
  meta: (t: string) => { bias: Bias; tis: number; structure: StructureState; pct: string }
}) {
  return (
    <div className="watchlist">
      {props.tickers.map((t) => {
        const m = props.meta(t)
        const dotClass = m.structure === 'FAILED' ? 'red' : m.structure === 'DEGRADED' ? 'yellow' : 'green'
        return (
          <div
            key={t}
            className={`watch-pill ${t === props.active ? 'active' : ''}`}
            onClick={() => props.onSelect(t)}
            role="button"
            tabIndex={0}
          >
            <div className="pill-row">
              <div className="pill-ticker">{t}</div>
              <div className={`status-dot ${dotClass}`} />
            </div>
            <div className="pill-sub">
              {m.bias} • {m.pct} • TIS {m.tis}
            </div>
          </div>
        )
      })}
    </div>
  )
}
