import React, { useMemo, useState } from 'react'
import { ChevronDown, ChevronRight, Flame, GitBranch, PartyPopper, Search, Users } from 'lucide-react'
import { Avatar, Btn, Card, Chip } from '../ui'
import { ORG_TREE, PEOPLE, PEOPLE_LIST, RECOGNITION_HEAT, person } from '../data'
import { useStore } from '../store'

export default function OrgTreeScreen() {
  const { setComposer, openProfile } = useStore()
  const [heat, setHeat] = useState(true)
  const [q, setQ] = useState('')
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const matches = useMemo(() => {
    if (!q.trim()) return null
    const s = q.toLowerCase()
    return PEOPLE_LIST.filter((p) => p.name.toLowerCase().includes(s) || p.title.toLowerCase().includes(s)).slice(0, 8)
  }, [q])

  const toggle = (id: string) => setCollapsed((c) => ({ ...c, [id]: !c[id] }))

  const heatTint = (id: string) => {
    const n = RECOGNITION_HEAT[id] ?? 0
    if (n > 40) return 'border-gold bg-gold-soft/70'
    if (n > 20) return 'border-gold/60 bg-gold-soft/40'
    if (n > 8) return 'border-gold/35'
    return 'border-line bg-white'
  }

  const Node = ({ id, depth }: { id: string; depth: number }) => {
    const node = ORG_TREE_node(id)
    const p = person(id)
    const kids = node?.children ?? []
    const isCollapsed = collapsed[id]
    return (
      <div className="relative" style={{ marginLeft: depth ? 26 : 0 }}>
        {depth > 0 && <span className="absolute -left-[13px] top-0 h-full w-px bg-line" />}
        <div className="relative mb-2">
          {depth > 0 && <span className="absolute -left-[13px] top-[21px] h-px w-4 bg-line" />}
          <div className={`group flex w-fit items-center gap-2.5 rounded-xl border px-3 py-2 shadow-card transition hover:shadow-lift ${heat ? heatTint(id) : 'border-line bg-white'}`}>
            <Avatar id={id} size={34} />
            <div className="w-52 min-w-0">
              <button onClick={() => openProfile(id)} className="block max-w-full truncate text-[13px] font-extrabold text-navy hover:underline">{p.name}</button>
              <p className="truncate text-[10.5px] text-muted">{p.title}</p>
            </div>
            {heat && <Chip className="tnum bg-white/80 text-gold-ink border border-gold/30"><Flame size={10} /> {RECOGNITION_HEAT[id] ?? 0}</Chip>}
            <button
              onClick={() => setComposer({ open: true, preset: { toId: id } })}
              aria-label={`Send Congratz to ${p.name}`}
              className="hidden h-7 w-7 items-center justify-center rounded-full bg-gold text-[#3d2b00] shadow-fab transition group-hover:flex"
            >
              <PartyPopper size={13} />
            </button>
            {kids.length > 0 && (
              <button onClick={() => toggle(id)} aria-label={`${isCollapsed ? 'Expand' : 'Collapse'} ${p.name}'s reports`} className="ml-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-muted transition hover:bg-slate-200">
                {isCollapsed ? <ChevronRight size={13} /> : <ChevronDown size={13} />}
              </button>
            )}
          </div>
        </div>
        {!isCollapsed && kids.map((k) => <Node key={k.id} id={k.id} depth={depth + 1} />)}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-muted">Synced with HRIS · last sync 12 min ago</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-navy md:text-[34px]">Company tree</h1>
          <p className="mt-1 text-[15px] text-muted">Approvals and visibility follow this structure. Heat shows recognition density this quarter.</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-[13px] font-bold text-ink shadow-card">
            <button role="switch" aria-checked={heat} onClick={(e) => { e.preventDefault(); setHeat(!heat) }} className={`flex h-6 w-11 items-center rounded-full p-0.5 transition ${heat ? 'bg-gold' : 'bg-slate-300'}`}>
              <span className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${heat ? 'translate-x-5' : ''}`} />
            </button>
            <Flame size={14} className={heat ? 'text-gold-ink' : 'text-muted'} /> Recognition heat
          </label>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <Card className="rail-scroll overflow-x-auto p-6">
          <div className="min-w-fit">
            <Node id={ORG_TREE.id} depth={0} />
          </div>
        </Card>

        <aside className="space-y-4">
          <Card className="p-4">
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Jump to anyone…" className="h-10 w-full rounded-xl border border-line bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-brand/40 focus:bg-white" />
            </div>
            {matches && (
              <div className="mt-2 space-y-1">
                {matches.length === 0 && <p className="px-2 py-2 text-[13px] text-muted">No one by that name.</p>}
                {matches.map((p) => (
                  <button key={p.id} onClick={() => openProfile(p.id)} className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left hover:bg-slate-50">
                    <Avatar id={p.id} size={28} />
                    <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-navy">{p.name}</span>
                    <span className="text-[11px] text-muted">{p.office}</span>
                  </button>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-5">
            <p className="flex items-center gap-2 text-[14px] font-extrabold text-navy"><GitBranch size={16} className="text-brand" /> How the tree drives the portal</p>
            <ul className="mt-2.5 space-y-2 text-[12.5px] leading-relaxed text-muted">
              <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" /> Every Congratz alerts the recipient's manager instantly</li>
              <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mint" /> Point approvals route up this exact chain</li>
              <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet" /> EoQ jury visibility follows their span of control</li>
            </ul>
          </Card>

          <Card className="p-5">
            <p className="flex items-center gap-2 text-[14px] font-extrabold text-navy"><Flame size={16} className="text-gold" /> Heat legend</p>
            <div className="mt-3 space-y-2 text-[12.5px] font-semibold">
              <div className="flex items-center gap-2"><span className="h-4 w-8 rounded border border-gold bg-gold-soft/70" /> 40+ · recognition hotspot</div>
              <div className="flex items-center gap-2"><span className="h-4 w-8 rounded border border-gold/60 bg-gold-soft/40" /> 20–39 · warm</div>
              <div className="flex items-center gap-2"><span className="h-4 w-8 rounded border border-gold/35" /> 9–19 · steady</div>
              <div className="flex items-center gap-2"><span className="h-4 w-8 rounded border border-line bg-white" /> 0–8 · cold spot</div>
            </div>
            <Btn size="sm" variant="outline" className="mt-4 w-full" onClick={() => setComposer({ open: true })}>
              <PartyPopper size={13} /> Warm someone's corner
            </Btn>
          </Card>

          <Card className="p-5">
            <p className="flex items-center gap-2 text-[14px] font-extrabold text-navy"><Users size={16} className="text-brand" /> Coldest spots</p>
            <div className="mt-3 space-y-2">
              {Object.entries(RECOGNITION_HEAT).sort((a, b) => a[1] - b[1]).slice(0, 4).map(([id, n]) => (
                <button key={id} onClick={() => openProfile(id)} className="flex w-full items-center gap-2.5 rounded-lg px-1.5 py-1.5 text-left hover:bg-slate-50">
                  <Avatar id={id} size={30} />
                  <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-navy">{person(id).name}</span>
                  <Chip className="tnum bg-coral-soft text-coral">{n}</Chip>
                </button>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  )
}

function ORG_TREE_node(id: string) {
  const walk = (n: typeof ORG_TREE): typeof ORG_TREE | null => {
    if (n.id === id) return n
    for (const c of n.children ?? []) {
      const r = walk(c)
      if (r) return r
    }
    return null
  }
  return walk(ORG_TREE)
}
