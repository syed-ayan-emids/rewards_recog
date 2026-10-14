import { useState } from 'react'
import { CalendarClock, PartyPopper, Trophy, Users } from 'lucide-react'
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
      {/* Dominating hero */}
      <div className="relative isolate mb-16 flex min-h-[236px] items-center">
        <HeroBackdrop />
        <div className="relative z-10 flex w-full flex-col items-start justify-between gap-6 xl:flex-row xl:items-center">
          <h1 className="max-w-3xl text-[clamp(2.5rem,4.6vw,3.75rem)] font-extrabold leading-[1.06] tracking-[-0.03em] text-white">
            Hello Ayan — someone had a great week.{' '}
            <span className="relative inline-block">
              <span className="say-shimmer">Say so.</span>
              <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 120 8" preserveAspectRatio="none" aria-hidden>
                <path d="M2 6 C 30 1, 90 1, 118 5" fill="none" stroke="var(--color-gold)" strokeWidth="3" strokeLinecap="round" opacity="0.75" />
              </svg>
            </span>
          </h1>
        </div>
      </div>

      {/* Recognize a teammate — standalone tile section */}
      <section className="mb-8">
        <button
          onClick={() => setComposer({ open: true })}
          className="tile-stripes group relative flex w-full max-w-md cursor-pointer flex-col items-start gap-2 overflow-hidden rounded-3xl bg-brand px-6 py-6 text-left shadow-[0_12px_28px_rgba(14,147,132,0.35)] transition-colors hover:bg-brand-deep sm:pr-32"
        >
          <PartyPopper size={34} className="emoji-pop text-gold" aria-hidden />
          <span className="text-[19px] font-extrabold text-white">Recognize a teammate</span>
          <span className="pointer-events-none absolute inset-y-0 right-1 hidden items-center sm:flex" aria-hidden>
            <span className="absolute right-0 top-1/2 h-[120px] w-[120px] -translate-y-1/2 rounded-full bg-white/15 blur-md" />
            <svg width="110" height="110" viewBox="0 0 120 120" fill="none" className="mascot-bob drop-shadow-[0_6px_18px_rgba(3,60,52,0.45)]">
              <defs>
                <linearGradient id="mascotTileBlob" x1="20" y1="22" x2="100" y2="105" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#0f7f74" />
                  <stop offset="55%" stopColor="#0AA393" />
                  <stop offset="100%" stopColor="#16c2ac" />
                </linearGradient>
              </defs>
              <ellipse className="mascot-breathe" cx="60" cy="106" rx="26" ry="5" fill="rgba(10,32,56,0.25)" />
              <path d="M28 92 C20 60, 26 28, 60 26 C94 28, 100 60, 92 92 C86 102, 34 102, 28 92 Z" fill="url(#mascotTileBlob)" />
              <path d="M34 84 C30 62, 36 40, 58 37 C52 52, 46 68, 34 84 Z" fill="#fff" opacity="0.10" />
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
              <text x="60" y="90" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff" opacity="0.85">e</text>
              <path d="M14 16 L16 22 L22 24 L16 26 L14 32 L12 26 L6 24 L12 22 Z" fill="#FFD66B" opacity="0.9" className="mascot-twinkle" style={{ transformOrigin: '14px 24px' }} />
            </svg>
          </span>
        </button>
      </section>

      {/* Count cards */}
      <div className="mb-5 flex items-end justify-between gap-4">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-brand">Stats</p>
      </div>
      <div className="mb-10 grid gap-5 md:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_1.35fr]">
        {/* Org data */}
        <Card className="card-org stat-tile p-5">
          <div className="text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-[#0E0E0E]">
            Org data
          </div>
          <p className="tnum stat-num mt-4 text-[58px] font-extrabold leading-[0.95] tracking-[-0.03em]">{fmtNum(orgCount)}</p>
          <p className="mt-2 text-[12.5px] font-semibold text-muted">Total recognitions at EMIDS</p>
        </Card>

        {/* My data — two smaller rectangles */}
        <Card className="card-my stat-tile h-full p-5">
          <div className="flex h-full flex-col justify-end">
            <p className="tnum text-[30px] font-extrabold leading-none text-[#0E0E0E]">{givenCount}</p>
            <p className="mt-1.5 text-[12px] font-semibold text-muted">Recognitions given</p>
          </div>
        </Card>

        <Card className="card-my stat-tile h-full p-5">
          <div className="flex h-full flex-col justify-end">
            <p className="tnum text-[30px] font-extrabold leading-none text-[#0E0E0E]">{gotCount}</p>
            <p className="mt-1.5 text-[12px] font-semibold text-muted">Recognitions received</p>
          </div>
        </Card>

        {/* Total reward balance — bank card */}
        <Card className="bank-aurora stat-tile relative h-full overflow-hidden">
            <div className="relative flex h-full flex-col p-4">
              <div className="flex items-start justify-between gap-2">
                <span className="flex items-center gap-2">
                  <img src="/emids-icon.png" alt="" className="h-6 w-6 object-contain" />
                  <span className="text-[15px] font-extrabold tracking-tight text-navy">EMIDS</span>
                </span>
              </div>
              <p className="mt-1.5 text-[9px] font-extrabold uppercase tracking-[0.13em] text-[#0E0E0E]">Total reward balance</p>
              <div className="mt-auto flex items-end justify-between gap-2 pt-3">
                <p className="tnum text-[25px] font-extrabold leading-none tracking-[0.04em] text-[#0E0E0E]">
                  {fmtNum(useCountUp(balance))}
                  <span className="ml-1.5 text-[12px] font-bold tracking-normal text-muted">pts</span>
                </p>
              </div>
            </div>
        </Card>
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
          src="/emids-hero.mp4"
          poster="/emids-hero.webp"
          autoPlay
          muted
          loop
          playsInline
          onError={() => setVideoMissing(true)}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-[#030d1c]/65 via-[#030d1c]/30 to-[#030d1c]/45" />
    </div>
  )
}
