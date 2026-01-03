import React from "react";
import type { AnalyzeResponse } from "../../engine/types";

export default function TrimCard({ snap }: { snap: AnalyzeResponse }) {
  const t = snap.trim;
  const fill = Math.max(0, Math.min(100, t.tis));

  const windowLabel =
    t.next_trim_window_sec >= 60
      ? `${Math.round(t.next_trim_window_sec / 60)}m`
      : `${t.next_trim_window_sec}s`;

  return (
    <div className="knox-card">
      <div className="card-header">
        <div className="card-title">Trim (TIS)</div>
        <span className="badge purple">TIS {t.tis}</span>
      </div>

      <div className="gauge">
        <div className="fill" style={{ width: `${fill}%` }} />
      </div>

      <div style={{ marginTop: 10, color: "var(--text-secondary)", fontSize: 13 }}>
        Next Trim Window: <strong>{windowLabel}</strong>
      </div>

      {t.trim_box?.active && (
        <div className="trim-overlay">
          <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Trim Suggested</div>
          <div style={{ marginTop: 6, fontSize: 16, fontWeight: 700 }}>
            {t.trim_box.suggested_trim_pct_of_initial.toFixed(0)}% of initial
          </div>
          <div style={{ marginTop: 6, color: "var(--text-muted)", fontSize: 12 }}>
            {t.trim_box.reason}
          </div>
        </div>
      )}
    </div>
  );
}
