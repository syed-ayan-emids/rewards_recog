import { Trophy } from 'lucide-react'
import { Avatar } from '../atoms'
import { Card } from '../atoms'
import { fmtNum } from '@/lib/format'
import type { LeaderRow } from '@/lib/mock-data'

export interface LeaderboardProps {
  /** Leaderboard rows, already sorted best-first; names resolved by the data layer. */
  rows: LeaderRow[]
}

/** Server-safe: static top-5 table with no client interactivity. */
export default function Leaderboard({ rows }: LeaderboardProps) {
  const top = rows.slice(0, 5)
  return (
    <Card className="flex flex-1 flex-col overflow-hidden p-5">
      <p className="flex items-center gap-2 text-[14px] font-extrabold text-navy">
        <Trophy size={16} className="text-gold-ink" /> Team leaderboard
      </p>
      <div className="mt-3 flex-1 flex flex-col justify-center overflow-hidden rounded-xl text-left">
        <div className="flex items-center gap-2.5 border border-line bg-slate-50 px-3 py-2 text-[12px] font-bold text-slate-500">
          <span className="w-12 text-center">Rank</span>
          <span className="flex-1">Team member</span>
          <span className="text-right">Points</span>
        </div>
        {top.map((r, i) => {
          const parts =
            r.name.split(' ').length > 1 ? `${r.name.split(' ')[0]} ${r.name.split(' ').at(-1)![0]}.` : r.name
          return (
            <div
              key={r.id}
              className={`flex w-full items-center gap-2.5 border-b border-line px-3 py-2.5 text-left transition last:border-b-0 hover:bg-brand-soft/60 ${i % 2 === 0 ? 'bg-white' : 'bg-[#ecf6f4]'} ${r.id === 'me' ? 'bg-brand-soft/60' : ''}`}
            >
              <span
                className={`tnum flex h-6 w-12 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold ${i % 2 === 0 ? 'bg-violet-soft text-violet-ink' : 'bg-gold-soft text-gold-ink'}`}
              >
                {i + 1}
              </span>
              <Avatar id={r.id} size={28} />
              <span className="min-w-0 flex-1 truncate text-[12.5px] font-bold text-navy">
                {parts}
                {r.id === 'me' && (
                  <span className="ml-1.5 rounded-full bg-brand px-1.5 py-0.5 text-[9px] font-extrabold text-white">
                    You
                  </span>
                )}
              </span>
              <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-[11.5px] font-extrabold text-sky-700">
                {fmtNum(r.pts)}
              </span>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
