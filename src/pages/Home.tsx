import { useEffect, useState } from 'react'
import { ArrowRight, CalendarClock, Gem, Trophy, Users } from 'lucide-react'

import { Avatar, Btn, Card, Mascot } from '../components/atoms'
import EoQShowcase from '../components/organisms/EoQShowcase'
import { person, TEAM_LEADERBOARD, DASH_STATS, ORG_STATS, CORE_VALUES, TOP_VALUES } from '../data'
import { useStore, fmtNum, useCountUp } from '../store'

const RECOGNIZE_PHRASES = [
  'Recognize a teammate',
  'Say Thanks',
  'Appreciate your colleague',
  'Give Kudos',
  'Say Thanks to your manager',
  'Commend your lead',
]

/** Cycles through the recognize phrases with the soft 1200ms fade. */
function RecognizeCycle({ className = '' }: { className: string }) {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx((v) => (v + 1) % RECOGNIZE_PHRASES.length), 3200)
    return () => clearInterval(t)
  }, [])
  return (
    <span aria-live="polite" className="block overflow-hidden">
      <span
        key={idx}
        className={`block ${className}`}
        style={{
          animation: 'recognize-fade 1200ms cubic-bezier(0.33, 1, 0.68, 1) both',
        }}
      >
        {RECOGNIZE_PHRASES[idx]}
      </span>
    </span>
  )
}

export default function HomeScreen() {
  const { setScreen, setComposer, balance, openProfile } = useStore()
  const orgCount = useCountUp(ORG_STATS.recognitions, 1100)
  const givenCount = useCountUp(DASH_STATS.given, 1100)
  const gotCount = useCountUp(DASH_STATS.got, 1100)

  return (
    <div>
      {/* Dominating hero — heading left, recognize button in-band right */}
      <div className="relative isolate mb-16 mt-2.5 -mx-2.5 lg:-mx-[30px]">
        <div className="relative isolate flex min-h-[360px] items-center overflow-hidden rounded-[28px] shadow-[0_18px_44px_-20px_rgba(3,13,28,0.55)]">
          <HeroBackdrop />
          <div className="relative z-10 flex w-full flex-col items-start justify-center gap-6 px-7 py-8 sm:px-9 xl:px-10 xl:py-10">
            <h1 className="max-w-3xl text-[clamp(2.5rem,4.6vw,3.75rem)] font-extrabold leading-[1.06] tracking-[-0.03em]">
              <span className="bg-gradient-to-r from-white via-white to-[#d9fbe9] bg-clip-text text-transparent" style={{ textShadow: '0 2px 24px rgba(0,0,0,0.35)' }}>Hello Ayan — someone had a great week.</span>{' '}
              <span className="relative inline-block">
                <span className="say-shimmer">Say kudos.</span>
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 120 8" preserveAspectRatio="none" aria-hidden>
                  <path d="M2 6 C 30 1, 90 1, 118 5" fill="none" stroke="var(--color-gold)" strokeWidth="3" strokeLinecap="round" opacity="0.75" />
                </svg>
              </span>
            </h1>
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setComposer({ open: true })}
                aria-label="Recognize a teammate"
                className="inline-flex w-[300px] shrink-0 items-center justify-center rounded-xl bg-[#4b94a0] px-4 py-3 text-[12.5px] font-extrabold font-mono uppercase tracking-[0.12em] text-[#06222e] transition hover:brightness-110"
              >
                <RecognizeCycle className="whitespace-nowrap" />
              </button>

              <Mascot />
            </div>
          </div>
        </div>
      </div>

      {/* Count cards — side spacing matches hero / navbar (10px viewport inset) */}
      <div className="mb-3 flex items-end justify-between gap-4 -mx-2.5 lg:-mx-[30px]">
        <p className="text-[11px] font-extrabold font-mono uppercase tracking-[0.2em] text-brand">My activity</p>
      </div>
      <div className="mb-4 grid gap-4 md:grid-cols-1 xl:grid-cols-2 xl:items-stretch -mx-2.5 lg:-mx-[30px]">
        {/* Total points balance — ice-light wallet panel with shapes */}
        <Card
          className="stat-ice stat-tile relative flex flex-col justify-between overflow-hidden p-6"
        >
          {/* light decor — teal circle, square, triangle */}
          <span aria-hidden className="stat-shape pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full border-[10px] border-teal-500/10" />
          <span aria-hidden className="stat-shape pointer-events-none absolute -right-14 -top-10 h-56 w-56 rounded-full bg-teal-500/10" />
          <span aria-hidden className="stat-shape stat-triangle pointer-events-none absolute -right-6 bottom-8 border-b-[36px] border-l-[22px] border-r-[22px] border-b-teal-600/25 border-l-transparent border-r-transparent" />
          <span aria-hidden className="stat-shape stat-diamond pointer-events-none absolute right-24 bottom-14 h-10 w-10 border-2 border-teal-600/25" />
          <span aria-hidden className="stat-shape stat-diamond pointer-events-none absolute right-44 top-6 h-6 w-6 bg-teal-500/15" />

          <div className="relative z-10 flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0c4a5c] text-white">
              <Gem size={16} />
            </span>
            <span>
              <span className="kicker-shimmer block text-[10.5px] font-extrabold font-mono uppercase tracking-[0.2em]">Total points balance</span>
              <span className="mt-1 block h-px w-10 bg-[#0e4a5c]/30" />
            </span>
          </div>
          <div className="relative z-10 mb-2 flex flex-col justify-center gap-6 sm:-translate-y-1 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-baseline gap-3">
              <p className="tnum text-[58px] font-extrabold leading-none tracking-[-0.03em] text-[#0e2b3c]">{fmtNum(useCountUp(balance))}</p>
              <p className="text-[16px] font-extrabold text-[#0c9dab]">PTS</p>
            </div>
            <button
              onClick={() => setScreen('rewards')}
              className="flex flex-nowrap items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-[#09253e] px-7 py-3.5 text-[14px] font-extrabold text-white shadow-[0_12px_30px_rgba(2,12,24,0.25)] transition hover:brightness-110"
            >
              Redeem Now <ArrowRight size={16} />
            </button>
          </div>
        </Card>

        {/* Right column — recognitions + milestone, together as tall as the wallet panel */}
        <div className="flex h-full flex-col gap-4">
          {/* Recognitions given / received */}
          <Card className="stat-panel stat-tile relative flex flex-1 items-center overflow-hidden p-5">
            <span aria-hidden className="stat-ring -right-20 -top-28 h-72 w-72" />
            <span aria-hidden className="stat-ring -right-6 bottom-6 h-40 w-40" style={{ borderColor: 'rgba(103,222,222,0.35)' }} />
            <span aria-hidden className="stat-shape stat-triangle pointer-events-none absolute -right-24 bottom-2 border-b-[30px] border-l-[18px] border-r-[18px] border-b-cyan-300/20 border-l-transparent border-r-transparent" />
            <span aria-hidden className="stat-shape stat-diamond pointer-events-none absolute right-1/2 top-4 h-7 w-7 border-2 border-cyan-300/30 bg-cyan-300/10" />
            <span aria-hidden className="stat-shape stat-triangle pointer-events-none absolute right-[38%] top-1/2 border-b-[22px] border-l-[14px] border-r-[14px] border-b-teal-300/25 border-l-transparent border-r-transparent" />
            <span aria-hidden className="stat-shape stat-diamond pointer-events-none absolute left-6 bottom-3 h-5 w-5 bg-cyan-300/10" />
            <span aria-hidden className="stat-shape stat-diamond pointer-events-none absolute left-1/2 bottom-10 h-4 w-4 border border-cyan-300/20 bg-cyan-300/10" />
            <span aria-hidden className="stat-shape stat-triangle pointer-events-none absolute left-10 top-3 border-b-[16px] border-l-[10px] border-r-[10px] border-b-cyan-300/15 border-l-transparent border-r-transparent" />

            <div className="relative z-10 grid h-full w-full grid-cols-2 items-center">
              <div className="flex h-full flex-col justify-center border-r border-white/12 pr-4">
                <p className="tnum text-[32px] font-extrabold leading-none text-white">{givenCount}</p>
                <p className="mt-1.5 text-[9px] font-semibold text-white/60">Recognitions given</p>
                <span className="mt-2.5 h-px w-8 bg-cyan-300/80" />
              </div>
              <div className="flex h-full flex-col justify-center pl-4">
                <p className="tnum text-[32px] font-extrabold leading-none text-cyan-300">{gotCount}</p>
                <p className="mt-1.5 text-[9px] font-semibold text-white/60">Recognitions received</p>
                <span className="mt-2.5 h-px w-8 bg-teal-300/80" />
              </div>
            </div>
          </Card>

          {/* Milestone achieved — deep navy card with shapes */}
          <Card className="stat-panel stat-milestone stat-tile relative flex flex-1 items-center justify-between overflow-hidden p-5">
            <span aria-hidden className="stat-ring -right-28 -top-20 h-72 w-72" style={{ borderColor: 'rgba(147, 197, 253, 0.25)' }} />
            <span aria-hidden className="stat-ring -right-8 -bottom-24 h-64 w-64" style={{ borderColor: 'rgba(147, 197, 253, 0.3)' }} />
            <span aria-hidden className="stat-shape stat-diamond pointer-events-none absolute right-1/3 top-1/2 h-9 w-9 border-2 border-sky-400/30 bg-sky-400/10" />
            <span aria-hidden className="stat-shape stat-triangle pointer-events-none absolute right-40 bottom-2 border-b-[26px] border-l-[16px] border-r-[16px] border-b-sky-300/25 border-l-transparent border-r-transparent" />
            <span aria-hidden className="stat-shape stat-triangle pointer-events-none absolute right-[38%] top-3 border-b-[20px] border-l-[12px] border-r-[12px] border-b-sky-300/20 border-l-transparent border-r-transparent" />
            <span aria-hidden className="stat-shape stat-diamond pointer-events-none absolute left-5 bottom-4 h-5 w-5 bg-sky-400/10" />
            <span aria-hidden className="stat-shape stat-diamond pointer-events-none absolute left-1/2 bottom-8 h-4 w-4 border border-sky-300/20 bg-sky-300/10" />
            <span aria-hidden className="stat-shape stat-triangle pointer-events-none absolute left-8 top-1/4 border-b-[14px] border-l-[9px] border-r-[9px] border-b-sky-300/15 border-l-transparent border-r-transparent" />

            <div className="relative z-10 flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-400/20 text-sky-300">
                <Trophy size={17} />
              </span>
              <span>
                <span className="block text-[10.5px] font-extrabold font-mono uppercase tracking-[0.2em] text-sky-300">Milestone achieved</span>
                <span className="mt-1 block h-px w-10 bg-sky-400/60" />
              </span>
            </div>
            <div className="relative z-10 text-right">
              <p className="tnum text-[44px] font-extrabold leading-none tracking-[-0.02em] text-white">{fmtNum(orgCount)}</p>
              <p className="mt-1.5 text-[14px] font-bold text-white/90">Total recognitions at EMIDS</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Quick cards — side spacing matches hero / navbar (10px viewport inset) */}
      <div className="grid gap-4 lg:grid-cols-2 -mx-2.5 lg:-mx-[30px]">
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
                className={`flex w-full items-center gap-2.5 border-b border-line px-3 py-2.5 text-left transition last:border-b-0 hover:bg-brand-soft/60 ${i % 2 === 0 ? 'bg-white' : 'bg-[#ecf6f4]'} ${r.id === 'me' ? 'bg-brand-soft/60' : ''}`}
              >
                <span className={`tnum flex h-6 w-12 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold ${i % 2 === 0 ? 'bg-violet-soft text-violet' : 'bg-gold-soft text-gold-ink'}`}>{i + 1}</span>
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
