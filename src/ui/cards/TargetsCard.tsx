import { EngineOutput } from '../../engine/types';

export function TargetsCard(props: { targets: EngineOutput['targets'] }) {
  const t = props.targets
  const rp = Math.round(t.runnerProbability * 100)

  return (
    <div className="knox-card">
      <div className="card-header">
        <span className="card-title">Targets & Runway</span>
        <span className={`badge ${t.massiveBreakout ? 'purple' : 'yellow'}`}>Runner {rp}%</span>
      </div>

      <div style={{ fontSize: 16, fontWeight: 700 }}>
        TP1 ${t.tp1.toFixed(2)} • TP2 ${t.tp2.toFixed(2)} {t.tp3 ? `• TP3 $${t.tp3.toFixed(2)}` : ''}
      </div>
      <div style={{ marginTop: 6, color: 'var(--text-secondary)', fontSize: 13 }}>
        {t.massiveBreakout ? 'Massive breakout regime detected.' : 'Normal continuation regime.'}
      </div>
    </div>
  )
}
