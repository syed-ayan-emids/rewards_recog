import React from 'react'
import { CalendarClock, HeartHandshake, Sparkles, Trophy, Users } from 'lucide-react'
import { Avatar, Btn, Card } from '../ui'
import EoQShowcase from '../components/EoQShowcase'
import Mascot from '../components/Mascot'
import { person, TEAM_LEADERBOARD, DASH_STATS, ORG_STATS, CORE_VALUES, TOP_VALUES } from '../data'
import { useStore, fmtNum, useCountUp } from '../store'

export default function HomeScreen() {
  const { setScreen, setComposer, balance, openProfile } = useStore()
  const orgCount = useCountUp(ORG_STATS.recognitions, 1100)
  const givenCount = useCountUp(DASH_STATS.given, 1100)
  const gotCount = useCountUp(DASH_STATS.got, 1100)
  const lifeGiven = useCountUp(96, 1100)
  const lifeGot = useCountUp(118, 1100)

  return (
    <div>
      {/* Dominating hero */}
      <div className="relative isolate mb-16">
        <HeroBackdrop />
        <Mascot />
        <div className="relative z-10 flex flex-col items-start justify-between gap-6 xl:flex-row xl:items-center">
          <h1 className="max-w-3xl text-[clamp(2.5rem,4.6vw,3.75rem)] font-extrabold leading-[1.06] tracking-[-0.03em] text-white">
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
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        {/* Org data */}
        <Card className="border-brand/15 bg-brand-soft/70 p-5">
          <div className="text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-[#0a675c]">
            Org data
          </div>
          <p className="tnum mt-4 text-[58px] font-extrabold leading-[0.95] tracking-[-0.03em] text-navy">{fmtNum(orgCount)}</p>
          <p className="mt-2 text-[12.5px] font-semibold text-muted">Total recognitions at EMIDS</p>
        </Card>

        {/* My data — one card, two halves */}
        <Card className="border-mint/25 bg-mint-soft/40 p-5">
          <div className="text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-[#0f7a4d]">
            My data
          </div>
          <div className="mt-3.5 grid grid-cols-2">
            <div className="border-r border-mint/25 pr-4">
              <p className="tnum text-[30px] font-extrabold leading-none text-navy">{givenCount}</p>
              <p className="mt-1.5 text-[12px] font-semibold text-muted">Recognitions given</p>
            </div>
            <div className="pl-4">
              <p className="tnum text-[30px] font-extrabold leading-none text-navy">{gotCount}</p>
              <p className="mt-1.5 text-[12px] font-semibold text-muted">Recognitions received</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 border-t border-mint/25 pt-3.5">
            <div>
              <p className="tnum text-[15px] font-extrabold text-navy">{lifeGiven}</p>
              <p className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Lifetime given</p>
            </div>
            <div>
              <p className="tnum text-[15px] font-extrabold text-navy">{lifeGot}</p>
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
        <EoQShowcase />

        <Card className="flex flex-col min-h-[248px] p-5">
          <p className="flex items-center gap-2 text-[14px] font-extrabold text-navy"><Trophy size={16} className="text-gold-ink" /> Team leaderboard</p>
          <div className="mt-3 flex flex-1 flex-col gap-0.5">
            {TEAM_LEADERBOARD.map((r, i) => (
              <button
                key={r.id}
                onClick={() => openProfile(r.id)}
                className={`flex items-center gap-2.5 rounded-xl px-2 py-2 text-left transition hover:bg-slate-50 ${r.id === 'me' ? 'bg-brand-soft/50' : ''}`}
              >
                <span className={`tnum flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold ${['bg-gold-soft text-gold-ink', 'bg-slate-200 text-slate-600', 'bg-warn-soft text-warn'][i] ?? 'bg-slate-100 text-muted'}`}>{i + 1}</span>
                <Avatar id={r.id} size={28} />
                <span className="min-w-0 flex-1 truncate text-[12.5px] font-bold text-navy">
                  {(() => { const parts = person(r.id).name.split(' '); return parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1][0]}.` : parts[0] })()}
                  {r.id === 'me' && <span className="ml-1.5 rounded-full bg-brand px-1.5 py-0.5 text-[9px] font-extrabold text-white">You</span>}
                </span>
                <span className="tnum text-[12.5px] font-extrabold text-ink">{fmtNum(r.pts)}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

function HeroBackdrop() {
  return (
    <div className="pointer-events-none absolute -inset-x-8 -bottom-10 -top-16 -z-10 overflow-hidden" aria-hidden>
      <img src="/emids-hero.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#030d1c]/65 via-[#030d1c]/30 to-[#030d1c]/45" />
    </div>
  )
}
