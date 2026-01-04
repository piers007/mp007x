import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App'
import './theme/index.css'
import './theme/knox.css'

// 🔥 TEMP TRIPWIRE — remove after we kill legacy /api/analyze
(() => {
  const origFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : (input as URL).toString();

    // Catch both absolute + relative legacy paths
    if (url.includes("/api/analyze")) {
      console.error("[KNOX TRIPWIRE] LEGACY /api/analyze HIT:", url);
      console.error("[KNOX TRIPWIRE] init:", init);
      console.error("[KNOX TRIPWIRE] stack:", new Error().stack);
      // Optional hard stop so you SEE it immediately:
      // throw new Error("Blocked legacy /api/analyze call — must use fetchEngine()");
    }

    return origFetch(input as any, init);
  };
})();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
