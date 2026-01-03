import React from "react";
import type { AnalyzeResponse } from "../../engine/types";

export default function MomentumCard({ snap }: { snap: AnalyzeResponse }) {
  return (
    <div className="knox-card">
      <div className="card-header">
        <div className="card-title">Flow / Momentum</div>
        <span className="badge purple">{snap.flow.delta_state}</span>
      </div>

      <div style={{ color: "var(--text-secondary)", fontSize: 13 }}>
        Orderbook: <strong>{snap.flow.orderbook_state}</strong>
      </div>
      <div style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 8 }}>
        (We’ll wire real MPS/SPS/SFI modules here next — contract-safe.)
      </div>
    </div>
  );
}
