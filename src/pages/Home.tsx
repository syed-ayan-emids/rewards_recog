import { useState } from 'react'
import { ArrowRight, CalendarClock, Gem, Heart, Send, Star, ThumbsUp, Trophy, Users } from 'lucide-react'

/** Side panel design next to the hero video — 'teal' striped gradient (design 1) or 'dark' glass (design 2) */
const RECOGNIZE_VARIANT: 'teal' | 'dark' = 'teal'
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
      {/* Dominating hero — curved video panel with the recognize panel separated on the right */}
      <div className="relative isolate mb-16 grid gap-5 xs:mx-3 md:mx-3 sm:mx-3 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-stretch">
        <div className="relative isolate flex min-h-[360px] items-center overflow-hidden rounded-[28px] shadow-[0_18px_44px_-20px_rgba(3,13,28,0.55)]">
          <HeroBackdrop />
          <div className="relative z-10 flex w-full flex-col items-start justify-between gap-6 px-7 py-8 sm:px-9 xl:px-10 xl:py-10">
            <h1 className="max-w-3xl text-[clamp(2.5rem,4.6vw,3.75rem)] font-extrabold leading-[1.06] tracking-[-0.03em]">
              <span className="bg-gradient-to-r from-white via-white to-[#d9fbe9] bg-clip-text text-transparent" style={{ textShadow: '0 2px 24px rgba(0,0,0,0.35)' }}>Hello Ayan — someone had a great week.</span>{' '}
              <span className="relative inline-block">
                <span className="say-shimmer">Say so.</span>
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 120 8" preserveAspectRatio="none" aria-hidden>
                  <path d="M2 6 C 30 1, 90 1, 118 5" fill="none" stroke="var(--color-gold)" strokeWidth="3" strokeLinecap="round" opacity="0.75" />
                </svg>
              </span>
            </h1>
          </div>
        </div>

        {/* Recognize a teammate — separate side panel, two drop-in designs */}
        {RECOGNIZE_VARIANT === 'teal' ? (
          <div
            className="relative flex min-h-[300px] flex-col justify-between overflow-hidden rounded-[28px] p-6 text-left shadow-[0_22px_50px_-20px_rgba(10,80,70,0.6)] group transition"
            style={{ background: 'radial-gradient(280px 280px at 55% 42%, rgba(21,94,116,0.35) 0%, rgba(22,35,58,0.08) 55%, transparent 75%), linear-gradient(165deg, #1b2c46 0%, #13293b 55%, #0e2130 100%)' }}
          >
            {/* frosted glass medallion with mascot and floating reaction chips */}
            <span className="relative mx-auto my-4 flex h-28 w-28 items-center justify-center rounded-3xl border border-white/15 bg-white/10 shadow-[0_10px_30px_rgba(3,20,28,0.45)]">
              <svg width="82" height="82" viewBox="0 0 120 120" fill="none" className="mascot-bob -mt-2 drop-shadow-[0_8px_18px_rgba(3,60,52,0.5)]">
                <defs>
                  <linearGradient id="mascotPanelBlob" x1="20" y1="22" x2="100" y2="105" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#0f7f74" />
                    <stop offset="55%" stopColor="#0AA393" />
                    <stop offset="100%" stopColor="#19c9b3" />
                  </linearGradient>
                </defs>
                <ellipse className="mascot-breathe" cx="60" cy="106" rx="20" ry="4" fill="rgba(10,32,56,0.28)" />
                <path d="M28 92 C20 60, 26 28, 60 26 C94 28, 100 60, 92 92 C86 102, 34 102, 28 92 Z" fill="url(#mascotPanelBlob)" />
                <path d="M34 84 C30 62, 36 40, 58 37 C52 52, 46 68, 34 84 Z" fill="#fff" opacity="0.12" />
                <g className="mascot-wave" style={{ transformOrigin: '94px 58px' }}>
                  <path d="M96 62 C104 56, 110 48, 108 42" stroke="#0a675c" strokeWidth="9" strokeLinecap="round" fill="none" />
                  <circle cx="107" cy="41" r="4.5" fill="#FFB224" />
                </g>
                <circle cx="23" cy="66" r="6.5" fill="#0a675c" />
                <g className="mascot-face" style={{ transformOrigin: '60px 48px' }}>
                  <circle cx="49" cy="52" r="4.4" fill="#0a2038" /><circle cx="71" cy="52" r="4.4" fill="#0a2038" />
                  <circle cx="50.5" cy="50.6" r="1.4" fill="#fff" /><circle cx="72.5" cy="50.6" r="1.4" fill="#fff" />
                  <circle cx="43" cy="60" r="3.2" fill="#fff" opacity="0.35" /><circle cx="77" cy="60" r="3.2" fill="#fff" opacity="0.35" />
                  <path d="M51 63 C57 69, 63 69, 69 63" stroke="#0a2038" strokeWidth="2.4" strokeLinecap="round" fill="none" />
                  <circle cx="46" cy="66" r="2.6" fill="#0a2038" opacity="0.25" />
                </g>
                <path d="M14 16 L16 22 L22 24 L16 26 L14 32 L12 26 L6 24 L12 22 Z" fill="#FFD66B" opacity="0.9" className="mascot-twinkle" style={{ transformOrigin: '14px 24px' }} />
              </svg>
              <span aria-hidden className="absolute -left-9 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#4d7cfe] shadow-[0_8px_18px_rgba(77,124,254,0.45)]"><ThumbsUp size={14} className="text-white" /></span>
              <span aria-hidden className="absolute -right-7 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-gold shadow-[0_8px_18px_rgba(255,178,36,0.45)]"><Star size={14} className="text-[#3d2b00]" /></span>
              <span aria-hidden className="absolute -right-6 bottom-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#2dd4bf] shadow-[0_8px_18px_rgba(45,212,191,0.45)]"><Heart size={14} className="text-[#07231f]" /></span>
            </span>

            <span className="text-[27px] font-extrabold leading-[1.15] text-white">Recognize a teammate</span>

            <button
              onClick={() => setComposer({ open: true })}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-[14px] font-extrabold text-white transition group-hover:brightness-110"
            >
              Send Kudos <Send size={15} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setComposer({ open: true })}
            className="stat-dark relative flex min-h-[300px] cursor-pointer flex-col justify-between overflow-hidden rounded-[28px] p-6 text-left"
          >
            <span className="h-1 w-10 rounded-full bg-bp-teal" />
            <span className="text-[18px] font-extrabold leading-snug text-white">Recognize a teammate</span>
            <span className="flex items-center gap-2 text-[12px] font-semibold text-white/70">Start now <ArrowRight size={14} /></span>
          </button>
        )}
      </div>

      {/* Count cards */}
      <div className="mb-5 flex items-end justify-between gap-4">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-brand">Stats</p>
      </div>
      <div className="mb-4 grid gap-4 md:grid-cols-2 xl:grid-cols-2 xl:items-stretch">
        {/* Org data — premium dark tile, photo on top-right, blue arcs bottom-right */}
        <Card
          className="stat-dark stat-tile relative flex flex-col overflow-hidden p-5"
          style={{
            backgroundImage: 'linear-gradient(118deg, rgba(10,22,38,0.98) 0%, rgba(11,24,42,0.94) 42%, rgba(13,28,48,0.62) 70%, rgba(16,36,58,0.14) 100%), url(/xoxo/collaboration_01.jpg)',
            backgroundSize: 'cover, cover',
            backgroundPosition: 'left center, center',
            backgroundRepeat: 'no-repeat, no-repeat',
          }}
        >
          {/* soft blue glow — bottom-right */}
          <span aria-hidden className="pointer-events-none absolute -bottom-4 right-4 h-32 w-32 rounded-full bg-sky-500/10 blur-xl" />

          <p className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-400/20 text-teal-300">
              <Trophy size={17} />
            </span>
            <span>
              <span className="block text-[10.5px] font-bold uppercase tracking-[0.2em] text-teal-300">Milestone achieved</span>
              <span className="mt-1 block h-px w-10 bg-teal-400/60" />
            </span>
          </p>
          <p className="tnum mt-14 text-[58px] font-extrabold leading-none tracking-[-0.03em] bg-gradient-to-r from-white to-[#8fc3ef] bg-clip-text text-transparent">{fmtNum(orgCount)}</p>
          <p className="mt-1.5 text-[14px] font-bold text-white/90">Total recognitions at EMIDS</p>
        </Card>

        {/* Right column — split card + wallet, together as tall as the Org card */}
        <div className="flex h-full flex-col gap-4">
          {/* My data — dark split card */}
          <Card className="stat-sweep stat-tile relative min-h-[116px] p-4">
            <div className="grid h-full grid-cols-2 gap-4">
              <div className="flex h-full flex-col justify-center border-r border-white/12 pr-4">
                <p className="tnum text-[32px] font-extrabold leading-none text-white">{givenCount}</p>
                <p className="mt-1.5 text-[9px] font-semibold text-white/65">Recognitions given</p>
                <span className="mt-2.5 h-px w-8 bg-cyan-300/70" />
              </div>
              <div className="flex h-full flex-col justify-center pl-4">
                <p className="tnum text-[32px] font-extrabold leading-none text-cyan-300">{gotCount}</p>
                <p className="mt-1.5 text-[9px] font-semibold text-white/65">Recognitions received</p>
                <span className="mt-2.5 h-px w-8 bg-teal-300/80" />
              </div>
            </div>
          </Card>

          {/* Total reward balance — dark wallet banner */}
          <Card className="stat-dark stat-sweep-plain stat-tile relative h-full overflow-hidden p-5 sm:px-8">
            <div className="relative z-10 flex h-full flex-col justify-center gap-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-400/20 text-teal-200">
                    <Gem size={16} />
                  </span>
                  <p className="text-[8px] font-extrabold uppercase tracking-[0.18em] text-white/60">Total points balance</p>
                </div>
                <div className="mt-3 flex items-baseline gap-2.5">
                  <p className="tnum text-[44px] font-extrabold leading-none tracking-[-0.02em] text-white">{fmtNum(useCountUp(balance))}</p>
                  <p className="text-[15px] font-extrabold text-teal-300">PTS</p>
                </div>
              </div>
              <div className="sm:text-right">
                <button
                  onClick={() => setScreen('rewards')}
                  className="flex flex-nowrap items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-white px-6 py-3.5 text-[14px] font-extrabold text-[#0d1526] shadow-[0_12px_30px_rgba(2,12,24,0.45)] transition hover:brightness-95"
                >
                  Redeem Now <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>

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
