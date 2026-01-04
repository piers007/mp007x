// src/ui/cards/EntryCard.tsx
import React from "react";
import type { AnalyzeResponse } from "../../engine/types";

type Props = { data: AnalyzeResponse };

export default function EntryCard({ data }: Props) {
  const { out } = data;
  const e = out.entry;

  return (
    <div className="knox-card">
      <div className="card-header">
        <div className="card-title">Entry</div>
        <div className="badge purple">{e.entryBias.toUpperCase()}</div>
      </div>

      {e.idealEntry ? (
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{e.idealEntry.label ?? "ENTRY ZONE"}</div>
            <div style={{ color: "var(--text-muted)", fontSize: 12 }}>
              {e.idealEntry.low.toFixed(2)} → {e.idealEntry.high.toFixed(2)}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "var(--text-muted)", fontSize: 12 }}>Invalidation</div>
            <div style={{ fontSize: 13, fontWeight: 750 }}>
              {e.invalidation != null ? `$${e.invalidation.toFixed(2)}` : "—"}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ color: "var(--text-muted)", fontSize: 12 }}>No ideal entry zone available.</div>
      )}

      <div style={{ marginTop: 10, color: "var(--text-secondary)", fontSize: 12 }}>{e.english}</div>
    </div>
  );
}
