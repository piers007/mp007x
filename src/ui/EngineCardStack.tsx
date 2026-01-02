import type { EngineOutput } from '../engine/types'
import { StructureCard } from './cards/StructureCard'
import { EntryCard } from './cards/EntryCard'
import { MomentumCard } from './cards/MomentumCard'
import { TrimCard } from './cards/TrimCard'
import { TargetsCard } from './cards/TargetsCard'
import { LiquidityCard } from './cards/LiquidityCard'

export function EngineCardStack(props: { output: EngineOutput }) {
  const o = props.output
  return (
    <div className="grid-cards">
      <div className="span-2">
        <StructureCard structure={o.structure} />
      </div>
      <EntryCard entry={o.entry} />
      <MomentumCard momentum={o.momentum} />
      <TrimCard trim={o.trim} />
      <TargetsCard targets={o.targets} />
      <LiquidityCard liquidity={o.liquidity} />
    </div>
  )
}
