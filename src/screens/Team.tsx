import React, { useState } from 'react'
import { Bell, Check, GitBranch, PartyPopper, CalendarCheck, Send, ShieldAlert, TrendingUp, Users } from 'lucide-react'
import { Avatar, Btn, Card, Chip, Ring } from '../ui'
import { CORE_VALUES, TEAM_STATS, person } from '../data'
import { useStore, fmtNum } from '../store'
import OrgTreeScreen from './OrgTree'
import ApprovalsScreen from './Approvals'

type TeamTab = 'team' | 'org' | 'approvals'

export default function MyTeamScreen() {
  const { screenParam, notifications } = useStore()
  const [tab, setTab] = useState<TeamTab>((screenParam as TeamTab) || 'team')
  const approvalsCount = notifications.filter((n) => n.unread && n.group === 'approval').length

  const TABS: { key: TeamTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { key: 'team', label: 'Pod overview', icon: <Users size={16} /> },
    { key: 'org', label: 'Org tree', icon: <GitBranch size={16} /> },
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
      {tab === 'org' && <OrgTreeScreen />}
      {tab === 'approvals' && <ApprovalsScreen />}
    </div>
  )
}

function TeamScreen() {
  const { setComposer, openProfile, toast } = useStore()
  const [nudged, setNudged] = useState<string[]>([])

  const totalGiven = TEAM_STATS.reduce((s, t) => s + t.given, 0)
  const totalReceived = TEAM_STATS.reduce((s, t) => s + t.received, 0)
  const covered = TEAM_STATS.filter((t) => t.received > 0).length
  const participation = Math.round((covered / TEAM_STATS.length) * 100)
  const poolTotal = 5000, poolLeft = 945

  return (
    <div>
      <div className="mb-6">
        <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-muted">People manager · Data Engineering pod</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-navy md:text-[34px]">My team</h1>
      </div>

      {/* KPI row */}
      <div className="mb-7 grid gap-4 md:grid-cols-3">
        <Card className="flex items-center gap-4 p-5">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand"><PartyPopper size={22} /></span>
          <div className="flex-1">
            <p className="text-[26px] font-extrabold text-navy tnum">{totalGiven + totalReceived}</p>
            <p className="text-[12.5px] text-muted">Recognitions this quarter · ↑ 22% vs Q3</p>
          </div>
          <TrendingUp size={18} className="text-mint" />
        </Card>

        <Card className="flex items-center gap-4 p-5">
          <Ring pct={participation} size={64} stroke={7} color={participation < 90 ? 'var(--color-warn)' : 'var(--color-mint)'}>
            <span className="tnum text-[12px] font-extrabold text-navy">{participation}%</span>
          </Ring>
          <div className="flex-1">
            <p className="text-[14px] font-extrabold text-navy">Recognition coverage</p>
            <p className="mt-0.5 text-[12.5px] text-muted">2 teammates unreached in 3 weeks — nudge below</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-5">
          <Ring pct={((poolTotal - poolLeft) / poolTotal) * 100} size={64} stroke={7} color={poolLeft < 1000 ? 'var(--color-coral)' : 'var(--color-brand)'}>
            <span className="tnum text-[12px] font-extrabold text-navy">81%</span>
          </Ring>
          <div className="flex-1">
            <p className="text-[14px] font-extrabold text-navy">Q4 award pool</p>
            <p className="tnum mt-0.5 text-[12.5px] text-muted">{fmtNum(poolLeft)} pts left of {fmtNum(poolTotal)} · guardrail at 85%</p>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Team cards */}
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-xl font-extrabold tracking-tight text-navy"><Users size={19} className="text-brand" /> Pod · 8 people</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {TEAM_STATS.map((t, i) => {
              const p = person(t.id)
              const cold = t.received <= 4
              const v = CORE_VALUES[t.valuesTop]
              const nudgedAlready = nudged.includes(t.id)
              return (
                <Card key={t.id} className={`p-4 transition hover:shadow-lift ${cold ? 'border-l-4 border-l-coral' : ''}`} style={{ animation: `rise .4s ${i * 50}ms both` }}>
                  <button className="flex w-full items-center gap-3 text-left" onClick={() => openProfile(t.id)}>
                    <Avatar id={t.id} size={42} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-extrabold text-navy">{p.name}</p>
                      <p className="truncate text-[11.5px] text-muted">{p.title}</p>
                    </div>
                    <Chip className={`${v.soft} ${v.ink}`}>{v.label}</Chip>
                  </button>
                  <div className="mt-3.5 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-slate-50 py-2">
                      <p className="tnum text-[15px] font-extrabold text-navy">{t.given}</p>
                      <p className="text-[9.5px] font-bold uppercase tracking-wide text-muted">Given</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 py-2">
                      <p className="tnum text-[15px] font-extrabold text-navy">{t.received}</p>
                      <p className="text-[9.5px] font-bold uppercase tracking-wide text-muted">Received</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 py-2">
                      <p className={`tnum text-[12px] font-extrabold ${cold ? 'text-coral' : 'text-navy'}`}>{t.lastRecognized}</p>
                      <p className="text-[9.5px] font-bold uppercase tracking-wide text-muted">Last</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Btn size="sm" variant="gold" className="flex-1" onClick={() => setComposer({ open: true, preset: { toId: t.id } })}>
                      <Send size={12} /> Praise
                    </Btn>
                    {cold && (
                      <Btn size="sm" variant="outline" onClick={() => { setNudged((n) => [...n, t.id]); toast(`Nudge queued — ${p.name}'s peers get a gentle reminder`, 'gold') }} disabled={nudgedAlready}>
                        {nudgedAlready ? <Check size={13} /> : <Bell size={13} />} {nudgedAlready ? 'Nudged' : 'Nudge'}
                      </Btn>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Guardrails */}
        <aside className="space-y-4">
          <Card className="p-5">
            <p className="flex items-center gap-2 text-[15px] font-extrabold text-navy"><ShieldAlert size={17} className="text-coral" /> Fair-distribution watch</p>
            <p className="mt-1 text-[12.5px] text-muted">Spotlight called out — keep the quarter healthy:</p>
            <div className="mt-3.5 space-y-3">
              <WatchRow label="Same-few-givers pattern" note="Top 3 givers produce 61% of kudos — rotational nudges queued" pct={61} color="bg-warn" />
              <WatchRow label="Customer First dominance" note="38% of recognition lands on one value — diversify" pct={38} color="bg-brand" />
              <WatchRow label="Milestone auto-posts" note="2 anniversaries this week proceed automatically" pct={100} color="bg-mint" />
            </div>
          </Card>
        </aside>
      </div>
    </div>
  )
}

function WatchRow({ label, note, pct, color }: { label: string; note: string; pct: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-bold text-navy">{label}</p>
        <span className="tnum text-[12px] font-extrabold text-muted">{pct}%</span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#E9EEF7]">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-[11.5px] text-muted">{note}</p>
    </div>
  )
}
