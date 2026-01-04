// src/ui/EngineCardStack.tsx
import React from "react";
import type { AnalyzeResponse } from "../engine/types";

import StructureCard from "./cards/StructureCard";
import EntryCard from "./cards/EntryCard";
import MomentumCard from "./cards/MomentumCard";
import LiquidityCard from "./cards/LiquidityCard";
import TargetsCard from "./cards/TargetsCard";
import TrimCard from "./cards/TrimCard";

type Props = {
  data: AnalyzeResponse;
};

export default function EngineCardStack({ data }: Props) {
  const { snap, out } = data;

  return (
    <div className="grid-cards">
      <div className="knox-card">
        <div className="card-header">
          <div className="card-title">Overview</div>
          <div className={`badge ${snap.verdict === "BUY" ? "green" : snap.verdict === "HOLD" ? "yellow" : "red"}`}>
            {snap.verdict}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 0.2 }}>{snap.ticker}</div>
            <div style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 2 }}>{snap.headline}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 18, fontWeight: 750 }}>${snap.price.toFixed(2)}</div>
            <div style={{ color: "var(--text-muted)", fontSize: 12 }}>
              P(up) {(snap.p_up * 100).toFixed(0)}% • Tier {snap.tier} • Size {snap.sizePct}%
            </div>
          </div>
        </div>

        <div style={{ marginTop: 10 }}>
          {snap.bullets.map((b: string, i: number) => (
            <div key={i} style={{ color: "var(--text-secondary)", fontSize: 12, marginTop: 6 }}>
              • {b}
            </div>
          ))}
        </div>
      </div>

      <StructureCard data={data} />
      <EntryCard data={data} />
      <MomentumCard data={data} />
      <LiquidityCard data={data} />
      <TargetsCard data={data} />
      <TrimCard data={data} />
    </div>
  );
}
