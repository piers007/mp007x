// src/ui/cards/TrimCard.tsx
import React from "react";
import type { AnalyzeResponse } from "../../engine/types";

type Props = { data: AnalyzeResponse };

export default function TrimCard({ data }: Props) {
  const { snap } = data;
  const tr = snap.trim;

  const fillPct = Math.max(0, Math.min(100, tr.tis));

  return (
    <div className="knox-card">
      <div className="card-header">
        <div className="card-title">Trim Intensity</div>
        <div className={`badge ${tr.tis >= 60 ? "yellow" : "purple"}`}>TIS {tr.tis.toFixed(0)}%</div>
      </div>

      <div className="gauge">
        <div className="fill" style={{ width: `${fillPct}%` }} />
      </div>

      <div style={{ marginTop: 10, color: "var(--text-secondary)", fontSize: 12 }}>{tr.english}</div>

      {tr.tis >= 60 ? (
        <div className="trim-overlay">
          <div style={{ fontWeight: 800, fontSize: 12 }}>TRIM BOX (TIS ≥ 60)</div>
          <div style={{ marginTop: 6, fontSize: 12 }}>
            Trim <b>{tr.suggestedTrimPct.toFixed(0)}%</b> of initial position
          </div>
          <div style={{ marginTop: 6, color: "var(--text-muted)", fontSize: 12 }}>
            Next window: {tr.nextWindow ?? "—"}
          </div>
        </div>
      ) : null}
    </div>
  );
}
