import React from "react";
import type { AnalyzeResponse } from "../../engine/types";

export default function LiquidityCard({ snap }: { snap: AnalyzeResponse }) {
  const lm = snap.flow.liquidity_map;
  const voids = lm?.void_zones?.length || 0;
  const shelves = lm?.absorption_shelves?.length || 0;

  return (
    <div className="knox-card">
      <div className="card-header">
        <div className="card-title">Liquidity</div>
        <span className="badge purple">{snap.flow.orderbook_state}</span>
      </div>

      <div style={{ color: "var(--text-secondary)", fontSize: 13 }}>
        Void zones: <strong>{voids}</strong>
      </div>
      <div style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 6 }}>
        Absorption shelves: <strong>{shelves}</strong>
      </div>
    </div>
  );
}
