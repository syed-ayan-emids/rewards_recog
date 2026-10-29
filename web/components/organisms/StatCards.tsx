'use client'

import { useCountUp } from '@/lib/use-count-up'
import { fmtNum } from '@/lib/format'
import { Trophy } from 'lucide-react'

interface StatCardsProps {
  balance: number
  given: number
  got: number
  orgRecognitions: number
}

/** Count-up driven wallet/recognitions/milestone tiles (client — animated numbers). */
export function StatCards({ balance, given, got, orgRecognitions }: StatCardsProps) {
  const orgCount = useCountUp(orgRecognitions, 1100)
  const givenCount = useCountUp(given, 1100)
  const gotCount = useCountUp(got, 1100)
  const balanceCount = useCountUp(balance)

  return (
    <div className="mb-4 grid grid-cols-2 items-stretch gap-4 -mx-2.5 lg:-mx-[30px]">
      {/* Total points balance — pale mint/ice tile, geometric corner shapes */}
      <div
        className="relative min-h-[280px] overflow-hidden rounded-[28px] border border-[#C9E4F2] bg-[linear-gradient(115deg,#E2F7F1_0%,#EAF9FB_45%,#DDEFFA_100%)] shadow-[0_18px_40px_-24px_rgba(3,13,28,0.35)]"
      >
        <span aria-hidden className="pointer-events-none absolute rounded-full bg-[#DDF3EA]" style={{ width: 570, height: 570, left: -285, bottom: -285 }} />
        <span aria-hidden className="pointer-events-none absolute rounded-full bg-[#7ECDBE]/55" style={{ width: 450, height: 450, left: -225, bottom: -225 }} />
        <span aria-hidden className="pointer-events-none absolute rounded-full border-2 border-[#0B2740]/10" style={{ width: 380, height: 380, left: -190, bottom: -190 }} />
        <span aria-hidden className="pointer-events-none absolute rounded-full bg-[#164D61]" style={{ width: 200, height: 200, left: -100, bottom: -100 }} />
        <span aria-hidden className="pointer-events-none absolute rounded-full bg-[#8CC7E7]/30" style={{ width: 510, height: 510, right: -255, top: -255 }} />
        <span aria-hidden className="pointer-events-none absolute rounded-full bg-[#B7DFF1]/45" style={{ width: 350, height: 350, right: -175, top: -175 }} />
        <span aria-hidden className="pointer-events-none absolute rounded-full border-2 border-[#B7DFF1]/70" style={{ width: 250, height: 250, right: -125, top: -125 }} />

        <div className="relative z-10 flex h-full min-h-[280px] flex-col justify-between gap-6 px-8 py-9 sm:px-12 sm:py-10">
          <p className="text-[clamp(0.8rem,1.2vw,1rem)] font-medium uppercase tracking-[4px] text-[#0B2740]/85">Total points balance</p>

          <div className="flex items-end gap-4 px-2">
            <p className="tnum text-[clamp(3.2rem,8vw,6.4rem)] font-black leading-[0.85] tracking-[-0.04em] text-[#0B2740]">
              {fmtNum(balanceCount)}
            </p>
            <p className="mb-2 text-[clamp(1.4rem,2.6vw,2.25rem)] font-extrabold tracking-tight text-[#0E7C8C]">PTS</p>
          </div>

          <div className="flex justify-end pr-2 sm:pr-10">
            <button className="flex items-center gap-3 rounded-full bg-[#153B5A] px-9 py-4 text-[15px] font-semibold text-white shadow-[0_10px_24px_rgba(3,13,28,0.28)] transition hover:brightness-110">
              Go to My Rewards
            </button>
          </div>
        </div>
      </div>

      {/* Right column — recognitions + milestone */}
      <div className="flex h-full flex-col gap-4">
        <div className="stat-panel stat-tile relative flex flex-1 items-center overflow-hidden p-5">
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
        </div>

        {/* Milestone — deep navy card */}
        <div className="stat-panel stat-milestone stat-tile relative flex flex-1 items-center justify-between overflow-hidden p-5">
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
        </div>
      </div>
    </div>
  )
}
