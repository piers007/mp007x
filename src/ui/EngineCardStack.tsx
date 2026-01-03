import React from "react";
import type { AnalyzeResponse } from "../engine/types";
import EntryCard from "./cards/EntryCard";
import LiquidityCard from "./cards/LiquidityCard";
import MomentumCard from "./cards/MomentumCard";
import StructureCard from "./cards/StructureCard";
import TargetsCard from "./cards/TargetsCard";
import TrimCard from "./cards/TrimCard";

type Props = { snap: AnalyzeResponse };

export function EngineCardStack({ snap }: Props) {
  return (
    <div className="grid-cards">
      <div className="knox-card span-2">
        <div className="card-header">
          <div className="card-title">Decision</div>
          <span className="badge purple">
            {snap.decision.bias} • Tier {snap.decision.tier}
          </span>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <span className="badge green">p_up {Math.round(snap.decision.p_up * 100)}%</span>
          <span className="badge purple">EV/R {snap.decision.ev_r.toFixed(2)}</span>
          <span className="badge yellow">Size {snap.decision.size_pct.toFixed(0)}%</span>
          <span className="badge purple">Conf {Math.round(snap.decision.confidence * 100)}%</span>
        </div>

        <div style={{ marginTop: 10, color: "var(--text-secondary)", fontSize: 13 }}>
          {snap.explain.bullets.slice(0, 3).map((b: string, i: number) => (
            <div key={i}>• {b}</div>
          ))}
        </div>
      </div>

      <EntryCard snap={snap} />
      <TargetsCard snap={snap} />
      <TrimCard snap={snap} />
      <StructureCard snap={snap} />
      <LiquidityCard snap={snap} />
      <MomentumCard snap={snap} />
    </div>
  );
}
