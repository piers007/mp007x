import type { ReactNode } from 'react'

export function Shell(props: { title?: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="knox-shell">
      <div className="knox-topbar">
        <div className="knox-title">
          <h1>{props.title ?? 'Knox 007'}</h1>
          <p>{props.subtitle ?? 'Decision-first intraday engine'}</p>
        </div>
        <span className="badge purple">UI READY</span>
      </div>
      {props.children}
    </div>
  )
}
