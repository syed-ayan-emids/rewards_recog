import React, { useState } from 'react'
import { Bell, Check, Mail, MessageSquare, PartyPopper, Send, ShieldAlert, Sparkles, TrendingUp, Users } from 'lucide-react'
import { Avatar, Btn, Card, Chip, Ring } from '../ui'
import { CORE_VALUES, TEAM_STATS, person } from '../data'
import { useStore, fmtNum } from '../store'

export default function TeamScreen() {
  const { setComposer, openProfile, toast } = useStore()
  const [digest, setDigest] = useState(true)
  const [channels, setChannels] = useState({ email: true, teams: true, slack: false })
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

        {/* Digest + guardrails */}
        <aside className="space-y-4">
          <Card className="p-5">
            <p className="flex items-center gap-2 text-[15px] font-extrabold text-navy"><Mail size={17} className="text-violet" /> Weekly digest</p>
            <p className="mt-1 text-[12.5px] text-muted">A Monday summary of your pod's recognition health, budget burn and upcoming windows.</p>
            <button
              onClick={() => { setDigest(!digest); toast(digest ? 'Digest paused' : 'Digest on', 'mint') }}
              aria-pressed={digest}
              className={`mt-4 flex h-7 w-12 items-center rounded-full p-1 transition ${digest ? 'bg-mint justify-end' : 'bg-slate-300 justify-start'}`}
            >
              <span className="h-5 w-5 rounded-full bg-white shadow" />
            </button>
            <div className="mt-4 space-y-2">
              {([['email', 'Email'], ['teams', 'Microsoft Teams'], ['slack', 'Slack']] as const).map(([k, l]) => (
                <label key={k} className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13.5px] font-semibold text-ink hover:bg-slate-50">
                  <button
                    role="checkbox"
                    aria-checked={channels[k]}
                    onClick={(e) => { e.preventDefault(); setChannels({ ...channels, [k]: !channels[k] }) }}
                    className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition ${channels[k] ? 'border-brand bg-brand text-white' : 'border-line bg-white'}`}
                    aria-label={l}
                  >
                    {channels[k] && <Check size={12} />}
                  </button>
                  {l}
                </label>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <p className="flex items-center gap-2 text-[15px] font-extrabold text-navy"><ShieldAlert size={17} className="text-coral" /> Fair-distribution watch</p>
            <p className="mt-1 text-[12.5px] text-muted">Spotlight called out — keep the quarter healthy:</p>
            <div className="mt-3.5 space-y-3">
              <WatchRow label="Same-few-givers pattern" note="Top 3 givers produce 61% of kudos — rotational nudges queued" pct={61} color="bg-warn" />
              <WatchRow label="Customer First dominance" note="38% of recognition lands on one value — diversify" pct={38} color="bg-brand" />
              <WatchRow label="Milestone auto-posts" note="2 anniversaries this week proceed automatically" pct={100} color="bg-mint" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-gold-soft to-white p-5">
            <p className="flex items-center gap-2 text-[15px] font-extrabold text-navy"><Sparkles size={17} className="text-violet" /> AI suggestion</p>
            <p className="mt-2 text-[13.5px] leading-relaxed text-ink">
              Rohan went 2 weeks without recognition but shipped 3 clean PRs. A specific Congratz on Tuesday mornings gets the highest team-lift per send.
            </p>
            <Btn size="sm" variant="gold" className="mt-3" onClick={() => setComposer({ open: true, preset: { toId: 'p4' } })}>
              <MessageSquare size={13} /> Draft one for Rohan
            </Btn>
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
