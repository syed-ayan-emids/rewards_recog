import React from 'react'
import { ArrowRight, Award, BadgeCheck, Landmark, Sparkles, Trophy } from 'lucide-react'
import { Avatar, Bar, Btn, Card } from '../ui'
import { CORE_VALUES, LEDGER, MY_NOMINATIONS, TOP_VALUES, person } from '../data'
import { useStore, fmtNum } from '../store'

const BADGE_ICONS: Record<string, React.ReactNode> = {
  'Value Champion ×3': <Sparkles size={16} />,
  'Top Giver — Q1': <Award size={16} />,
  '5-Year Milestone': <Landmark size={16} />,
}

export default function RewardsScreen() {
  const { balance, posts, setScreen, setComposer } = useStore()
  const me = person('me')
  const received = posts.filter((p) => p.toIds.includes('me'))
  const earnedThisQuarter = received.reduce((s, p) => s + (p.points ?? 0), 0)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-navy">My Rewards</h1>
        <p className="mt-1 text-[15px] text-muted">Everything you have earned, unlocked, and lived at emids.</p>
      </div>

      {/* Top strip */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <Card className="hero-room relative overflow-hidden p-5 text-white dotgrid md:col-span-2">
          <p className="text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-gold">Total reward balance</p>
          <div className="mt-2 flex items-end gap-3">
            <p className="tnum text-[40px] font-extrabold leading-none text-gold">{fmtNum(balance)}</p>
            <span className="mb-1 text-[13px] font-bold text-white/60">pts</span>
          </div>
          <p className="mt-1.5 text-[12.5px] text-white/60">+{earnedThisQuarter} earned this quarter · non-expiring</p>
          <div className="mt-4 flex gap-2">
            <Btn size="sm" variant="gold" onClick={() => setScreen('wallet')}>Redeem now <ArrowRight size={13} /></Btn>
            <button onClick={() => setScreen('wallet')} className="rounded-xl bg-white/12 px-3.5 py-2 text-[13px] font-bold transition hover:bg-white/20">View ledger</button>
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-muted">Earned lifetime</p>
          <p className="tnum mt-2 text-[28px] font-extrabold leading-none text-navy">{fmtNum(4460)}</p>
          <div className="mt-3 space-y-1.5">
            <p className="flex items-center justify-between text-[12px] font-semibold text-muted"><span>Awards</span><span className="tnum font-extrabold text-navy">2,650</span></p>
            <p className="flex items-center justify-between text-[12px] font-semibold text-muted"><span>Grants &amp; kudos</span><span className="tnum font-extrabold text-navy">1,310</span></p>
            <p className="flex items-center justify-between text-[12px] font-semibold text-muted"><span>Milestones</span><span className="tnum font-extrabold text-navy">500</span></p>
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-muted">Next tier</p>
          <p className="mt-2 text-[15px] font-extrabold text-navy">Platinum giver</p>
          <p className="mt-1 text-[12px] text-muted">2,500 rewards exchanged — 213 to go</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
        {/* Received + badges */}
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
                    {v && <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${v.soft} ${v.ink}`}>{v.label}</span>}
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
                    <p className="text-[12px] text-muted">nominated {person(nm.nomId).name === 'Emily Tran' ? 'you' : `'${person(nm.nomId).name}'`} · jury pipeline</p>
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

        {/* Badges + values */}
        <aside className="space-y-6">
          <Card className="p-5">
            <p className="flex items-center gap-2 text-[15px] font-extrabold text-navy"><BadgeCheck size={17} className="text-brand" /> Badge wall</p>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
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
                    <Bar pct={(count / 14) * 100} color={v.ink.replace('text-', 'bg-')} className="mt-1" />
                  </div>
                )
              })}
            </div>
          </Card>

          <Card className="p-5">
            <p className="text-[15px] font-extrabold text-navy">Recent points</p>
            <div className="mt-3.5 space-y-2.5">
              {LEDGER.slice(0, 4).map((e) => (
                <div key={e.id} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3.5 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-[12.5px] font-bold text-navy">{e.label}</p>
                    <p className="text-[11px] text-muted">{e.when}</p>
                  </div>
                  <span className={`tnum text-[13px] font-extrabold ${e.amount >= 0 ? 'text-mint' : 'text-coral'}`}>{e.amount >= 0 ? '+' : ''}{fmtNum(e.amount)}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setScreen('wallet')} className="mt-3.5 flex items-center gap-1.5 border-t border-line pt-3 text-[12.5px] font-bold text-brand hover:underline">Full ledger in wallet <ArrowRight size={13} /></button>
          </Card>

          <Card className="bg-gold-soft/50 p-5">
            <p className="text-[14px] font-extrabold text-navy">Keep the streak</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted">Ayan, one specific Congratz this week keeps your giver streak at <b className="text-navy">6 weeks</b>.</p>
            <Btn size="sm" variant="gold" className="mt-3" onClick={() => setComposer({ open: true })}>
              Send one now
            </Btn>
          </Card>
        </aside>
      </div>
    </div>
  )
}
