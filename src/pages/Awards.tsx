import React, { useMemo, useState } from 'react'
import { CalendarClock, CheckCircle2, CircleDashed, Search, ShieldCheck, Sparkles, Trophy, Users } from 'lucide-react'
import { Avatar, Btn, Card, Chip, Modal, SectionTitle, Segmented, CloseX, confettiBurst } from '../components/atoms'
import { AWARD_CATEGORIES, CORE_VALUES, MY_NOMINATIONS, PEOPLE_LIST, person } from '../data'
import { useStore } from '../store'

type NomState = 'detail' | 'processing' | 'added'

export default function AwardsScreen() {
  const { setScreen, setComposer, toast } = useStore()
  const [tab, setTab] = useState<'categories' | 'nominations'>('categories')
  const [nomCat, setNomCat] = useState<string | null>(null)

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-muted">End of Quarter · Q4 FY26</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-navy md:text-[34px]">Quarterly Awards</h1>
          <p className="mt-1 text-[15px] text-muted">Nominations open until Oct 31 · jury voting Nov 3–14 · winners announced Dec 5</p>
        </div>
        <Segmented options={[{ key: 'categories', label: 'Categories' }, { key: 'nominations', label: 'My nominations' }]} value={tab} onChange={setTab} />
      </div>

      <Card className="mb-8 flex flex-col gap-4 bg-violet-soft/60 p-5 sm:flex-row sm:items-center">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet text-white"><CalendarClock size={22} /></span>
        <div className="flex-1">
          <p className="font-extrabold text-navy">Windows are open — 4 categories accepting nominations</p>
          <p className="text-[13px] text-muted">Write-ups get AI evidence-checks before surfacing to the jury brief. Customer Champion is already in jury voting.</p>
        </div>
        <Btn variant="violet" onClick={() => setNomCat('in')}><Sparkles size={15} /> Start a nomination</Btn>
      </Card>

      {tab === 'categories' ? (
        <div className="grid gap-4 md:grid-cols-2">
          {AWARD_CATEGORIES.map((c, i) => {
            const v = CORE_VALUES[c.base]
            const voting = c.status === 'voting'
            return (
              <Card
                key={c.id}
                className={voting ? 'p-0 ring-2 ring-violet/30 ring-offset-2 md:col-span-2' : 'p-0'}
                style={{ animation: `rise .45s ${i * 70}ms both` }}
              >
                {voting && (
                  <div className="flex items-center gap-2 bg-violet px-5 py-2.5 text-white">
                    <span className="flex h-1.5 w-1.5 animate-ping rounded-full bg-gold" />
                    <p className="text-[11.5px] font-extrabold uppercase tracking-[0.14em]">Jury voting underway · 12 finalists</p>
                    <button onClick={() => setScreen('jury')} className="ml-auto rounded-full bg-white/15 px-3 py-1 text-[11.5px] font-bold transition hover:bg-white/25">Cast votes →</button>
                  </div>
                )}
                <div className={`p-6 ${voting ? 'md:flex md:items-center md:gap-8' : ''}`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2.5">
                      <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${v.soft} ${v.ink}`}><Trophy size={18} /></span>
                      <div>
                        <p className="text-lg font-extrabold text-navy">{c.name}</p>
                        <p className="text-[11.5px] font-bold uppercase tracking-wide text-muted">Lives the {v.label} value</p>
                      </div>
                      <Chip className={`ml-auto ${voting ? 'bg-violet-soft text-violet' : 'bg-mint-soft text-mint'}`}>{c.status === 'open' ? 'Open' : voting ? 'Voting' : 'Announced'}</Chip>
                    </div>
                    <p className="mt-3 text-[14px] leading-relaxed text-muted">{c.desc}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-4 text-[12.5px] font-semibold text-muted">
                      <span className="flex items-center gap-1.5"><Users size={14} /> {c.nomCount} nominations</span>
                      <span className="flex items-center gap-1.5"><Sparkles size={14} /> Prize {c.prize.toLocaleString('en-IN')} pts</span>
                      <span className="flex items-center gap-1.5"><CalendarClock size={14} /> {c.closes}</span>
                    </div>
                  </div>
                  <div className="mt-5 flex gap-2 md:mt-0 md:flex-col md:shrink-0">
                    <Btn variant="primary" onClick={() => setNomCat(c.id)}>Nominate</Btn>
                    {voting && <Btn variant="outline" onClick={() => setScreen('jury')}>See finalists</Btn>}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <NominationsList onNew={() => setNomCat('in')} onStartPraise={() => setComposer({ open: true })} />
      )}

      <NominationModal category={nomCat} onClose={() => setNomCat(null)} onDone={() => { setTab('nominations') }} onOpenJury={() => { setNomCat(null); setScreen('jury') }} />
    </div>
  )
}

function NominationsList({ onNew, onStartPraise }: { onNew: () => void; onStartPraise: () => void }) {
  const steps = ['Submitted', 'Manager endorsed', 'Jury review', 'Result']
  return (
    <div className="space-y-4">
      <Card className="flex items-center gap-4 border-dashed p-5">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold-soft text-gold-ink"><Trophy size={20} /></span>
        <div className="flex-1">
          <p className="font-bold text-navy">Have someone in mind who is flying under the radar?</p>
          <p className="text-[13px] text-muted">Jury briefs reward receipts — metrics, outcomes, named systems.</p>
        </div>
        <Btn variant="outline" onClick={onNew}>New nomination</Btn>
      </Card>

      {MY_NOMINATIONS.map((nm) => {
        const p = person(nm.nomId)
        const activeIdx = nm.status === 'result' ? 3 : nm.status === 'endorsed' ? 1 : 0
        return (
          <Card key={nm.id} className="p-5">
            <div className="flex items-center gap-3.5">
              <Avatar id={nm.nomId} size={44} />
              <div className="flex-1">
                <p className="font-extrabold text-navy">{p.name}</p>
                <p className="text-[12.5px] text-muted">{nm.categories}</p>
              </div>
              {nm.status === 'result' ? (
                <Chip className="bg-gold-soft text-gold-ink"><Trophy size={12} /> {nm.result}</Chip>
              ) : (
                <Chip className="bg-violet-soft text-violet">Pending jury</Chip>
              )}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-y-1 sm:grid-cols-4">
              {steps.map((s, i) => (
                <div key={s} className="flex items-center gap-2 sm:flex-col sm:gap-1">
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${i <= activeIdx ? 'bg-mint text-white' : 'bg-slate-100 text-muted'}`}>
                    {i < activeIdx || nm.status === 'result' ? <CheckCircle2 size={13} /> : i === activeIdx ? <CircleDashed size={13} className={nm.status === 'endorsed' ? 'hidden' : ''} /> : i}
                  </span>
                  <p className={`text-[11px] font-bold sm:text-center ${i <= activeIdx ? 'text-ink' : 'text-muted'}`}>{s}</p>
                </div>
              ))}
            </div>
          </Card>
        )
      })}
    </div>
  )
}

function NominationModal({ category, onClose, onDone, onOpenJury }: { category: string | null; onClose: () => void; onDone: () => void; onOpenJury: () => void }) {
  const { toast } = useStore()
  const [cat, setCat] = useState(category)
  const [personId, setPersonId] = useState('')
  const [q, setQ] = useState('')
  const [text, setText] = useState('')
  const [checks, setChecks] = useState<Record<string, boolean>>({ outcome: false, metrics: false, systems: false })
  const [busy, setBusy] = useState(false)
  const [stage, setStage] = useState<NomState>('detail')

  React.useEffect(() => { setCat(category); if (category) { setStage('detail'); setPersonId(''); setText(''); setChecks({ outcome: false, metrics: false, systems: false }) } }, [category])

  const results = useMemo(() => {
    if (!q.trim()) return []
    const s = q.toLowerCase()
    return PEOPLE_LIST.filter((p) => p.name.toLowerCase().includes(s)).slice(0, 5)
  }, [q])

  const aiPolish = () => {
    if (text.trim().length < 20) { toast('Write at least a couple of sentences first'); return }
    setBusy(true)
    setTimeout(() => {
      const name = personId ? person(personId).name.split(' ')[0] : 'They'
      setText((t) => `${t.trim().replace(/\.?$/, '.')} In short: ${name} turned intent into measurable outcome — recommend the jury weigh the replication factor, not just the single win.`)
      setChecks((c) => ({ ...c, outcome: true }))
      setBusy(false)
    }, 750)
  }

  const submit = () => {
    if (!cat || !personId || text.trim().length < 30) { toast('Category, nominee and evidence are required'); return }
    setStage('processing')
    setTimeout(() => {
      setStage('added')
      confettiBurst(0.5, 0.4)
    }, 1200)
  }

  const hasAll = Object.values(checks).every(Boolean)

  return (
    <Modal open={!!category} onClose={onClose} wide label="Nominate a teammate">
      <div className="flex flex-col">
        <div className="hero-room relative px-6 py-5 text-white dotgrid">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gold">EoQ nomination · jury-reviewed</p>
          <h2 className="mt-1 text-2xl font-extrabold">Put receipts on the table</h2>
          <CloseX onClick={onClose} className="text-white hover:bg-white/10 hover:text-white" />
        </div>

        {stage === 'detail' && (
          <div className="rail-scroll max-h-[65vh] overflow-y-auto px-6 py-5">
            <div className="flex flex-wrap gap-1.5">
              {AWARD_CATEGORIES.filter((c) => c.status === 'open').map((c) => (
                <button key={c.id} onClick={() => setCat(c.id)} className={`rounded-full border px-3.5 py-2 text-[13px] font-bold transition ${cat === c.id ? 'border-violet bg-violet-soft text-violet-ink' : 'border-line bg-white text-muted hover:text-ink'}`}>{c.name}</button>
              ))}
            </div>

            <label className="mb-1.5 mt-5 block text-[12px] font-bold uppercase tracking-wide text-muted">Nominee</label>
            {personId ? (
              <div className="flex items-center gap-3 rounded-xl border border-line bg-slate-50 px-3 py-2.5">
                <Avatar id={personId} size={36} />
                <div className="flex-1"><p className="text-sm font-bold text-navy">{person(personId).name}</p><p className="text-xs text-muted">{person(personId).title}</p></div>
                <button onClick={() => setPersonId('')} className="text-muted hover:text-coral" aria-label="Change nominee">×</button>
              </div>
            ) : (
              <div className="relative">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the company tree…" className="h-11 w-full rounded-xl border border-line bg-slate-50 pl-10 pr-4 text-sm outline-none focus:bg-white focus:border-violet/40" />
                {results.length > 0 && (
                  <div className="rail-scroll absolute inset-x-0 top-12 z-10 max-h-44 overflow-y-auto rounded-xl border border-line bg-white p-1 shadow-lift">
                    {results.map((p) => (
                      <button key={p.id} onClick={() => { setPersonId(p.id); setQ('') }} className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left hover:bg-slate-50">
                        <Avatar id={p.id} size={28} />
                        <span className="text-[13px] font-semibold text-navy">{p.name}</span>
                        <span className="text-[12px] text-muted">{p.title}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <label className="mb-1.5 mt-5 block text-[12px] font-bold uppercase tracking-wide text-muted">Evidence — what did they do, what changed?</label>
            <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} placeholder="Named systems, metrics, outcomes. 'Hard-working team player' will not survive the jury brief." className="w-full resize-none rounded-xl border border-line bg-slate-50 px-4 py-3 text-[14px] leading-relaxed outline-none focus:border-violet/40 focus:bg-white" />
            <div className="mt-2 flex items-center justify-between">
              <Btn size="sm" variant="violet" onClick={aiPolish} disabled={busy}>
                <Sparkles size={14} /> {busy ? 'Sharpening…' : 'AI summary polish'}
              </Btn>
              <span className="text-[11px] text-muted">Jury briefs are generated from this text</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              <button onClick={() => setChecks((c) => ({ ...c, metrics: !c.metrics }))} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold transition ${checks.metrics ? 'bg-mint-soft text-mint' : 'bg-coral-soft text-coral'}`}>
                {checks.metrics ? <CheckCircle2 size={13} /> : <CircleDashed size={13} />} Metrics included
              </button>
              <button onClick={() => setChecks((c) => ({ ...c, systems: !c.systems }))} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold transition ${checks.systems ? 'bg-mint-soft text-mint' : 'bg-coral-soft text-coral'}`}>
                {checks.systems ? <CheckCircle2 size={13} /> : <CircleDashed size={13} />} Named systems / accounts
              </button>
              <button onClick={() => setChecks((c) => ({ ...c, outcome: !c.outcome }))} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold transition ${checks.outcome ? 'bg-mint-soft text-mint' : 'bg-coral-soft text-coral'}`}>
                {checks.outcome ? <CheckCircle2 size={13} /> : <CircleDashed size={13} />} Outcome &amp; attribution
              </button>
            </div>
            {!hasAll && <p className="mt-2 rounded-xl bg-warn-soft px-3.5 py-2 text-[12.5px] font-semibold text-warn">Nominations missing evidence chips get flagged to the jury — check all three, the AI reviewer will too.</p>}
          </div>
        )}

        {stage === 'processing' && (
          <div className="py-14 text-center">
            <span className="mx-auto block h-12 w-12 animate-spin rounded-full border-[3.5px] border-line border-t-violet" />
            <p className="mt-4 font-bold text-navy">Routing for manager endorsement…</p>
            <p className="mt-1 text-sm text-muted">AI reviewer is drafting the jury brief</p>
          </div>
        )}

        {stage === 'added' && (
          <div className="animate-pop px-6 py-10 text-center">
            <span className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-violet-soft text-violet"><ShieldCheck size={30} /></span>
            <h3 className="text-xl font-extrabold text-navy">Nomination in the pipeline</h3>
            <p className="mx-auto mt-1 max-w-sm text-sm text-muted">Manager endorsement next — the jury brief has been prepared and policy-checked. Track it under My nominations.</p>
            <div className="mt-5 flex justify-center gap-2">
              <Btn variant="outline" onClick={() => { onClose(); }}>My nominations</Btn>
              <Btn variant="primary" onClick={() => { onClose(); onDone(); confettiBurst(0.5, 0.4) }}>Track it →</Btn>
            </div>
          </div>
        )}

        {stage === 'detail' && (
          <div className="flex items-center justify-between border-t border-line px-6 py-4">
            <p className="flex items-center gap-1.5 text-[12px] text-muted"><Sparkles size={13} className="text-violet" /> Finalists go to jury voting Nov 3</p>
            <div className="flex gap-2">
              <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
              <Btn variant="violet" onClick={submit}>Submit nomination</Btn>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
