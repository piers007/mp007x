import type { EngineOutput } from '../../engine/types'

export function MomentumCard(props: { momentum: EngineOutput['momentum'] }) {
  const m = props.momentum
  const slopeBadge = m.deltaSlope === 'UP' ? 'green' : m.deltaSlope === 'DOWN' ? 'red' : 'yellow'

  return (
    <div className="knox-card">
      <div className="card-header">
        <span className="card-title">Momentum</span>
        <span className={`badge ${slopeBadge}`}>Δ Slope {m.deltaSlope}</span>
      </div>

      <div style={{ fontSize: 16, fontWeight: 700 }}>{m.summary}</div>
      <div style={{ marginTop: 6, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.35 }}>
        1K Δ: {m.delta1k.toLocaleString()} • 5K Δ: {m.delta5k.toLocaleString()} • Conversion: {(m.conversionEfficiency * 100).toFixed(0)}%
        {m.hiddenMomentum ? ' • Hidden momentum' : ''}
      </div>
    </div>
  )
}
