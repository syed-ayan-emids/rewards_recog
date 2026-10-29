'use client'

import { useEffect, useState } from 'react'

/** Counts from 0 to target on mount — the dashboard's animated numbers. */
export function useCountUp(target: number, durationMs = 1100): number {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const tick = () => {
      // self-measured time — some environments (jsdom) give rAF callbacks an unreliable timestamp
      const t = Math.min(1, (performance.now() - start) / durationMs)
      setValue(Math.round(target * (1 - Math.pow(1 - t, 3))))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, durationMs])

  return value
}
