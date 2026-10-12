import React, { useState } from 'react'
import { ArrowRight, CalendarClock, PartyPopper, Sparkles, TrendingUp, Users } from 'lucide-react'
import { Btn, Card, AreaChart, Sparkline } from '../ui'
import { CORE_VALUES, TOP_VALUES, DASH_STATS, MONTHLY_PROGRESS } from '../data'
import { useStore, fmtNum, useCountUp } from '../store'

const TILE_SPARKS = {
  rewards: [22, 26, 19, 31, 36, 47],
  given: [6, 9, 7, 11, 12, 14],
  got: [4, 6, 5, 8, 7, 9],
}

export default function HomeScreen() {
  const { setScreen, setComposer, balance } = useStore()
  const s = DASH_STATS
  const [metric, setMetric] = useState<'points' | 'kudos'>('points')

  return (
    <div>
      {/* Dominating hero */}
      <div className="mb-16 flex flex-col items-start justify-between gap-6 xl:flex-row xl:items-center">
        <h1 className="max-w-3xl text-[clamp(2.5rem,4.6vw,3.75rem)] font-extrabold leading-[1.06] tracking-[-0.03em] text-navy">
          Hello Ayan — someone had a great week.{' '}
          <span className="relative inline-block text-brand">
            Say so.
            <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 120 8" preserveAspectRatio="none" aria-hidden>
              <path d="M2 6 C 30 1, 90 1, 118 5" fill="none" stroke="var(--color-gold)" strokeWidth="3" strokeLinecap="round" opacity="0.75" />
            </svg>
          </span>
        </h1>
        <Btn variant="primary" size="lg" className="shrink-0 shadow-[0_10px_24px_rgba(14,147,132,0.35)] xl:mr-[26px]" onClick={() => setComposer({ open: true })}>
          <PartyPopper size={17} /> Send a Congratz
        </Btn>
      </div>

      {/* Rewards panel */}
      <p className="mb-2.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-muted">My stats</p>
      <Card className="mb-8 overflow-hidden p-0">
        <div className="grid gap-px bg-line sm:grid-cols-2 xl:grid-cols-4">
          <Stat label="Rewards this month" value={s.rewards} delta={s.rewardsDelta} sparks={TILE_SPARKS.rewards} />
          <Stat label="Referrals given" value={s.given} delta={s.givenDelta} sparks={TILE_SPARKS.given} />
          <Stat label="Referrals got" value={s.got} delta={s.gotDelta} sparks={TILE_SPARKS.got} />
          <div className="bg-white p-3">
            <div className="hero-room relative h-full overflow-hidden rounded-2xl shadow-lift">
              <div className="dotgrid relative flex h-full flex-col p-4">
                <Sparkles size={42} className="absolute -right-2 -top-3 text-gold/25" aria-hidden />
                <Sparkles size={22} className="absolute right-10 top-8 text-gold/15" aria-hidden />
                <div className="flex items-start justify-between gap-2">
                  <img src="/emids-logo-tight.png" alt="emids" className="mt-0.5 h-4 w-auto shrink-0" />
                  <span className="relative h-5 w-7 shrink-0 overflow-hidden rounded-md bg-gradient-to-br from-gold to-[#F5A10E]">
                    <span className="absolute inset-x-1 top-1/2 h-px bg-[#3d2b00]/35" />
                    <span className="absolute inset-y-1 left-1/2 w-px bg-[#3d2b00]/20" />
                  </span>
                </div>
                <p className="mt-1.5 text-[9px] font-extrabold uppercase tracking-[0.13em] text-gold/90">Total reward balance</p>
                <div className="mt-auto flex items-end justify-between gap-2 pt-3">
                  <p className="tnum text-[25px] font-extrabold leading-none tracking-[0.04em] text-white">
                    {fmtNum(useCountUp(balance))}
                    <span className="ml-1.5 text-[12px] font-bold tracking-normal text-white/60">pts</span>
                  </p>
                  <span className="tnum shrink-0 rounded-full bg-white/10 px-2 py-1 text-[10px] font-bold text-gold">🔥 6-week streak</span>
                </div>
                <p className="mt-1.5 text-[10.5px] text-white/55">1 point = ₹1 · never expires · redeem in your Wallet</p>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-line px-6 pb-6 pt-5">
          <div className="mb-1 flex items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-[14px] font-extrabold text-navy"><TrendingUp size={15} className="text-brand" /> Reward progress</p>
            <div className="flex gap-1">
              {([['points', 'Points'], ['kudos', 'Recognitions']] as const).map(([k, l]) => (
                <button
                  key={k}
                  onClick={() => setMetric(k)}
                  className={`rounded-lg px-3 py-1.5 text-[11.5px] font-bold transition ${metric === k ? 'bg-brand-soft text-[#0a675c]' : 'text-muted hover:bg-slate-100'}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <AreaChart
            data={metric === 'points' ? MONTHLY_PROGRESS.values : MONTHLY_PROGRESS.recognitions}
            labels={MONTHLY_PROGRESS.labels}
            unit={metric === 'points' ? 'pts' : 'recognitions'}
          />
        </div>
      </Card>

      {/* Quick cards */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="hero-room relative overflow-hidden p-0 text-white">
          <div className="dotgrid relative p-5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-gold"><CalendarClock size={13} /> EoQ window · Q4</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/15"><Sparkles size={15} className="text-gold" /></span>
            </div>
            <p className="mt-3 max-w-[290px] text-[23px] font-extrabold leading-snug">Nominations close in <span className="tnum text-gold">19 days</span></p>
            <p className="mt-1 text-[12.5px] text-white/70">4 categories open · jury voting starts Nov 3</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setScreen('awards')} className="rounded-xl bg-gold px-4 py-2.5 text-[13px] font-extrabold text-[#3d2b00] transition hover:brightness-105">Nominate now</button>
              <button onClick={() => setScreen('awards')} className="rounded-xl bg-white/12 px-4 py-2.5 text-[13px] font-bold text-white transition hover:bg-white/20">See categories</button>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <p className="flex items-center gap-2 text-[14px] font-extrabold text-navy"><Users size={16} className="text-brand" /> Values lived this quarter</p>
          <div className="mt-3.5 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
            {TOP_VALUES.map((tv, i) => {
              const v = CORE_VALUES[tv.key]
              const pct = (tv.count / TOP_VALUES[0].count) * 100
              return (
                <div key={tv.key} className="grid grid-cols-[1fr_auto] items-center gap-x-2">
                  <p className="flex items-center gap-1.5 text-[12.5px] font-bold"><span className="tnum text-[10.5px] font-bold text-muted">{i + 1}</span> <span className={v.ink}>{v.label}</span></p>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#E9EEF7]"><div className={`h-full rounded-full ${v.soft} ${v.ink}`} style={{ width: `${pct}%` }} /></div>
                    <span className="tnum text-[11px] font-bold text-muted">{tv.count}</span>
                  </div>
                </div>
              )
            })}
          </div>
          <button onClick={() => setScreen('feed')} className="mt-4 flex items-center gap-1.5 border-t border-line pt-3 text-[12.5px] font-bold text-brand hover:underline">See who's living them in the feed <ArrowRight size={13} /></button>
        </Card>
      </div>

      {/* Value of the week */}
      <Card className="mt-4 flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-value-ow-soft text-value-ow"><Sparkles size={15} /></span>
        <p className="text-[13px] font-semibold text-ink">
          This week's value is <b className="text-value-ow">Ownership</b> — 52 teammates already lived it this quarter. Who's next?
        </p>
        <Btn size="sm" variant="ghost" className="sm:ml-auto shrink-0 text-brand" onClick={() => setScreen('feed')}>
          See who's living it <ArrowRight size={14} />
        </Btn>
      </Card>
    </div>
  )
}

function Stat({ label, value, delta, sparks }: { label: string; value: number; delta: number; sparks: number[] }) {
  const n = useCountUp(value, 1100)
  return (
    <div className="bg-white px-6 py-5">
      <p className="text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-muted">{label}</p>
      <div className="mt-2 flex items-end justify-between gap-2">
        <div>
          <div className="flex items-end gap-2.5">
            <p className="tnum text-[26px] font-extrabold leading-none text-navy">{n}</p>
            <span className="tnum mb-0.5 rounded-full bg-brand-soft px-2 py-0.5 text-[11px] font-extrabold text-[#0a675c]">↑ {delta}%</span>
          </div>
          <p className="mt-1.5 text-[11.5px] font-semibold text-muted">vs last month</p>
        </div>
        <Sparkline data={sparks} w={84} h={28} stroke="var(--color-brand)" fill="var(--color-brand)" className="opacity-70" />
      </div>
    </div>
  )
}
