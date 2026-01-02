// src/ui/cards/TrimCard.tsx
import React from "react";
import type { EngineSnapshot } from "../../engine/types";

type Props = {
  snap: EngineSnapshot;
};

export default function TrimCard({ snap }: Props) {
  const t = snap.trim;

  const prettyWindow =
    t.nextTrimWindow === "NOW" ? "Now" :
    t.nextTrimWindow === "SOON" ? "Soon" : "Wait";

  const tis = Math.max(0, Math.min(100, t.tis || 0));
  const fillStyle: React.CSSProperties = { width: `${tis}%` };

  const showTrimBox = tis >= 60 && typeof t.trimNowPctOrig === "number";

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">Trim Intensity</div>
        <span className="badge purple">TIS {tis}%</span>
      </div>

      <div className="gauge" aria-label="Trim Intensity Gauge">
        <div className="fill" style={fillStyle} />
      </div>

      <div style={{ marginTop: 10, fontSize: 13, color: "var(--text-secondary)" }}>
        Next Trim Window: <strong style={{ color: "var(--text-primary)" }}>{prettyWindow}</strong>
      </div>

      {t.harvestMode ? (
        <div style={{ marginTop: 6 }} className="badge green">
          Extension Harvest Mode (+15%)
        </div>
      ) : null}

      {showTrimBox ? (
        <div className="trim-overlay" style={{ marginTop: 12 }}>
          <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
            Trim Suggested (momentum only)
          </div>
          <div style={{ marginTop: 6, fontSize: 16 }}>
            Trim <strong>{t.trimNowPctOrig}%</strong> of original position
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: "var(--text-secondary)" }}>
            • {t.reasons.slice(0, 3).join(" • ")}
          </div>
        </div>
      ) : (
        <div style={{ marginTop: 10, fontSize: 12, color: "var(--text-secondary)" }}>
          • {t.reasons.slice(0, 3).join(" • ")}
        </div>
      )}
    </div>
  );
}
