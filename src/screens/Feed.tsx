import React, { useMemo, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { Avatar, Btn, Card } from '../ui'
import { PraiseCard } from '../components/PraiseCard'
import { CORE_VALUES } from '../data'
import type { ValueKey } from '../data'
import { useStore } from '../store'

type Filter = 'all' | 'myteam' | 'me'
const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All emids' },
  { key: 'myteam', label: 'My team' },
  { key: 'me', label: 'About me' },
]

export default function FeedScreen() {
  const { posts, setComposer } = useStore()
  const [filter, setFilter] = useState<Filter>('all')
  const [valueFilter, setValueFilter] = useState<ValueKey | null>(null)

  const visible = useMemo(() => posts.filter((p) => {
    if (valueFilter && p.valueKey !== valueFilter) return false
    if (filter === 'myteam') return p.fromId === 'me' || p.toIds.some((t) => ['me', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p9', 'p10'].includes(t))
    if (filter === 'me') return p.toIds.includes('me')
    return true
  }), [posts, filter, valueFilter])

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-navy">Feed</h1>
        <p className="mt-1 text-[15px] text-muted">Every recent appreciation across emids — the stories behind the numbers.</p>
      </div>

      {/* Composer stub */}
      <Card
        className="mb-6 flex items-center gap-3 p-3 transition hover:shadow-lift"
        role="button"
        tabIndex={0}
        onClick={() => setComposer({ open: true })}
        onKeyDown={(e) => e.key === 'Enter' && setComposer({ open: true })}
      >
        <Avatar id="me" size={40} />
        <div className="flex-1 rounded-xl bg-slate-50 px-4 py-2.5 text-sm text-muted">Say the specific thing a teammate did…</div>
        <span className="hidden items-center gap-1 rounded-full bg-violet-soft px-3 py-1.5 text-xs font-bold text-violet sm:flex"><Sparkles size={13} /> AI draft</span>
      </Card>

      {/* Filters */}
      <div className="rail-scroll mb-5 flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`shrink-0 rounded-full border px-4 py-2 text-[13px] font-bold transition ${filter === f.key ? 'border-brand bg-brand text-white' : 'border-line bg-white text-muted hover:text-ink'}`}
          >
            {f.label}
          </button>
        ))}
        <span className="mx-1 h-6 w-px shrink-0 self-center bg-line" />
        {Object.entries(CORE_VALUES).map(([k, v]) => {
          const on = valueFilter === k
          return (
            <button
              key={k}
              onClick={() => setValueFilter(on ? null : k as ValueKey)}
              aria-pressed={on}
              className={`shrink-0 rounded-full px-3.5 py-2 text-[13px] font-bold transition ${v.soft} ${v.ink} ${on ? 'ring-2 ring-current' : 'opacity-75 hover:opacity-100'}`}
            >
              {v.label}
            </button>
          )
        })}
      </div>

      <div className="space-y-4">
        {visible.map((p, i) => <PraiseCard key={p.id} post={p} index={i} />)}
        {visible.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-lg font-bold text-navy">Nothing here yet</p>
            <p className="mt-1 text-sm text-muted">Be the first spark in this corner of emids.</p>
            <Btn variant="gold" className="mt-4" onClick={() => setComposer({ open: true })}>Send a Congratz</Btn>
          </Card>
        )}
      </div>
    </div>
  )
}
