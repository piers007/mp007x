import type { EngineOutput } from '../../engine/types'

export function StructureCard(props: { structure: EngineOutput['structure'] }) {
  const { state, confidence, reason } = props.structure
  const dot = state === 'FAILED' ? 'red' : state === 'DEGRADED' ? 'yellow' : 'green'
  const badge = state === 'FAILED' ? 'red' : state === 'DEGRADED' ? 'yellow' : 'green'

  return (
    <div className="knox-card">
      <div className="card-header">
        <span className="card-title">Structure</span>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span className={`badge ${badge}`}>{state}</span>
          <span className={`status-dot ${dot}`} />
        </div>
      </div>

      <div>
        <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: 0.3 }}>
          {state === 'FAILED' ? 'EXIT ALL (Structure Failed)' : state}
        </div>
        <div style={{ marginTop: 6, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.35 }}>{reason}</div>
      </div>

      <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: 12 }}>
        <span>Confidence</span>
        <span>{confidence}%</span>
      </div>
    </div>
  )
}
