import { useEffect, useState } from "react";
import { fetchSnapshot } from "../api/knoxClient";
import type { EngineSnapshot } from "../engine/types";

export default function DashboardPage() {
  const [ticker, setTicker] = useState("AAPL");
  const [data, setData] = useState<EngineSnapshot | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const snapshot = await fetchSnapshot(ticker);
      setData(snapshot);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-2">
        <input
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          className="bg-black/40 border border-white/10 rounded px-3 py-2"
        />
        <button
          onClick={load}
          className="bg-purple-600/80 hover:bg-purple-600 px-4 py-2 rounded"
        >
          Load
        </button>
      </div>

      {loading && <div>Loading…</div>}

      {data && (
        <pre className="text-xs bg-black/50 p-3 rounded">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
