import { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { Check, ChevronDown, GitBranch, X } from 'lucide-react'
import { Avatar, useOutside } from '../atoms'
import { ORG_TREE, TEAM_LEADERBOARD, TEAM_STATS, person, type TeamId, type TreeNode } from '../../data'
import { useStore } from '../../store'

export interface MyTreeProps {
  /** Whether the overlay is mounted; callers toggle it from page state. */
  open: boolean
  /** Closes the overlay — wired to the ✕ button and Escape. */
  onClose: () => void
}

const ptsOf = (id: string) => TEAM_LEADERBOARD.find((r) => r.id === id)?.pts ?? 0
const teamOf = (id: string): TeamId => TEAM_STATS.humana.some((t) => t.id === id) ? 'humana' : 'dev'

const TEAM_CHIP: Record<TeamId, string> = {
  humana: 'bg-brand-soft text-brand',
  dev: 'bg-violet-soft text-violet',
}

const mySubtree = (): TreeNode => {
  const walk = (n: TreeNode): TreeNode | null => {
    if (n.id === 'me') return n
    for (const c of n.children ?? []) { const r = walk(c); if (r) return r }
    return null
  }
  return walk(ORG_TREE) ?? ORG_TREE
}

const NODE = mySubtree()
const KIDS = [...(NODE.children ?? [])]

type Filter = 'all' | TeamId
const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All Teams' },
  { key: 'humana', label: 'Humana' },
  { key: 'dev', label: 'Development' },
]

export default function MyTree({ open, onClose }: MyTreeProps) {
  const { openProfile } = useStore()
  const [filter, setFilter] = useState<Filter>('all')
  const [ddOpen, setDdOpen] = useState(false)
  const ddRef = useOutside<HTMLDivElement>(() => setDdOpen(false))
  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') { onClose(); setDdOpen(false) } }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [open, onClose])
  useEffect(() => {
    if (!open) return
    const prevY = window.scrollY
    const prevBody = document.body.style.overflow
    const prevHtml = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    window.scrollTo(0, 0)
    return () => {
      document.body.style.overflow = prevBody
      document.documentElement.style.overflow = prevHtml
      setTimeout(() => window.scrollTo(0, prevY), 0)
    }
  }, [open])
  if (!open) return null

  const visible = [...(filter === 'all' ? KIDS : KIDS.filter((k) => teamOf(k.id) === filter))].sort((a, b) => ptsOf(b.id) - ptsOf(a.id))
  const activeLabel = FILTERS.find((f) => f.key === filter)?.label

  return ReactDOM.createPortal(
    <div className="fixed inset-x-0 bottom-0 top-[104px] z-30 flex flex-col overflow-hidden bg-page-art animate-rise lg:top-16" role="dialog" aria-modal="true" aria-label="My tree">
      {/* Header bar */}
      <div className="relative z-20 shrink-0 border-b border-line bg-white px-6 py-2">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <h2 className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-navy">
            <GitBranch size={20} className="text-brand" /> My Tree
          </h2>
          <div className="flex items-center gap-3">
            <div ref={ddRef} className="relative">
              <button
                onClick={() => setDdOpen(!ddOpen)}
                aria-label="Filter by team"
                aria-expanded={ddOpen}
                className={`flex items-center gap-2 rounded-xl border bg-white pl-4 pr-3 py-2 text-[13.5px] font-bold text-navy shadow-card transition hover:border-brand/40 ${ddOpen ? 'border-brand' : 'border-line'}`}
              >
                {activeLabel}
                <ChevronDown size={15} className={`text-muted transition-transform duration-200 ${ddOpen ? 'rotate-180 text-brand' : ''}`} />
              </button>
              {ddOpen && (
                <div className="absolute right-0 top-full z-40 mt-1 w-48 animate-rise overflow-hidden rounded-2xl border border-line bg-white p-1.5 shadow-lift">
                  {FILTERS.map((f) => (
                    <button
                      key={f.key}
                      onClick={() => { setFilter(f.key); setDdOpen(false) }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[13.5px] font-semibold transition ${filter === f.key ? 'bg-brand-soft text-navy' : 'text-ink hover:bg-slate-50'}`}
                    >
                      {f.label}
                      {filter === f.key && <Check size={14} className="text-brand" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={onClose} aria-label="Close My Tree" className="flex h-9 w-9 items-center justify-center rounded-full bg-coral-soft text-coral transition hover:bg-coral hover:text-white">
              <X size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable body with its own visible bar; page behind stays locked */}
      <div className="rail-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto max-w-5xl px-6 pb-1.5 pt-2">
          <div className="dotgrid flex w-fit items-center gap-3.5 rounded-2xl border border-navy bg-navy px-5 py-2 text-white shadow-lift">
            <Avatar id="me" size={32} ring />
            <div className="min-w-0">
              <p className="text-[15px] font-extrabold">{person('me').name} <span className="font-semibold text-white/60">· you</span></p>
            </div>
            <span className="tnum ml-3 rounded-full bg-gold px-3 py-1 text-[12px] font-extrabold text-[#3d2b00]">{ptsOf('me')} pts</span>
          </div>

          {/* Ranked members */}
          <div className="relative z-0 ml-6 mt-1.5 space-y-1 border-l-2 border-[#c9d8ee] pl-7">
            {visible.map((k, i) => {
              const p = person(k.id)
              const tm = teamOf(k.id)
              const teamName = tm === 'humana' ? 'Humana' : 'Development'
              return (
                <div key={k.id} className="relative" style={{ animation: `rise .4s cubic-bezier(.22,1,.36,1) ${Math.min(i * 40, 360)}ms both` }}>
                  <span className="absolute -left-[29px] top-[24px] h-px w-7 bg-[#c9d8ee]" aria-hidden />
                  <div className="group flex items-center gap-3 rounded-xl border border-line bg-white px-4 py-1.5 shadow-card transition hover:border-brand/30 hover:shadow-lift">
                    <span className="tnum w-6 shrink-0 text-right text-[12px] font-extrabold text-muted">{String(i + 1).padStart(2, '0')}</span>
                    <Avatar id={k.id} size={30} />
                    <button onClick={() => { onClose(); openProfile(k.id) }} className="min-w-0 text-left">
                      <span className="block max-w-[220px] truncate text-[13.5px] font-extrabold text-navy group-hover:text-brand group-hover:underline">{p.name}</span>
                      <span className="block truncate text-[11px] text-muted">{p.title}</span>
                    </button>
                    <span className={`ml-auto hidden shrink-0 rounded-full px-2.5 py-1 text-[10.5px] font-extrabold sm:inline-flex ${TEAM_CHIP[tm]}`}>{teamName}</span>
                    <span className="tnum shrink-0 rounded-full bg-gold-soft px-3 py-1 text-[12px] font-extrabold text-gold-ink">{ptsOf(k.id)} pts</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
