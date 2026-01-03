import { EngineOutput } from '../../engine/types';

type Props = {
  data: EngineOutput;
};

export default function TrimCard({ data }: Props) {
  const t = data.trim;

  const windowLabel =
    typeof t.nextTrimWindow === 'string'
      ? t.nextTrimWindow.replace(/_/g, ' ')
      : '';

  const fill = Math.min(100, Math.max(0, data.tis));

  return (
    <div className="knox-card">
      <div className="card-header">
        <div className="card-title">Trim Signal</div>
        <span className="badge purple">TIS {data.tis}%</span>
      </div>

      <div className="gauge">
        <div className="fill" style={{ width: `${fill}%` }} />
      </div>

      <div style={{ marginTop: 10, fontSize: 16, fontWeight: 700 }}>
        Next Trim Window
      </div>

      <div style={{ marginTop: 6, color: 'var(--text-secondary)' }}>
        {windowLabel}
      </div>

      {t.nextTrimWindow === 'NOW' && typeof t.trimNowPctOrig === 'number' && (
        <div className="trim-overlay">
          Trim <strong>{t.trimNowPctOrig}%</strong> of original position
        </div>
      )}

      <div style={{ marginTop: 6, color: 'var(--text-muted)' }}>
        • {t.reasons.slice(0, 3).join(' • ')}
      </div>
    </div>
  );
}
