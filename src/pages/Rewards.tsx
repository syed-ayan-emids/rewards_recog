import { useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowDownLeft, ArrowRight, ArrowUpRight, Gift, ShoppingBag, Sparkles, Trophy } from 'lucide-react'
import { Avatar, Bar, Btn, Card, Chip } from '../components/atoms'
import { CORE_VALUES, LEDGER, MY_NOMINATIONS, TOP_VALUES, person } from '../data'
import { useStore, fmtNum, useCountUp } from '../store'

const KIND: Record<string, { icon: ReactNode; tint: string; color: string }> = {
  award: { icon: <Trophy size={16} />, tint: 'bg-violet-soft', color: 'text-violet' },
  grant: { icon: <ArrowDownLeft size={16} />, tint: 'bg-mint-soft', color: 'text-mint' },
  earning: { icon: <ArrowUpRight size={16} />, tint: 'bg-gold-soft', color: 'text-gold-ink' },
  redemption: { icon: <ShoppingBag size={16} />, tint: 'bg-coral-soft', color: 'text-coral' },
}

export default function RewardsScreen() {
  const { balance, posts } = useStore()
  const received = posts.filter((p) => p.toIds.includes('me'))
  const earnedThisQuarter = received.reduce((s, p) => s + (p.points ?? 0), 0)
  const n = useCountUp(balance)

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-navy">My Rewards</h1>
        <p className="mt-1 text-[15px] text-muted">Your balance, what you can spend it on, and everything you have earned.</p>
      </div>

      {/* Top strip */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        {/* Total reward balance — same family as the dashboard's tile */}
        <div
          className="relative min-h-[220px] overflow-hidden rounded-[28px] border border-[#C9E4F2] bg-[linear-gradient(115deg,#E2F7F1_0%,#EAF9FB_45%,#DDEFFA_100%)] shadow-[0_18px_40px_-24px_rgba(3,13,28,0.35)] md:col-span-2"
        >
          {/* bottom-left — concentric quarter-rings anchored to the corner */}
          <span aria-hidden className="pointer-events-none absolute rounded-full bg-[#DDF3EA]" style={{ width: 480, height: 480, left: -240, bottom: -240 }} />
          <span aria-hidden className="pointer-events-none absolute rounded-full bg-[#7ECDBE]/55" style={{ width: 380, height: 380, left: -190, bottom: -190 }} />
          <span aria-hidden className="pointer-events-none absolute rounded-full border-2 border-[#0B2740]/10" style={{ width: 320, height: 320, left: -160, bottom: -160 }} />
          <span aria-hidden className="pointer-events-none absolute rounded-full bg-[#164D61]" style={{ width: 240, height: 240, left: -120, bottom: -120 }} />
          {/* top-right — icy discs anchored to the corner */}
          <span aria-hidden className="pointer-events-none absolute rounded-full bg-[#8CC7E7]/30" style={{ width: 360, height: 360, right: -180, top: -180 }} />
          <span aria-hidden className="pointer-events-none absolute rounded-full bg-[#B7DFF1]/45" style={{ width: 260, height: 260, right: -130, top: -130 }} />

          <div className="relative z-10 flex h-full min-h-[220px] flex-col justify-between p-7">
            <p className="text-[clamp(0.7rem,1vw,0.8rem)] font-medium uppercase tracking-[4px] text-[#0B2740]/85">Total reward balance</p>

            <div className="-translate-x-[20px]">
              <div className="flex justify-center items-end gap-3">
                <p className="tnum text-[clamp(2.8rem,6.6vw,4.7rem)] font-black leading-[0.9] tracking-[-0.04em] text-[#0B2740]">
                  {fmtNum(n)}
                </p>
                <p className="mb-2 text-[clamp(1.1rem,1.9vw,1.6rem)] font-extrabold tracking-tight text-[#0E7C8C]">PTS</p>
              </div>
            </div>

            <div className="flex justify-end pr-1 sm:pr-4">
              <button
                onClick={() => scrollTo('ledger')}
                className="flex items-center gap-3 rounded-xl bg-[#153B5A] px-7 py-3 text-[13.5px] font-semibold text-white shadow-[0_10px_22px_rgba(3,13,28,0.28)] transition hover:brightness-110"
              >
                View ledger <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>

        <Card className="p-5">
          <p className="text-[10.5px] font-extrabold font-mono uppercase tracking-[0.14em] text-muted">Earned lifetime</p>
          <p className="tnum mt-2 text-[28px] font-extrabold leading-none text-navy">4,460</p>
          <div className="mt-3.5 space-y-1.5">
            <p className="flex items-center justify-between text-[12.5px] font-semibold text-muted"><span>Awards</span><span className="tnum font-extrabold text-navy">2,650</span></p>
            <p className="flex items-center justify-between text-[12.5px] font-semibold text-muted"><span>Grants &amp; kudos</span><span className="tnum font-extrabold text-navy">1,310</span></p>
            <p className="flex items-center justify-between text-[12.5px] font-semibold text-muted"><span>Milestones</span><span className="tnum font-extrabold text-navy">500</span></p>
          </div>
        </Card>
      </div>

      {/* Achievements */}
      <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
        <section className="space-y-6">
          <div>
            <h2 className="mb-3 text-xl font-extrabold tracking-tight text-navy">Recognitions received</h2>
            <div className="space-y-3">
              {received.map((p) => {
                const other = person(p.fromId)
                const v = p.valueKey ? CORE_VALUES[p.valueKey] : null
                return (
                  <Card key={p.id} className="flex items-center gap-3.5 p-4 transition hover:shadow-lift">
                    <Avatar id={other.id} size={40} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[13.5px]">
                        <span className="font-extrabold text-navy">{other.name}</span>
                        <span className="text-muted"> · {p.when}</span>
                      </p>
                      <p className="mt-0.5 line-clamp-1 text-[12.5px] text-muted">{p.message}</p>
                    </div>
                    {v && <Chip className={`shrink-0 ${v.soft} ${v.ink}`}>{v.label}</Chip>}
                  </Card>
                )
              })}
              {received.length === 0 && (
                <Card className="p-10 text-center"><p className="text-sm text-muted">Waiting on your first appreciation — it'll show up here.</p></Card>
              )}
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-xl font-extrabold tracking-tight text-navy">My EoQ awards</h2>
            <div className="space-y-2.5">
              {MY_NOMINATIONS.map((nm) => (
                <Card key={nm.id} className="flex items-center gap-3.5 p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-soft text-gold-ink"><Trophy size={17} /></span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-extrabold text-navy">{nm.categories}</p>
                    <p className="text-[12px] text-muted">nominated {person(nm.nomId).name} · jury pipeline</p>
                  </div>
                  {nm.status === 'result' ? (
                    <span className="tnum shrink-0 rounded-full bg-gold px-3 py-1 text-[11.5px] font-extrabold text-[#3d2b00]">{nm.result}</span>
                  ) : (
                    <span className="shrink-0 rounded-full bg-brand-soft px-3 py-1 text-[11.5px] font-extrabold text-[#0a675c]">In review</span>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div>
            <h2 className="mb-3 text-xl font-extrabold tracking-tight text-navy">Values you live</h2>
            <Card className="p-5">
            <div className="space-y-3">
              {TOP_VALUES.map((tv) => {
                const v = CORE_VALUES[tv.key]
                const count = tv.key === 'customerFirst' ? 14 : tv.key === 'collaboration' ? 9 : tv.key === 'ownership' ? 7 : tv.key === 'innovation' ? 4 : 2
                return (
                  <div key={tv.key}>
                    <div className="flex items-center justify-between text-[12.5px]">
                      <span className={`font-bold ${v.ink}`}>{v.label}</span>
                      <span className="tnum font-extrabold text-muted">{count}</span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[#E9EEF7]">
                      <div className="h-full rounded-full transition-[width] duration-700" style={{ width: `${(count / 14) * 100}%`, background: v.solid }} />
                    </div>
                  </div>
                )
              })}
            </div>
            </Card>
          </div>

        </aside>
      </div>
      {/* Ledger — always last */}
      <section id="ledger" className="mt-8 scroll-mt-24">
        <div className="mb-3">
          <h2 className="text-xl font-extrabold tracking-tight text-navy">Points ledger</h2>
        </div>
        <Card className="divide-y divide-line p-0">
          {LEDGER.map((e) => {
            const k = KIND[e.kind]
            return (
              <div key={e.id} className="flex items-center gap-3.5 px-4 py-3.5 transition hover:bg-slate-50">
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${k.tint} ${k.color}`}>{k.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-semibold text-ink">{e.label}</p>
                  <p className="text-[11.5px] text-muted">{e.when} · FY26 Q4</p>
                </div>
                <p className={`tnum text-[15px] font-extrabold ${e.amount >= 0 ? 'text-mint' : 'text-coral'}`}>
                  {e.amount >= 0 ? '+' : ''}{fmtNum(e.amount)}
                </p>
              </div>
            )
          })}
        </Card>
      </section>
    </div>
  )
}

