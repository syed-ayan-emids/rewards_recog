import React from 'react'

export function SectionTitle({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <h2 className="text-xl font-extrabold tracking-tight text-navy">{children}</h2>
      {right}
    </div>
  )
}
