import { EngineOutput } from '../../engine/types';

export function EntryCard(props: { entry: EngineOutput['entry'] }) {
  const { primaryBuy, secondaryBuy, invalidBelow } = props.entry
  return (
    <div className="knox-card">
      <div className="card-header">
        <span className="card-title">Entry & Buy Zones</span>
        <span className="badge purple">ZONES</span>
      </div>

      <div style={{ fontSize: 16, fontWeight: 700 }}>
        Primary: ${primaryBuy.low.toFixed(2)}–${primaryBuy.high.toFixed(2)}
      </div>
      <div style={{ marginTop: 6, color: 'var(--text-secondary)', fontSize: 13 }}>
        {secondaryBuy ? `Secondary: $${secondaryBuy.low.toFixed(2)}–$${secondaryBuy.high.toFixed(2)}` : 'Secondary: n/a'}
      </div>

      <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: 12 }}>
        <span>Invalid below</span>
        <span>${invalidBelow.toFixed(2)}</span>
      </div>
    </div>
  )
}
