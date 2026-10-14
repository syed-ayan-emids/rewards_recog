import React, { useRef, useState } from 'react'
import { Check, ChevronDown, GitBranch, CalendarCheck, Send, Users, PartyPopper, Eye } from 'lucide-react'
import { Avatar, Btn, Card, Chip, Modal, CloseX, useOutside } from '../components/atoms'
import { CORE_VALUES, TEAMS, TEAM_STATS, person } from '../data'
import type { TeamId } from '../data'
import { useStore, fmtNum } from '../store'
import OrgTreeScreen from './OrgTree'
import ApprovalsScreen from './Approvals'

type TeamTab = 'team' | 'approvals'

export default function MyTeamScreen() {
  const { screenParam, notifications } = useStore()
  const [tab, setTab] = useState<TeamTab>((screenParam as TeamTab) || 'team')
  const approvalsCount = notifications.filter((n) => n.unread && n.group === 'approval').length

  const TABS: { key: TeamTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { key: 'team', label: 'My team overview', icon: <Users size={16} /> },
    { key: 'approvals', label: 'Approvals', icon: <CalendarCheck size={16} />, badge: approvalsCount },
  ]

  return (
    <div>
      <div className="rail-scroll mb-6 flex gap-2 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-[13.5px] font-bold transition ${tab === t.key ? 'border-brand bg-brand text-white shadow-card' : 'border-line bg-white text-muted hover:text-ink'}`}
          >
            {t.icon}
            {t.label}
            {t.badge ? <span className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10.5px] font-extrabold ${tab === t.key ? 'bg-white/25 text-white' : 'bg-brand-soft text-brand'}`}>{t.badge}</span> : null}
          </button>
        ))}
      </div>

      {tab === 'team' && <TeamScreen />}
      {tab === 'approvals' && <ApprovalsScreen />}
    </div>
  )
}

function TeamScreen() {
  const { setComposer, openProfile } = useStore()
  const [team, setTeam] = useState<TeamId>('humana')
  const [ddOpen, setDdOpen] = useState(false)
  const ddRef = useOutside<HTMLDivElement>(() => setDdOpen(false))
  const [viewId, setViewId] = useState<string | null>(null)
  const headRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const onScrollX = () => {
    if (headRef.current && bodyRef.current) headRef.current.scrollLeft = bodyRef.current.scrollLeft
  }

  const teamMeta = TEAMS.find((t) => t.id === team) ?? TEAMS[0]
  const rows = TEAM_STATS[team]
  const total = rows.reduce((s, t) => s + t.given + t.received, 0)
  const viewRow = viewId ? TEAM_STATS[team].find((t) => t.id === viewId) : null
  const viewPerson = viewRow ? person(viewRow.id) : null
  const viewValue = viewRow ? CORE_VALUES[viewRow.valuesTop] : null

  return (
    <div>
      {/* Header + team dropdown + small stat */}
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-muted">People manager</p>
            <h1 className="text-3xl font-extrabold tracking-tight text-navy md:text-[34px]">My team</h1>
          </div>
          <div ref={ddRef} className="relative">
            <button
              onClick={() => setDdOpen(!ddOpen)}
              aria-label="Select team"
              aria-expanded={ddOpen}
              className={`flex items-center gap-2 rounded-xl border bg-white pl-4 pr-3 py-2.5 text-[14px] font-bold text-navy shadow-card transition hover:border-brand/40 ${ddOpen ? 'border-brand' : 'border-line'}`}
            >
              {teamMeta.name}
              <ChevronDown size={15} className={`text-muted transition-transform duration-200 ${ddOpen ? 'rotate-180 text-brand' : ''}`} />
            </button>
            {ddOpen && (
              <div className="absolute left-0 top-13 z-30 mt-1 w-60 animate-rise overflow-hidden rounded-2xl border border-line bg-white p-1.5 shadow-lift">
                {TEAMS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { setTeam(t.id); setDdOpen(false) }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[13.5px] font-semibold transition ${team === t.id ? 'bg-brand-soft text-navy' : 'text-ink hover:bg-slate-50'}`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className={`flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-extrabold ${team === t.id ? 'bg-brand text-white' : 'bg-slate-100 text-muted'}`}>
                        {t.name.charAt(0).toUpperCase()}
                      </span>
                      {t.name}
                    </span>
                    {team === t.id && <Check size={14} className="text-brand" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mini recognitions stat */}
        <div className="flex items-center gap-3 self-start rounded-2xl border border-line bg-white px-4 py-2.5 shadow-card sm:mb-1">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-soft text-brand"><PartyPopper size={15} /></span>
          <div className="leading-tight">
            <p className="tnum text-[18px] font-extrabold text-navy">{fmtNum(total)}</p>
            <p className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Recognitions · this quarter</p>
          </div>
        </div>
      </div>

      {/* People table */}
      <Card className="p-0">
        <div ref={headRef} className="sticky top-16 z-10 rounded-t-2xl border-b border-line bg-slate-50/95 backdrop-blur-sm">
          <div className="grid min-w-[780px] grid-cols-[56px_minmax(230px,1.35fr)_minmax(200px,1fr)_170px_210px] items-center gap-4 px-5 py-3 text-[10.5px] font-extrabold uppercase tracking-[0.12em] text-muted">
            <span>S.no</span>
            <span>Name</span>
            <span>Designation</span>
            <span>Primary value</span>
            <span className="text-center">Actions</span>
          </div>
        </div>
        <div ref={bodyRef} onScroll={onScrollX} className="rail-scroll rounded-b-2xl overflow-x-auto">
          <div className="min-w-[780px]">
            {rows.map((t, i) => {
              const p = person(t.id)
              const v = CORE_VALUES[t.valuesTop]
              return (
                <div
                  key={t.id}
                  className={`grid grid-cols-[56px_minmax(230px,1.35fr)_minmax(200px,1fr)_170px_210px] items-center gap-4 border-b border-line px-5 py-3.5 transition hover:bg-brand-soft/25 ${i === rows.length - 1 ? 'rounded-b-2xl border-b-0' : ''}`}
                  style={{ animation: `rise .35s ${i * 40}ms both` }}
                >
                  <span className="tnum text-[13px] font-extrabold text-muted">{String(i + 1).padStart(2, '0')}</span>
                  <button onClick={() => openProfile(t.id)} className="group flex min-w-0 items-center gap-3 text-left">
                    <Avatar id={t.id} size={36} />
                    <span className="min-w-0">
                      <span className="block truncate text-[13.5px] font-extrabold text-navy group-hover:text-brand group-hover:underline">{p.name}</span>
                    </span>
                  </button>
                  <span className="truncate text-[13px] font-medium text-muted">{p.title}</span>
                  <span><Chip className={`${v.soft} ${v.ink}`}>{v.label}</Chip></span>
                  <span className="flex items-center justify-center gap-2.5">
                    <Btn size="sm" variant="primary" className="!h-8 !px-3" onClick={() => setComposer({ open: true, preset: { toId: t.id } })}>
                      <Send size={12} /> Praise
                    </Btn>
                    <Btn size="sm" variant="outline" className="!border-brand/25 !px-3 font-bold text-[#0a675c] hover:bg-brand-soft/50" onClick={() => setViewId(t.id)}>
                      <Eye size={13} /> View info
                    </Btn>
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </Card>

      {/* Org tree */}
      <section className="mt-10">
        <h2 className="mb-3 flex items-center gap-2 text-xl font-extrabold tracking-tight text-navy"><GitBranch size={19} className="text-brand" /> Org tree</h2>
        <OrgTreeScreen />
      </section>

      {/* Member info modal */}
      <Modal open={!!viewId} onClose={() => setViewId(null)} label="Team member info">
        {viewRow && viewPerson ? (
          <div className="p-6">
            <CloseX onClick={() => setViewId(null)} />
            <div className="flex items-center gap-4">
              <Avatar id={viewRow.id} size={62} />
              <div className="min-w-0">
                <p className="text-[19px] font-extrabold tracking-tight text-navy">{viewPerson.name}</p>
                <p className="text-[13.5px] text-muted">{viewPerson.title} · {viewPerson.office}</p>
                {viewValue && <Chip className={`mt-1.5 ${viewValue.soft} ${viewValue.ink}`}>{viewValue.label}</Chip>}
              </div>
            </div>
            <p className="mb-1.5 mt-6 text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-muted">This quarter</p>
            <Card className="grid grid-cols-2 divide-x divide-line">
              <div className="px-4 py-3.5">
                <p className="tnum text-[22px] font-extrabold text-navy">{viewRow.received}</p>
                <p className="mt-0.5 text-[10.5px] font-bold uppercase tracking-wide text-muted">Recognitions received</p>
              </div>
              <div className="px-4 py-3.5">
                <p className="tnum text-[22px] font-extrabold text-navy">{viewRow.given}</p>
                <p className="mt-0.5 text-[10.5px] font-bold uppercase tracking-wide text-muted">Recognitions given</p>
              </div>
            </Card>
            <div className="mt-3 space-y-2.5 rounded-2xl border border-line bg-slate-50 px-4 py-3.5">
              <p className="flex items-center justify-between text-[13px]"><span className="font-semibold text-muted">Last recognition</span><span className="tnum font-extrabold text-navy">{viewRow.lastRecognized}</span></p>
              <p className="flex items-center justify-between text-[13px]"><span className="font-semibold text-muted">Primary value</span><span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${viewValue?.soft} ${viewValue?.ink}`}>{viewValue?.label}</span></p>
              <p className="flex items-center justify-between text-[13px]"><span className="font-semibold text-muted">Office</span><span className="font-extrabold text-navy">{viewPerson.office}</span></p>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Btn variant="ghost" onClick={() => { setViewId(null); openProfile(viewRow.id) }}>Full profile</Btn>
              <Btn variant="primary" onClick={() => { setViewId(null); setComposer({ open: true, preset: { toId: viewRow.id } }) }}>
                <Send size={14} /> Recognize
              </Btn>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
