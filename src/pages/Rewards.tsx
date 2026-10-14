import React, { useState } from 'react'
import { ArrowDownLeft, ArrowRight, ArrowUpRight, Award, BadgeCheck, Gift, Landmark, ShoppingBag, Sparkles, Trophy } from 'lucide-react'
import { Avatar, Bar, Btn, Card, Chip } from '../components/atoms'
import { CORE_VALUES, LEDGER, MY_NOMINATIONS, TOP_VALUES, person } from '../data'
import { useStore, fmtNum, useCountUp } from '../store'

const BADGE_ICONS: Record<string, React.ReactNode> = {
  'Value Champion ×3': <Sparkles size={16} />,
  'Top Giver — Q1': <Award size={16} />,
  '5-Year Milestone': <Landmark size={16} />,
}

const KIND: Record<string, { icon: React.ReactNode; tint: string; color: string }> = {
  award: { icon: <Trophy size={16} />, tint: 'bg-violet-soft', color: 'text-violet' },
  grant: { icon: <ArrowDownLeft size={16} />, tint: 'bg-mint-soft', color: 'text-mint' },
  earning: { icon: <ArrowUpRight size={16} />, tint: 'bg-gold-soft', color: 'text-gold-ink' },
  redemption: { icon: <ShoppingBag size={16} />, tint: 'bg-coral-soft', color: 'text-coral' },
}

export default function RewardsScreen() {
  const { balance, posts } = useStore()
  const me = person('me')
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
        <Card className="hero-room relative overflow-hidden p-0 text-white md:col-span-2">
          <div className="dotgrid relative flex h-full flex-col p-5">
            <Sparkles size={44} className="absolute right-6 top-5 text-gold/20" aria-hidden />
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <img src="/emids-logo-tight.png" alt="emids" className="h-4 w-auto shrink-0" />
                <p className="text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-gold">Total reward balance</p>
              </div>
              <span className="tnum shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-[10.5px] font-bold text-gold">🔥 6-week streak</span>
            </div>
            <p className="tnum mt-3 text-[38px] font-extrabold leading-none tracking-[0.03em] text-gold">
              {fmtNum(n)}<span className="ml-2 text-[14px] font-bold tracking-normal text-white/60">pts</span>
            </p>
            <p className="mt-1.5 text-[12px] text-white/60">+{earnedThisQuarter} earned this quarter · 1 point = ₹1 · never expires</p>
            <div className="mt-4 flex flex-wrap gap-2">

              <Btn size="sm" variant="gold" onClick={() => scrollTo('ledger')}>View ledger <ArrowRight size={13} /></Btn>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-muted">Earned lifetime</p>
          <p className="tnum mt-2 text-[28px] font-extrabold leading-none text-navy">4,460</p>
          <div className="mt-3.5 space-y-1.5">
            <p className="flex items-center justify-between text-[12.5px] font-semibold text-muted"><span>Awards</span><span className="tnum font-extrabold text-navy">2,650</span></p>
            <p className="flex items-center justify-between text-[12.5px] font-semibold text-muted"><span>Grants &amp; kudos</span><span className="tnum font-extrabold text-navy">1,310</span></p>
            <p className="flex items-center justify-between text-[12.5px] font-semibold text-muted"><span>Milestones</span><span className="tnum font-extrabold text-navy">500</span></p>
          </div>
          <p className="mt-3 border-t border-line pt-2.5 text-[12px] font-bold text-navy">Next tier · Platinum giver</p>
          <p className="text-[11.5px] text-muted">213 more recognitions to unlock</p>
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
          <Card className="p-5">
            <p className="flex items-center gap-2 text-[15px] font-extrabold text-navy"><BadgeCheck size={17} className="text-brand" /> Badge wall</p>
            <div className="mt-3.5 grid gap-2.5 sm:grid-cols-3">
              {me.badges.map((b) => (
                <div key={b} className="flex flex-col items-center rounded-2xl border border-line bg-gradient-to-b from-white to-brand-soft/40 px-3 py-4 text-center">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-card text-brand">{BADGE_ICONS[b] ?? <BadgeCheck size={18} />}</span>
                  <p className="mt-2 text-[11.5px] font-extrabold leading-tight text-navy">{b}</p>
                </div>
              ))}
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line px-3 py-4 text-center">
                <p className="text-[11px] font-bold text-muted">+9 more to unlock</p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <p className="flex items-center gap-2 text-[15px] font-extrabold text-navy"><Sparkles size={16} className="text-gold-ink" /> Values you live</p>
            <div className="mt-4 space-y-3">
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

        </aside>
      </div>
      {/* Ledger — always last */}
      <section id="ledger" className="mt-8 scroll-mt-24">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-extrabold tracking-tight text-navy">Points ledger</h2>
          <Chip className="bg-slate-100 text-muted">Digital · immutable</Chip>
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

