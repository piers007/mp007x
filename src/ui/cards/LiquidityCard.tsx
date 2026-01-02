import type { EngineOutput } from '../../engine/types'

export function LiquidityCard(props: { liquidity: EngineOutput['liquidity'] }) {
  const l = props.liquidity
  let badge: 'green' | 'yellow' | 'red' = 'green'
  if (l.spoofRisk) badge = 'red'
  else if (l.thinWarning) badge = 'yellow'

  return (
    <div className="knox-card">
      <div className="card-header">
        <span className="card-title">Liquidity</span>
        <span className={`badge ${badge}`}>{l.mode}</span>
      </div>

      <div style={{ fontSize: 16, fontWeight: 700 }}>Bid/Ask Ratio: {l.bidAskRatio.toFixed(2)}</div>
      <div style={{ marginTop: 6, color: 'var(--text-secondary)', fontSize: 13 }}>
        {l.thinWarning ? 'Bid thinning warning.' : 'Depth stable.'} {l.spoofRisk ? 'Spoof risk elevated.' : ''}
      </div>
    </div>
  )
}
