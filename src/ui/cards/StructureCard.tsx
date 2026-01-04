// src/ui/cards/StructureCard.tsx
import React from "react";
import type { AnalyzeResponse } from "../../engine/types";

type Props = { data: AnalyzeResponse };

export default function StructureCard({ data }: Props) {
  const { out } = data;
  const s = out.structure;

  return (
    <div className="knox-card">
      <div className="card-header">
        <div className="card-title">Structure</div>
        <div className={`badge ${s.structureValid ? "green" : "red"}`}>
          {s.structureValid ? "VALID" : "BROKEN"}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
        <span style={{ color: "var(--text-muted)" }}>Trend</span>
        <span>{s.trend.toUpperCase()}</span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginTop: 6 }}>
        <span style={{ color: "var(--text-muted)" }}>Key level</span>
        <span>{s.keyLevel != null ? `$${s.keyLevel.toFixed(2)}` : "—"}</span>
      </div>

      <div style={{ marginTop: 10, color: "var(--text-secondary)", fontSize: 12 }}>{s.english}</div>
    </div>
  );
}
