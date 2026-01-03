import React from "react";
import type { AnalyzeResponse } from "../../engine/types";

export default function EntryCard({ snap }: { snap: AnalyzeResponse }) {
  const z = snap.zones.entry || [];
  return (
    <div className="knox-card">
      <div className="card-header">
        <div className="card-title">Entry Zones</div>
        <span className="badge purple">{snap.ticker}</span>
      </div>

      {z.slice(0, 3).map((e, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
            <div style={{ fontWeight: 700 }}>${e.price.toFixed(2)}</div>
            <span className="badge purple">{e.strength}</span>
          </div>
          <div style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 4 }}>{e.why}</div>
        </div>
      ))}
    </div>
  );
}
