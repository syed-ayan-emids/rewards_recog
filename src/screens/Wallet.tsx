import React, { useState } from 'react'
import { ArrowDownLeft, ArrowRight, ArrowUpRight, Check, Copy, Gift, Landmark, ShoppingBag, Sparkles, Star, UtensilsCrossed, Plane, Trophy } from 'lucide-react'
import { Btn, Card, Chip, Modal, Ring, Sparkline, CloseX, confettiBurst } from '../ui'
import { LEDGER, VOUCHERS, type Voucher } from '../data'
import { useStore, fmtNum, useCountUp } from '../store'

const KIND: Record<string, { icon: React.ReactNode; tint: string; sign: string; color: string }> = {
  award: { icon: <Trophy size={16} />, tint: 'bg-violet-soft', color: 'text-violet', sign: '+' },
  grant: { icon: <ArrowDownLeft size={16} />, tint: 'bg-mint-soft', color: 'text-mint', sign: '+' },
  earning: { icon: <ArrowUpRight size={16} />, tint: 'bg-[#F7F1E1]', color: 'text-gold-ink', sign: '+' },
  redemption: { icon: <ShoppingBag size={16} />, tint: 'bg-coral-soft', color: 'text-coral', sign: '' },
}

const BRAND_ICON: Record<string, React.ReactNode> = {
  Amazon: <ShoppingBag size={18} />,
  Starbucks: <Star size={18} />,
  Swiggy: <UtensilsCrossed size={18} />,
  MakeMyTrip: <Plane size={18} />,
}

export default function WalletScreen() {
  const { balance } = useStore()
  const n = useCountUp(balance)
  const [redeem, setRedeem] = useState<Voucher | null>(null)

  return (
    <div>
      <div className="mb-6">
        <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-muted">Points economy</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-navy md:text-[34px]">Your wallet</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        {/* Hero */}
        <Card className="hero-room relative overflow-hidden p-0 text-white">
          <div className="dotgrid relative p-7">
            <div className="flex items-start justify-between">
              <div>
                <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-gold"><Sparkles size={13} /> Points balance</p>
                <p className="tnum mt-2 text-[52px] font-extrabold leading-none text-gold">{fmtNum(n)}</p>
                <p className="mt-1.5 text-[13px] text-white/60">1 point = ₹1 · no expiry on earned points</p>
              </div>
              <Ring pct={(1240 / 2000) * 100} size={86} stroke={8} color="var(--color-gold)" track="rgba(255,255,255,.18)">
                <span className="tnum text-[15px] font-extrabold text-white">62%</span>
                <span className="text-[8.5px] font-bold uppercase tracking-widest text-white/60">to gold tier</span>
              </Ring>
            </div>
            <div className="mt-5 flex items-end justify-between gap-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  ['Earned QTD', '460'],
                  ['Redeemed', '1,170'],
                  ['Pending', '0'],
                ].map(([l, v]) => (
                  <div key={l} className="rounded-xl bg-white/8 px-4 py-3 backdrop-blur-sm">
                    <p className="tnum text-[17px] font-extrabold text-white">{v}</p>
                    <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/55">{l}</p>
                  </div>
                ))}
              </div>
              <div className="hidden sm:block">
                <Sparkline data={[210, 240, 260, 320, 415, 450, 460]} w={170} h={46} stroke="var(--color-gold)" />
                <p className="mt-1 text-right text-[10px] font-semibold uppercase tracking-wider text-white/45">Earn rate · 7 wks</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Ways to earn */}
        <Card className="p-6">
          <p className="text-[15px] font-extrabold text-navy">How points pile up</p>
          <div className="mt-4 space-y-3">
            {[
              { l: 'Send a Congratz (public, specific)', v: '+15 / week', tint: 'bg-gold-soft text-gold-ink' },
              { l: 'Get recognized by 3+ teammates', v: '+40', tint: 'bg-violet-soft text-violet' },
              { l: 'EoQ award win', v: '+1,500–2,500', tint: 'bg-gold-soft text-gold-ink' },
              { l: 'Manager / peer grant for outcomes', v: 'variable', tint: 'bg-mint-soft text-mint' },
              { l: 'Complete a milestone year', v: '+500 / yr', tint: 'bg-coral-soft text-coral' },
            ].map((r) => (
              <div key={r.l} className="flex items-center justify-between gap-3 rounded-xl border border-line px-4 py-3">
                <p className="text-[13.5px] font-semibold text-ink">{r.l}</p>
                <Chip className={`shrink-0 ${r.tint} tnum`}>{r.v}</Chip>
              </div>
            ))}
          </div>
          <p className="mt-3.5 text-[11.5px] text-muted">Earned points never expire, are non-transferable, and redeem to vouchers only — finance controls store credit economics.</p>
        </Card>
      </div>

      {/* Ledger + marketplace */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.15fr]">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-extrabold tracking-tight text-navy">Ledger</h2>
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

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-extrabold tracking-tight text-navy">Redeem</h2>
            <span className="text-[12.5px] font-semibold text-muted">Instant delivery · Amazon &amp; more</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {VOUCHERS.map((v, i) => (
              <Card key={v.id} className="group overflow-hidden transition-shadow hover:shadow-lift" style={{ animation: `rise .4s ${i * 60}ms both` }}>
                <div className={`flex items-center justify-between px-4 py-3.5 ${v.accentBg}`}>
                  <div className="flex items-center gap-2.5 text-white" style={{ color: v.accentInk }}>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">{BRAND_ICON[v.brand]}</span>
                    <div>
                      <p className="text-[13.5px] font-bold">{v.title}</p>
                      <p className="text-[11px] opacity-75">{v.sub}</p>
                    </div>
                  </div>
                  {v.chip && <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white">{v.chip}</span>}
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <p className="tnum text-[17px] font-extrabold text-navy">{fmtNum(v.points)} <span className="text-[11px] font-bold text-muted">pts</span></p>
                  <Btn size="sm" variant={v.stock === 'low' ? 'outline' : 'primary'} onClick={() => setRedeem(v)}>
                    Redeem <ArrowRight size={13} />
                  </Btn>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>

      <RedeemModal voucher={redeem} onClose={() => setRedeem(null)} />
    </div>
  )
}

type RedeemState = 'confirm' | 'processing' | 'done'

function RedeemModal({ voucher, onClose }: { voucher: Voucher | null; onClose: () => void }) {
  const { balance, redeem, toast } = useStore()
  const [stage, setStage] = useState<RedeemState>('confirm')
  const [copied, setCopied] = useState(false)
  const [revealed, setRevealed] = useState(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => { setStage('confirm'); setCopied(false); setRevealed(false) }, [voucher])

  if (!voucher) return null
  const affordable = balance >= voucher.points

  const start = () => {
    if (!affordable) return
    setStage('processing')
    redeem(voucher.points)
    setTimeout(() => {
      setStage('done')
      confettiBurst(0.5, 0.35)
    }, 1300)
  }

  const code = 'EMDS-' + voucher.id.toUpperCase() + '-8X4L9D'

  const copy = async () => {
    try { await navigator.clipboard.writeText(code) } catch { toast('Copy is blocked by the browser — note it down') }
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Modal open={!!voucher} onClose={onClose} label="Redeem voucher">
      <div className="px-6 py-6">
        <CloseX onClick={onClose} />
        <div className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl text-white ${voucher.accentBg}`} style={{ color: voucher.accentInk }}>
          <Gift size={28} />
        </div>
        {stage === 'confirm' && (
          <>
            <h3 className="text-center text-xl font-extrabold text-navy">{voucher.title}</h3>
            <p className="mt-1 text-center text-sm text-muted">{voucher.sub}</p>
            <Card className="mt-5 divide-y divide-line">
              <Row l="Price" v={`${fmtNum(voucher.points)} pts`} />
              <Row l="Your balance" v={`${fmtNum(balance)} pts`} />
              <Row l="Balance after" v={`${fmtNum(balance - voucher.points)} pts`} strong />
            </Card>
            {!affordable && <p className="mt-3 rounded-xl bg-coral-soft px-4 py-2.5 text-center text-[13px] font-semibold text-coral">Short by {fmtNum(voucher.points - balance)} pts — send a few more Congratz this week.</p>}
            <Btn variant="gold" size="lg" className="mt-5 w-full" onClick={start} disabled={!affordable}>
              Confirm redemption
            </Btn>
            <p className="mt-2.5 text-center text-[11px] text-muted">Code is delivered by email as well. Corporate purchases are GST-invoiced to emids.</p>
          </>
        )}
        {stage === 'processing' && (
          <div className="py-10 text-center">
            <span className="mx-auto block h-12 w-12 animate-spin rounded-full border-[3.5px] border-line border-t-gold" />
            <p className="mt-4 font-bold text-navy">Reserving your voucher…</p>
            <p className="mt-1 text-sm text-muted">Filling with the redemption partner</p>
          </div>
        )}
        {stage === 'done' && (
          <div className="animate-pop text-center">
            <span className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-mint-soft text-mint"><Check size={30} /></span>
            <h3 className="text-xl font-extrabold text-navy">Here's your code</h3>
            <button onClick={() => setRevealed(!revealed)} className="tnum mt-4 w-full rounded-2xl border border-gold/60 bg-gold-soft px-4 py-4 text-2xl font-extrabold tracking-wider text-gold-ink transition hover:brightness-105" aria-label="Reveal code">
              {revealed ? code : '•••• •••• ••••'} {!revealed && <span className="block text-[11px] font-semibold uppercase tracking-wide text-gold-ink/60">tap to reveal</span>}
            </button>
            <div className="mt-4 flex gap-2">
              <Btn variant="outline" className="flex-1" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />} {copied ? 'Copied' : 'Copy code'}</Btn>
              <Btn variant="primary" className="flex-1" onClick={onClose}>Done</Btn>
            </div>
            <p className="mt-3 text-[11.5px] text-muted">A copy went to ayan@emids.com · redeems at {voucher.brand} checkout</p>
          </div>
        )}
      </div>
    </Modal>
  )
}

function Row({ l, v, strong }: { l: string; v: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <p className="text-[13px] text-muted">{l}</p>
      <p className={`tnum text-[14px] ${strong ? 'text-[15px] font-extrabold text-navy' : 'font-semibold text-ink'}`}>{v}</p>
    </div>
  )
}
