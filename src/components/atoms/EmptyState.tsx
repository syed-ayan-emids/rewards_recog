import React from 'react'

export function EmptyState({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line bg-white px-6 py-14 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-soft text-gold-ink">{icon}</div>
      <div>
        <p className="font-bold text-navy">{title}</p>
        <p className="mt-1 text-sm text-muted">{sub}</p>
      </div>
    </div>
  )
}
