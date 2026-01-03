import React from "react";
import type { AnalyzeResponse } from "../../engine/types";

export default function TargetsCard({ snap }: { snap: AnalyzeResponse }) {
  const tps = snap.zones.take_profit || [];
  const stop = snap.zones.stop;
  return (
    <div className="knox-card">
      <div className="card-header">
        <div className="card-title">Targets + Stop</div>
        <span className="badge green">TP Ladder</span>
      </div>

      <div style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontWeight: 700 }}>SL</div>
          <span className="badge red">${stop.price.toFixed(2)}</span>
        </div>
        <div style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 4 }}>{stop.reason}</div>
      </div>

      {tps.slice(0, 3).map((tp, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
            <div style={{ fontWeight: 700 }}>TP{i + 1}</div>
            <span className="badge green">${tp.price.toFixed(2)}</span>
          </div>
          <div style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 4 }}>
            Trim {tp.trim_pct_of_initial.toFixed(0)}% • {tp.reason}
          </div>
        </div>
      ))}
    </div>
  );
}
