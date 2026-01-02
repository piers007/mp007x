import type { EngineOutput } from '../../engine/types'

export function TrimCard(props: { trim: EngineOutput['trim'] }) {
  const t = props.trim
  const fill = Math.max(0, Math.min(100, t.tis))

  return (
    <div className="knox-card">
      <div className="card-header">
        <span className="card-title">Trim Intensity</span>
        <span className="badge purple">TIS {t.tis}%</span>
      </div>

      <div className="gauge">
        <div className="fill" style={{ width: `${fill}%` }} />
      </div>

      <div style={{ marginTop: 10 }}>
        <div style={{ fontSize: 16, fontWeight: 700 }}>{t.harvestMode ? 'Harvest Mode: ON' : 'Harvest Mode: OFF'}</div>
        <div style={{ marginTop: 6, color: 'var(--text-secondary)', fontSize: 13 }}>
          Next Trim Window: {t.nextTrimWindow.replaceAll('_', ' ')}
        </div>
      </div>

      {t.nextTrimWindow === 'NOW' && typeof t.trimNowPctOrig === 'number' && (
        <div className="trim-overlay">
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', letterSpacing: 0.6, textTransform: 'uppercase' }}>
            Trim Suggested
          </div>
          <div style={{ marginTop: 6, fontSize: 16 }}>
            Trim <strong>{t.trimNowPctOrig}%</strong> of original size
          </div>
          <div style={{ marginTop: 6, color: 'var(--text-secondary)', fontSize: 12 }}>
            • {t.reasons.slice(0, 3).join(' • ')}
          </div>
        </div>
      )}
    </div>
  )
}
