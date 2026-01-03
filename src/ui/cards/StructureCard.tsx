import React from "react";
import type { AnalyzeResponse } from "../../engine/types";

export default function StructureCard({ snap }: { snap: AnalyzeResponse }) {
  const s = snap.structure;
  const health = Math.round((s.structure_health || 0) * 100);

  return (
    <div className="knox-card">
      <div className="card-header">
        <div className="card-title">Structure</div>
        <span className="badge purple">{health}%</span>
      </div>

      <div style={{ color: "var(--text-secondary)", fontSize: 13 }}>
        Exit only if: <strong>{s.exit_only_if}</strong>
      </div>

      {s.fail_reasons?.length > 0 ? (
        <div style={{ marginTop: 10, color: "var(--text-secondary)", fontSize: 13 }}>
          {s.fail_reasons.slice(0, 3).map((r: string, i: number) => (
            <div key={i}>• {r}</div>
          ))}
        </div>
      ) : (
        <div style={{ marginTop: 10, color: "var(--text-muted)", fontSize: 12 }}>
          No failure reasons flagged.
        </div>
      )}
    </div>
  );
}
