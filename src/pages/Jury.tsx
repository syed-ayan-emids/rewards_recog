import React, { useEffect, useState } from 'react'
import { Award, CheckCircle2, Flag, Sparkles, Star, Trophy, X } from 'lucide-react'
import confetti from 'canvas-confetti'
import { Avatar, Btn, Card, Chip, SectionTitle } from '../components/atoms'
import { AWARD_CATEGORIES, JURY_NOMINEES, person } from '../data'
import { useStore } from '../store'

export default function JuryScreen() {
  const { toast } = useStore()
  const [cat, setCat] = useState<string>('all')
  const [votes, setVotes] = useState<Record<string, string>>({})
  const [shortlist, setShortlist] = useState<Record<string, boolean>>({ j1: true, j7: true })
  const [reveal, setReveal] = useState(false)

  const list = JURY_NOMINEES.filter((n) => cat === 'all' || n.categories === cat)
  const voteCount = Object.keys(votes).length

  const castVote = (id: string) => {
    setVotes((v) => ({ ...v, [id]: 'me' }))
    toast('Your vote is in — locked until Round 2 closes', 'mint')
  }

  const doReveal = () => {
    setReveal(true)
    const end = Date.now() + 1400
    const frame = () => {
      confetti({ particleCount: 24, spread: 110, startVelocity: 42, origin: { x: Math.random(), y: Math.random() * 0.3 }, colors: ['#FFB224', '#FF5A5F', '#7A5AF8', '#2563EB'], disableForReducedMotion: true })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()
  }

  useEffect(() => {
    if (!reveal) return
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') setReveal(false) }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [reveal])

  const winners = JURY_NOMINEES.filter((j) => j.score >= 5)

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-muted">EoQ Q4 FY26 · Round 2 — executive jury</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-navy md:text-[34px]">Jury dashboard</h1>
          <p className="mt-1 text-[15px] text-muted">Your ballot locks at 5:00 PM IST · briefs below are AI-prepared from nomination evidence</p>
        </div>
        <div className="flex items-center gap-3">
          <Card className="tnum px-4 py-2.5 text-center">
            <p className="text-[19px] font-extrabold text-navy">{voteCount}<span className="text-muted">/7</span></p>
            <p className="text-[10px] font-bold uppercase tracking-wide text-muted">Votes cast</p>
          </Card>
          <Btn variant="gold" size="lg" onClick={doReveal}><Trophy size={17} /> Reveal winners</Btn>
        </div>
      </div>

      {/* Category filter */}
      <div className="rail-scroll mb-5 flex gap-2 overflow-x-auto pb-1">
        {['all', ...AWARD_CATEGORIES.map((c) => c.name)].map((k) => (
          <button key={k} onClick={() => setCat(k)} className={`shrink-0 rounded-full border px-4 py-2 text-[13px] font-bold transition ${cat === k ? 'border-violet bg-violet text-white' : 'border-line bg-white text-muted hover:text-ink'}`}>
            {k === 'all' ? 'All categories' : k}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {list.map((n, i) => {
          const p = person(n.nomId)
          const voted = !!votes[n.id]
          const nomCat = AWARD_CATEGORIES.find((c) => c.name === n.categories)
          const base = nomCat?.base
          const tint = (nomCat ? { customerFirst: 'bg-value-cf-soft text-value-cf', innovation: 'bg-value-in-soft text-value-in', collaboration: 'bg-value-co-soft text-value-co', ownership: 'bg-value-ow-soft text-value-ow', winningMindset: 'bg-value-wm-soft text-value-wm' }[base ?? 'collaboration'] : 'bg-violet-soft text-violet') as string
          return (
            <Card key={n.id} className="flex flex-col p-5" style={{ animation: `rise .45s ${i * 60}ms both` }}>
              <div className="flex items-start gap-3.5">
                <Avatar id={n.nomId} size={46} ring={voted} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="text-[15px] font-extrabold text-navy">{p.name}</p>
                    <Chip className={tint}>{n.categories}</Chip>
                  </div>
                  <p className="text-[11.5px] text-muted">Nominated by {n.nomBy} · {p.title}</p>
                </div>
                <button
                  onClick={() => setShortlist((s) => ({ ...s, [n.id]: !s[n.id] }))}
                  aria-pressed={shortlist[n.id]}
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wide transition ${shortlist[n.id] ? 'border-gold bg-gold-soft text-gold-ink' : 'border-line text-muted hover:border-gold/50'}`}
                >
                  Shortlist
                </button>
              </div>

              {/* AI brief */}
              <div className="mt-3.5 rounded-xl border-l-4 border-violet bg-violet-soft/50 px-3.5 py-3">
                <p className="flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-wider text-violet"><Sparkles size={11} /> AI brief · from evidence</p>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink">{n.brief}</p>
              </div>

              {n.flags.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {n.flags.map((f) => (
                    <span key={f} className="flex items-center gap-1.5 rounded-full bg-warn-soft px-2.5 py-1 text-[11px] font-bold text-warn"><Flag size={10} /> {f}</span>
                  ))}
                </div>
              )}

              <div className="mt-auto pt-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={17}
                      className={s <= n.score ? 'fill-gold text-gold' : 'text-line'}
                      aria-hidden
                    />
                  ))}
                  <span className="tnum ml-2 text-[12px] font-bold text-muted">Evidence score {n.score}/5</span>
                  <span className="ml-auto flex items-center gap-1.5 text-[12px] font-bold text-muted"><Award size={13} /> {n.votes} panel votes</span>
                </div>
                <Btn
                  variant={voted ? 'outline' : 'primary'}
                  className="mt-3 w-full"
                  onClick={() => castVote(n.id)}
                  disabled={voted}
                >
                  {voted ? <><CheckCircle2 size={15} className="text-mint" /> Your vote is in</> : 'Cast vote'}
                </Btn>
              </div>
            </Card>
          )
        })}
      </div>

      {reveal && <RevealOverlay winners={winners} onClose={() => setReveal(false)} />}
    </div>
  )
}

interface RevealOverlayProps {
  winners: typeof JURY_NOMINEES
  onClose: () => void
}

function RevealOverlay({ winners, onClose }: RevealOverlayProps) {
  const [leave, setLeave] = useState(false)
  const doClose = () => { setLeave(true); setTimeout(onClose, 260) }
  return (
    <div className={`fixed inset-0 z-[70] flex items-center justify-center transition-opacity duration-300 ${leave ? 'opacity-0' : 'opacity-100'}`} role="dialog" aria-modal="true" aria-label="Winners reveal">
      <div className="hero-room dotgrid absolute inset-0 bg-navy-deep" />
      <button onClick={doClose} aria-label="Close reveal" className="absolute right-6 top-6 z-10 rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white"><X size={22} /></button>
      <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
        <span className="mx-auto block w-fit animate-pop rounded-full bg-gold/15 p-5"><Trophy size={54} className="text-gold" /></span>
        <p className="mt-5 text-[12px] font-extrabold uppercase tracking-[0.3em] text-gold">Q4 FY26 · End of Quarter awards</p>
        <h2 className="mt-2 text-4xl font-extrabold text-white md:text-5xl">The jury has decided</h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {winners.map((w, i) => {
            const p = person(w.nomId)
            return (
              <div key={w.id} className="animate-rise rounded-2xl border border-white/15 bg-white/10 p-5 text-left backdrop-blur-sm" style={{ animationDelay: `${i * 140}ms` }}>
                <div className="flex items-center gap-3">
                  <Avatar id={w.nomId} size={44} ring />
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-extrabold text-white">{p.name}</p>
                    <p className="text-[11.5px] text-white/60">{w.categories} · {p.title}</p>
                  </div>
                  <span className="ml-auto rounded-full bg-gold px-2.5 py-1 text-[11px] font-extrabold text-[#3d2b00]">+{w.categories === 'Rising Star' ? '1,500' : '2,000'} pts</span>
                </div>
              </div>
            )
          })}
        </div>
        <Btn variant="gold" size="lg" className="mt-9" onClick={doClose}>Back to dashboard</Btn>
      </div>
    </div>
  )
}
