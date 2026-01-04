// src/ui/cards/LiquidityCard.tsx
import React from "react";
import type { AnalyzeResponse } from "../../engine/types";

type Props = { data: AnalyzeResponse };

export default function LiquidityCard({ data }: Props) {
  const { out } = data;
  const l = out.liquidity;

  return (
    <div className="knox-card">
      <div className="card-header">
        <div className="card-title">Liquidity</div>
        <div className="badge">L2/L3/L4</div>
      </div>

      <div style={{ color: "var(--text-secondary)", fontSize: 12 }}>{l.english}</div>

      <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
        {(l.shelves ?? []).slice(0, 3).map((s, i: number) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
            <span style={{ color: "var(--text-muted)" }}>
              Shelf {s.side.toUpperCase()}
            </span>
            <span>
              ${s.price.toFixed(2)} • {(s.strength * 100).toFixed(0)}%
            </span>
          </div>
        ))}
        {(l.walls ?? []).slice(0, 3).map((w, i: number) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
            <span style={{ color: "var(--text-muted)" }}>
              Wall {w.side.toUpperCase()}
            </span>
            <span>
              ${w.price.toFixed(2)} • {(w.strength * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
