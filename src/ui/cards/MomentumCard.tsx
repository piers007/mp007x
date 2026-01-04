// src/ui/cards/MomentumCard.tsx
import React from "react";
import type { AnalyzeResponse } from "../../engine/types";

type Props = { data: AnalyzeResponse };

export default function MomentumCard({ data }: Props) {
  const { out, snap } = data;
  const m = out.momentum;

  const badge =
    m.state === "ignition" ? "green" :
    m.state === "continuation" ? "purple" :
    m.state === "exhaustion" ? "red" : "yellow";

  return (
    <div className="knox-card">
      <div className="card-header">
        <div className="card-title">Momentum</div>
        <div className={`badge ${badge}`}>{m.state.toUpperCase()}</div>
      </div>

      <div style={{ color: "var(--text-secondary)", fontSize: 12 }}>{m.english}</div>

      <div style={{ marginTop: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
          <span style={{ color: "var(--text-muted)" }}>σ regime</span>
          <span>{m.sigmaRegime ?? "—"}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginTop: 6 }}>
          <span style={{ color: "var(--text-muted)" }}>EV</span>
          <span>{snap.ev.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
