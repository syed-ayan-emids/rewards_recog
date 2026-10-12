import React from 'react'
import { CalendarClock, HeartHandshake, Sparkles, Users } from 'lucide-react'
import { Btn, Card } from '../ui'
import { CORE_VALUES, TOP_VALUES, DASH_STATS, ORG_STATS } from '../data'
import { useStore, fmtNum, useCountUp } from '../store'

export default function HomeScreen() {
  const { setScreen, setComposer, balance } = useStore()

  return (
    <div>
      {/* Dominating hero */}
      <div className="relative isolate mb-16">
        <HeroBackdrop />
        <div className="relative z-10 flex flex-col items-start justify-between gap-6 xl:flex-row xl:items-center">
          <h1 className="max-w-3xl text-[clamp(2.5rem,4.6vw,3.75rem)] font-extrabold leading-[1.06] tracking-[-0.03em] text-navy">
            Hello Ayan — someone had a great week.{' '}
            <span className="relative inline-block">
              <span className="say-shimmer">Say so.</span>
              <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 120 8" preserveAspectRatio="none" aria-hidden>
                <path d="M2 6 C 30 1, 90 1, 118 5" fill="none" stroke="var(--color-gold)" strokeWidth="3" strokeLinecap="round" opacity="0.75" />
              </svg>
            </span>
          </h1>
          <Btn variant="primary" size="lg" className="shrink-0 shadow-[0_10px_24px_rgba(14,147,132,0.35)] xl:mr-[26px]" onClick={() => setComposer({ open: true })}>
            <HeartHandshake size={18} /> Recognize a teammate
          </Btn>
        </div>
      </div>

      {/* Count cards */}
      <p className="mb-2.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-muted">Stats</p>
      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {/* Org data */}
        <Card className="border-brand/15 bg-brand-soft/70 p-5">
          <div className="text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-[#0a675c]">
            Org data
          </div>
          <p className="tnum mt-4 text-[58px] font-extrabold leading-[0.95] tracking-[-0.03em] text-navy">{fmtNum(ORG_STATS.recognitions)}</p>
          <p className="mt-2 text-[12.5px] font-semibold text-muted">Total recognitions at EMIDS</p>
        </Card>

        {/* My data — one card, two halves */}
        <Card className="border-mint/25 bg-mint-soft/40 p-5">
          <div className="text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-[#0f7a4d]">
            My data
          </div>
          <div className="mt-3.5 grid grid-cols-2">
            <div className="border-r border-mint/25 pr-4">
              <p className="tnum text-[30px] font-extrabold leading-none text-navy">{DASH_STATS.given}</p>
              <p className="mt-1.5 text-[12px] font-semibold text-muted">Recognitions given</p>
            </div>
            <div className="pl-4">
              <p className="tnum text-[30px] font-extrabold leading-none text-navy">{DASH_STATS.got}</p>
              <p className="mt-1.5 text-[12px] font-semibold text-muted">Recognitions received</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 border-t border-mint/25 pt-3.5">
            <div>
              <p className="tnum text-[15px] font-extrabold text-navy">96</p>
              <p className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Lifetime given</p>
            </div>
            <div>
              <p className="tnum text-[15px] font-extrabold text-navy">118</p>
              <p className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Lifetime received</p>
            </div>
          </div>
        </Card>

        {/* Total reward balance — bank card */}
        <div className="bg-white p-3" style={{ borderRadius: 16 }}>
          <div className="hero-room relative h-full overflow-hidden" style={{ borderRadius: 16 }}>
            <div className="dotgrid relative flex h-full flex-col p-4">
              <Sparkles size={42} className="absolute -right-2 -top-3 text-gold/25" aria-hidden />
              <Sparkles size={22} className="absolute right-10 top-8 text-gold/15" aria-hidden />
              <div className="flex items-start justify-between gap-2">
                <img src="/emids-logo-tight.png" alt="emids" className="mt-0.5 h-4 w-auto shrink-0" />
                <span className="relative mt-0.5 h-5 w-7 shrink-0 overflow-hidden rounded-md bg-gradient-to-br from-gold to-[#F5A10E]">
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
              <p className="mt-1.5 text-[10.5px] text-white/55">1 point = ₹1 · never expires · redeem in My Rewards</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick cards */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="hero-room relative overflow-hidden p-0 text-white">
          <div className="dotgrid relative p-5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-gold"><CalendarClock size={13} /> EoQ window · Q4</span>
              <Sparkles size={15} className="text-gold" />
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
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#E9EEF7]"><div className="h-full rounded-full" style={{ width: `${pct}%`, background: v.solid }} /></div>
                    <span className="tnum text-[11px] font-bold text-muted">{tv.count}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}

function HeroBackdrop() {
  return (
    <div className="hero-edge-fade pointer-events-none absolute -inset-x-8 -bottom-10 -top-16 -z-10 overflow-hidden" aria-hidden>
      <div className="hero-grad absolute inset-0" />
      <div className="hero-shine" />
    </div>
  )
}
