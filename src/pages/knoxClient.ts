const API_BASE = import.meta.env.VITE_API_BASE;

export async function fetchSnapshot(ticker: string) {
  const res = await fetch(`${API_BASE}/api/007/snapshot`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ticker,
      mode: "intraday",
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch snapshot");
  }

  return res.json();
}
