import type { AnalyzeRequest, AnalyzeResponse } from "./types";

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE?.toString()?.trim() ||
  (import.meta as any).env?.VITE_API_URL?.toString()?.trim() ||
  ""; // allow relative (same origin)

export async function analyze(req: AnalyzeRequest): Promise<AnalyzeResponse> {
  const res = await fetch(`${API_BASE}/v1/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ticker: req.ticker,
      as_of: req.as_of,
      mode: req.mode || "INTRADAY",
    }),
  });

  if (!res.ok) {
    let detail: any = null;
    try {
      detail = await res.json();
    } catch {
      // ignore
    }
    const msg =
      detail?.error?.message ||
      detail?.detail?.error?.message ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return (await res.json()) as AnalyzeResponse;
}
