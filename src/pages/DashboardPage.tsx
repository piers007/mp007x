import { useMemo, useState } from 'react'
import { Shell } from '../ui/Shell'
import { TickerInput } from '../ui/TickerInput'
import { WatchlistStrip } from '../ui/WatchlistStrip'
import { EngineCardStack } from '../ui/EngineCardStack'
import { mockEngineOutput } from '../test/mockEngineOutput'

export function DashboardPage() {
  const [tickers, setTickers] = useState<string[]>(['NVDA', 'TSLA', 'SPY'])
  const [active, setActive] = useState<string>('NVDA')

  const out = useMemo(() => mockEngineOutput(active), [active])

  function addTicker(t: string) {
    const T = t.trim().toUpperCase()
    if (!T) return
    setTickers((prev) => (prev.includes(T) ? prev : [T, ...prev]))
    setActive(T)
  }

  return (
    <Shell title="Knox 007" subtitle="Cards-first intraday decision engine">
      <TickerInput onSubmit={addTicker} />
      <WatchlistStrip
        tickers={tickers}
        active={active}
        onSelect={setActive}
        meta={(t) => ({
          bias: t === active ? 'BULL' : 'NEUTRAL',
          tis: t === active ? out.trim.tis : 28,
          structure: t === active ? out.structure.state : 'INTACT',
          pct: t === active ? '+2.1%' : '+0.4%',
        })}
      />
      <EngineCardStack output={out} />
    </Shell>
  )
}
