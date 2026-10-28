'use client'

import { useEffect, useState } from 'react'
import { Mascot } from '../atoms'

const RECOGNIZE_PHRASES = [
  'Recognize a teammate',
  'Say Thanks',
  'Appreciate your colleague',
  'Give Kudos',
  'Say Thanks to your manager',
  'Commend your lead',
]

/** Rotating hero headlines — slide in from the left, hold ~3 s, exit to the right. */
const HERO_LINES = [
  { main: 'celebrate the progress.', accent: 'Make their moment.' },
  { main: 'someone had a great week.', accent: 'Say kudos.' },
  { main: 'see something great.', accent: 'Appreciate it.' },
]

function HeroSlide() {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx((v) => (v + 1) % HERO_LINES.length), 4200)
    return () => clearInterval(t)
  }, [])
  const line = HERO_LINES[idx]
  return (
    <span key={idx} className="hero-slide-cycle inline" style={{ animation: 'hero-slide 4200ms cubic-bezier(0.33, 1, 0.68, 1) both' }}>
      <span className="bg-gradient-to-r from-white via-white to-[#d9fbe9] bg-clip-text text-transparent" style={{ textShadow: '0 2px 24px rgba(0,0,0,0.35)' }}>{line.main}</span>{' '}
      <span className="relative inline-block">
        <span className="say-shimmer">{line.accent}</span>
        <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 120 8" preserveAspectRatio="none" aria-hidden>
          <path d="M2 6 C 30 1, 90 1, 118 5" fill="none" stroke="var(--color-gold)" strokeWidth="3" strokeLinecap="round" opacity="0.75" />
        </svg>
      </span>
    </span>
  )
}

function RecognizeCycle({ className = '' }: { className?: string }) {
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
        style={{ animation: 'recognize-fade 1200ms cubic-bezier(0.33, 1, 0.68, 1) both' }}
      >
        {RECOGNIZE_PHRASES[idx]}
      </span>
    </span>
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

export default function Hero({ name }: { name: string }) {
  return (
    <div className="relative isolate mb-16 mt-2.5 -mx-2.5 lg:-mx-[30px]">
      <div className="relative isolate flex min-h-[360px] items-center overflow-hidden rounded-[28px] shadow-[0_18px_44px_-20px_rgba(3,13,28,0.55)]">
        <HeroBackdrop />
        <div className="relative z-10 flex w-full flex-col items-start justify-center gap-6 px-7 py-8 sm:px-9 xl:px-10 xl:py-10">
          <h1 className="max-w-3xl text-[50px] font-extrabold leading-[1.06] tracking-[-0.03em]">
            <span className="bg-gradient-to-r from-white via-white to-[#d9fbe9] bg-clip-text text-transparent" style={{ textShadow: '0 2px 24px rgba(0,0,0,0.35)' }}>Hello {name} — </span>
            <HeroSlide />
          </h1>
          <div className="flex flex-wrap items-center gap-4">
            <button
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
  )
}
