'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { CalendarClock, ChevronLeft, ChevronRight, Users } from 'lucide-react'
import { Card } from '../atoms'
import type { Slide } from '@/lib/mock-data'

export default function EoQShowcase({ slides }: { slides: Slide[] }) {
  const [onScreen, setOnScreen] = useState(0)
  const n = slides.length

  const next = () => setOnScreen((s) => (s + 1) % n)
  const prev = () => setOnScreen((s) => (s - 1 + n) % n)

  // auto-advance every 5.5s; each change re-arms the timer, so manual clicks reset the countdown
  useEffect(() => {
    const t = setTimeout(() => setOnScreen((s) => (s + 1) % slides.length), 5500)
    return () => clearTimeout(t)
  }, [onScreen, slides.length])

  return (
    <Card className="relative min-h-[248px] overflow-hidden p-0 text-white">
      {slides.map((s, i) => {
        const active = i === onScreen
        return (
          <div
            key={s.key}
            aria-hidden={!active}
            className={`absolute inset-0 flex flex-col justify-between transition-opacity duration-700 ${active ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          >
            <Image
              src={s.img}
              alt=""
              aria-hidden="true"
              fill
              className="object-cover"
              priority={i === 0}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-navy-deep/55" />
            <div className="relative p-5">
              <span className="flex items-center gap-1.5 text-[10.5px] font-extrabold font-mono uppercase tracking-[0.16em] text-gold">
                {i === 0 ? <CalendarClock size={13} /> : <Users size={13} />} {s.title}
              </span>
              <p className="mt-2.5 max-w-[300px] text-[22px] font-extrabold leading-snug text-white">{s.headline}</p>
              <p className="mt-1.5 max-w-[290px] text-[12.5px] leading-relaxed text-white/75">{s.blurb}</p>
            </div>
            <div className="relative flex flex-wrap items-center gap-2 px-5 pb-5">
              <button className="rounded-xl bg-gold px-4 py-2.5 text-[13px] font-extrabold text-[#3d2b00] transition hover:brightness-105">
                {s.cta}
              </button>
              <button className="rounded-xl bg-white/12 px-4 py-2.5 text-[13px] font-bold text-white transition hover:bg-white/25">
                {s.cta2 ?? 'Open'}
              </button>
            </div>
          </div>
        )
      })}

      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-navy-deep/40 text-white backdrop-blur-sm transition hover:bg-navy-deep/60"
      >
        <ChevronLeft size={17} />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-navy-deep/40 text-white backdrop-blur-sm transition hover:bg-navy-deep/60"
      >
        <ChevronRight size={17} />
      </button>

      <div className="absolute right-5 top-4 z-10 flex gap-1.5">
        {slides.map((s, i) => (
          <button
            key={s.key}
            onClick={() => setOnScreen(i)}
            aria-label={`Go to ${s.title}`}
            className={`h-2 rounded-full transition-all ${i === onScreen ? 'w-5 bg-gold' : 'w-2 bg-white/40 hover:bg-white/70'}`}
          />
        ))}
      </div>
    </Card>
  )
}
