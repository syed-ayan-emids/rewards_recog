import React from 'react'

export function Chip({ children, className = '', ...rest }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${className}`} {...rest}>
      {children}
    </span>
  )
}

export function Delta({ n, className = '' }: { n: number; className?: string }) {
  const up = n >= 0
  return (
    <span className={`tnum text-xs font-bold ${up ? 'text-mint' : 'text-coral'} ${className}`}>
      {up ? '↑' : '↓'} {Math.abs(n)}
    </span>
  )
}
