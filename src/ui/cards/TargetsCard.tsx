// src/ui/cards/TargetsCard.tsx
import React from "react";
import type { AnalyzeResponse } from "../../engine/types";

type Props = { data: AnalyzeResponse };

export default function TargetsCard({ data }: Props) {
  const { out, snap } = data;
  const t = out.targets;

  const tpRows: Array<{ label: string; price: number | null | undefined }> = [
    { label: "TP1", price: t.tp1 },
    { label: "TP2", price: t.tp2 },
    { label: "TP3", price: t.tp3 }
  ];

  return (
    <div className="knox-card">
      <div className="card-header">
        <div className="card-title">Targets</div>
        <div className={`badge ${t.massiveBreakout ? "green" : "purple"}`}>
          Runner {t.runnerProbability.toFixed(0)}%
        </div>
      </div>

      <div style={{ color: "var(--text-secondary)", fontSize: 12 }}>{t.english}</div>

      <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
        {tpRows.map((row, i: number) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
            <span style={{ color: "var(--text-muted)" }}>{row.label}</span>
            <span>{row.price != null ? `$${row.price.toFixed(2)}` : "—"}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", fontSize: 12 }}>
        <span style={{ color: "var(--text-muted)" }}>Current</span>
        <span>${snap.price.toFixed(2)}</span>
      </div>
    </div>
  );
}
