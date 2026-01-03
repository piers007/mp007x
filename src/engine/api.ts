// src/engine/api.ts
import { EngineSnapshot } from './types';
import { mockSnapshot } from '../test/mockEngineOutput';

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE?.trim?.() ||
  ''; // if empty, same-origin (Render serves backend + frontend)

export async function fetchSnapshot(ticker: string): Promise<EngineSnapshot> {
  const t = ticker.trim().toUpperCase();

  // If no ticker, return mock (lets UI boot)
  if (!t) return mockSnapshot;

  try {
    const url = `${API_BASE}/api/snapshot?ticker=${encodeURIComponent(t)}`;
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });

    if (!res.ok) {
      // Fallback to mock so the UI never hard-crashes
      return { ...mockSnapshot, ticker: t };
    }

    const data = (await res.json()) as Partial<EngineSnapshot>;

    // Normalize into a guaranteed EngineSnapshot
    return {
      ticker: data.ticker ?? t,
      headline: data.headline ?? mockSnapshot.headline,
      p_up: data.p_up ?? mockSnapshot.p_up,
      ev: data.ev ?? mockSnapshot.ev,
      tier: data.tier ?? mockSnapshot.tier,
      sizePct: data.sizePct ?? mockSnapshot.sizePct,
      price: data.price ?? mockSnapshot.price,
      bullets: data.bullets ?? mockSnapshot.bullets,
      zones: data.zones ?? mockSnapshot.zones,
      micro: data.micro ?? mockSnapshot.micro,
      output: data.output ?? mockSnapshot.output,
      timestamp: data.timestamp ?? new Date().toISOString(),
    };
  } catch {
    return { ...mockSnapshot, ticker: t };
  }
}
