import { useState } from 'react'

export function TickerInput(props: { onSubmit: (ticker: string) => void }) {
  const [value, setValue] = useState('')

  return (
    <input
      className="input"
      placeholder="Enter ticker (e.g., NVDA) → press Enter"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          props.onSubmit(value)
          setValue('')
        }
      }}
      autoCapitalize="characters"
      autoCorrect="off"
      spellCheck={false}
    />
  )
}
