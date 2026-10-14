import { useState } from 'react'
import { ArrowRight, CalendarClock, Trophy, Users } from 'lucide-react'
import { Avatar, Btn, Card } from '../components/atoms'
import EoQShowcase from '../components/organisms/EoQShowcase'
import { person, TEAM_LEADERBOARD, DASH_STATS, ORG_STATS, CORE_VALUES, TOP_VALUES } from '../data'
import { useStore, fmtNum, useCountUp } from '../store'

export default function HomeScreen() {
  const { setScreen, setComposer, balance, openProfile } = useStore()
  const orgCount = useCountUp(ORG_STATS.recognitions, 1100)
  const givenCount = useCountUp(DASH_STATS.given, 1100)
  const gotCount = useCountUp(DASH_STATS.got, 1100)

  return (
    <div>
      {/* Dominating hero — curved panel, starts below the navbar */}
      <div className="relative isolate mb-16 flex min-h-[360px] items-center overflow-hidden rounded-[28px] shadow-[0_18px_44px_-20px_rgba(3,13,28,0.55)] -mx-2 lg:-mx-7">
        <HeroBackdrop />
        <div className="relative z-10 flex w-full flex-col items-start justify-between gap-6 px-7 py-8 sm:px-9 xl:flex-row xl:items-center xl:px-10 xl:py-10">
          <h1 className="max-w-3xl text-[clamp(2.5rem,4.6vw,3.75rem)] font-extrabold leading-[1.06] tracking-[-0.03em]">
            <span className="bg-gradient-to-r from-white via-white to-[#d9fbe9] bg-clip-text text-transparent" style={{ textShadow: '0 2px 24px rgba(0,0,0,0.35)' }}>Hello Ayan — someone had a great week.</span>{' '}
            <span className="relative inline-block">
              <span className="say-shimmer">Say so.</span>
              <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 120 8" preserveAspectRatio="none" aria-hidden>
                <path d="M2 6 C 30 1, 90 1, 118 5" fill="none" stroke="var(--color-gold)" strokeWidth="3" strokeLinecap="round" opacity="0.75" />
              </svg>
            </span>
          </h1>
          {/* Recognize a teammate — solid flat tile like the site's action buttons */}
          <button
            onClick={() => setComposer({ open: true })}
            className="w-full shrink-0 cursor-pointer rounded-lg bg-bp-teal px-7 py-5 text-center shadow-[0_12px_28px_rgba(20,60,58,0.35)] transition hover:brightness-110 xl:w-[300px] xl:py-6"
          >
            <span className="text-[16px] font-extrabold uppercase tracking-[0.06em] text-[#0E2E33]">Recognize a teammate</span>
          </button>
        </div>
      </div>

      {/* Count cards */}
      <div className="mb-5 flex items-end justify-between gap-4">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-brand">Stats</p>
      </div>
      <div className="mb-5 grid gap-5 md:grid-cols-2 xl:grid-cols-[1.8fr_1fr]">
        {/* Org data — full-height tile on the left */}
        <Card className="card-org stat-tile row-span-2 flex flex-col p-6">

          <p className="tnum stat-num mt-4 text-[72px] font-extrabold leading-[0.95] tracking-[-0.03em]">{fmtNum(orgCount)}</p>
          <p className="text-[13px] font-semibold text-muted">Total recognitions at EMIDS</p>
          <div className="mt-auto">
            <div className="h-px w-full bg-[#0E0E0E]/12" />
            <div className="mt-4 flex items-end justify-between gap-3">
              <p className="text-[12.5px] font-semibold text-muted">Recognitions given and received across the org this quarter</p>
              <button onClick={() => setScreen('awards')} aria-label="See quarterly awards" className="shrink-0 text-muted transition hover:translate-x-0.5 hover:text-navy"><ArrowRight size={18} /></button>
            </div>
          </div>
        </Card>

        {/* My data — two smaller rectangles stacked on the right */}
        <Card className="card-my stat-tile p-5">

          <p className="tnum text-[30px] font-extrabold leading-none text-[#0E0E0E]">{givenCount}</p>
          <p className="mt-1.5 text-[12px] font-semibold text-muted">Recognitions given</p>
        </Card>

        <Card className="card-blue stat-tile p-5">

          <p className="tnum text-[30px] font-extrabold leading-none text-[#0E0E0E]">{gotCount}</p>
          <p className="mt-1.5 text-[12px] font-semibold text-muted">Recognitions received</p>
        </Card>
      </div>

      {/* Total reward balance — wide dark wallet banner */}
      <Card className="bank-aurora stat-tile relative mb-10 overflow-hidden">
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-5">
            <span className="rounded-xl bg-white/10 py-2 pl-2 pr-3">
              <img src="/emids-icon.png" alt="" className="h-7 w-7 object-contain" />
            </span>
            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-white/55">Total balance</p>
              <p className="tnum mt-0.5 text-[32px] font-extrabold leading-none tracking-[-0.02em] text-white">
                {fmtNum(useCountUp(balance))}
                <span className="ml-1.5 text-[14px] font-bold tracking-normal text-sky-300">PTS</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setScreen('rewards')}
            className="flex items-center justify-between gap-8 rounded-full bg-white/10 px-5 py-3 text-[13px] font-bold text-white/90 transition hover:bg-white/15 sm:pr-4"
          >
            Redeem points <ArrowRight size={14} />
          </button>
        </div>
      </Card>

      {/* Quick cards */}
      <div className="grid gap-4 lg:grid-cols-2">
        <EoQShowcase />

        <Card className="flex flex-col min-h-[248px] p-5">
          <p className="flex items-center gap-2 text-[14px] font-extrabold text-navy"><Trophy size={16} className="text-gold-ink" /> Team leaderboard</p>
          <div className="mt-3 flex-1 flex-col overflow-hidden rounded-xl text-left">
            {/* Table header */}
            <div className="flex items-center gap-2.5 border border-line bg-slate-50 px-3 py-2 text-[12px] font-bold text-slate-500">
              <span className="w-12 text-center">Rank</span>
              <span className="flex-1">Team member</span>
              <span className="text-right">Points</span>
            </div>
            {/* Striped rows */}
            {TEAM_LEADERBOARD.slice(0, 5).map((r, i) => (
              <button
                key={r.id}
                onClick={() => openProfile(r.id)}
                className={`flex w-full items-center gap-2.5 border-b border-line px-3 py-2.5 text-left transition last:border-b-0 hover:bg-brand-soft/40 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'} ${r.id === 'me' ? 'bg-brand-soft/50' : ''}`}
              >
                <span className={`tnum flex h-6 w-12 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold ${['bg-gold-soft text-gold-ink', 'bg-slate-200 text-slate-600', 'bg-warn-soft text-warn'][i] ?? 'bg-slate-100 text-muted'}`}>{i + 1}</span>
                <Avatar id={r.id} size={28} />
                <span className="min-w-0 flex-1 truncate text-[12.5px] font-bold text-navy">
                  {(() => { const parts = person(r.id).name.split(' '); return parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1][0]}.` : parts[0] })()}
                  {r.id === 'me' && <span className="ml-1.5 rounded-full bg-brand px-1.5 py-0.5 text-[9px] font-extrabold text-white">You</span>}
                </span>
                <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-[11.5px] font-extrabold text-sky-700">{fmtNum(r.pts)}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

function HeroBackdrop() {
  const [videoMissing, setVideoMissing] = useState(false)
  return (
    <div className="pointer-events-none absolute -inset-x-8 -bottom-10 -top-16 -z-10 overflow-hidden" aria-hidden>
      {videoMissing ? (
        <img src="/emids-hero.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/emids-site-hero.mp4"
          poster="/emids-hero.webp"
          autoPlay
          muted
          loop
          playsInline
          onError={() => setVideoMissing(true)}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-[#030d1c]/80 via-[#030d1c]/60 to-[#030d1c]/55" />
    </div>
  )
}
