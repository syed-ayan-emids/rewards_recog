import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, Check, Maximize2, Send, Sparkles, Users, X } from 'lucide-react'
import { Avatar, Btn, Modal } from '../atoms'
import { CORE_VALUES, VALUE_KEYS, VALUE_TEMPLATES, PEOPLE_LIST, PEOPLE, EMAIL_RE, ensurePersonFromEmail } from '../../data'
import type { ValueKey } from '../../data'
import { useStore } from '../../store'

const POINT_PRESETS = [0, 25, 50, 100]

/** Who you might be recognizing — rolls through vertically in the composer heading. */
const ROTATE_WORDS = ['teammate', 'colleague', 'team lead', 'manager', 'peer']

export function RollWord({ className = '' }: { className?: string }) {
  const [idx, setIdx] = useState(0)
  const [w, setW] = useState<number | undefined>(undefined)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const t = setInterval(() => setIdx((v) => (v + 1) % ROTATE_WORDS.length), 2600)
    return () => clearInterval(t)
  }, [])

  /* Keep the clip window as wide as the current word so it glides instead of snapping. */
  useLayoutEffect(() => {
    if (ref.current) setW(ref.current.offsetWidth)
  }, [idx])

  return (
    <span
      aria-live="polite"
      /* inline-flex + align-items baseline keeps the rolling word on the same text baseline as the words around it */
      className="relative inline-flex items-baseline overflow-hidden"
      style={{ width: w, transition: 'width 420ms cubic-bezier(0.33, 1, 0.68, 1)' }}
    >
      <span
        key={idx}
        ref={ref}
        className={`word-roll-cycle whitespace-nowrap ${className}`}
        style={{ animation: 'word-roll 2600ms cubic-bezier(0.33, 1, 0.68, 1) both' }}
      >
        {ROTATE_WORDS[idx]}
      </span>
    </span>
  )
}

const AI_DRAFTS: Record<ValueKey, string> = {
  customerFirst: 'went above and beyond for the client this week — the turnaround on their urgent request was seamless, and the client team specifically called it out in the QBR thread.',
  innovation: 'found a cleaner way to solve a problem we had all stopped questioning. The new approach cut manual effort substantially and is already being picked up by other pods.',
  collaboration: 'stepped in across team boundaries without hesitation — unblocked two other squads this week and shared the context so it stuck.',
  ownership: 'took the hard ticket nobody wanted and drove it end-to-end: root cause, fix, and a repro test so it never comes back.',
  winningMindset: 'brought real momentum at the most critical moment of the sprint — late nights, calm head, and a shipped result to show for it.',
}

/** Optional pre-selection applied when the composer opens. */
export type { ComposerPreset, ComposerState } from '../../store'

import type { ComposerPreset } from '../../store'

export interface ComposerProps {
  /** Whether the composer screen is shown. */
  open: boolean
  /** Optional pre-selection applied when the composer opens. */
  preset?: ComposerPreset
}

export default function Composer({ open, preset }: ComposerProps) {
  const { setComposer, closeComposer, sendPraise, submitForApproval, toast } = useStore()
  const [toSel, setToSel] = useState<string[]>(preset?.toId ? [preset.toId] : [])
  const [q, setQ] = useState('')
  const [pickerOpen, setPickerOpen] = useState(false)
  const [valueKey, setValueKey] = useState<ValueKey | null>(null)
  const [msg, setMsg] = useState('')
  const [points, setPoints] = useState(0)
  const [visibility] = useState<'public' | 'private'>('public')
  const [aiBusy, setAiBusy] = useState(false)
  const [tplId, setTplId] = useState<string | null>(null)
  const [ccSel, setCcSel] = useState<string[]>([])
  const [ccq, setCcq] = useState('')
  const [ccPickerOpen, setCcPickerOpen] = useState(false)
  /* Chip label per recipient id — shows what was typed when that was a full email address, otherwise the name. */
  const [labels, setLabels] = useState<Record<string, string>>({})
  const [variantIdx, setVariantIdx] = useState(0)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (open) {
      setToSel(preset?.toId ? [preset.toId] : [])
      setQ(''); setValueKey(null); setMsg(''); setPoints(0)
      setTplId(null); setCcSel([]); setCcq(''); setLabels({}); setVariantIdx(0); setExpanded(false)
      setTimeout(() => document.getElementById('composer-to-input')?.focus(), 60)
    }
  }, [open, preset])

  const pickResults = useMemo(() => {
    if (!q.trim()) return []
    const s = q.toLowerCase()
    return PEOPLE_LIST.filter((p) => p.id !== 'me' && (p.name.toLowerCase().includes(s) || p.title.toLowerCase().includes(s) || p.email.toLowerCase().includes(s))).slice(0, 6)
  }, [q])

  const emailCandidate = useMemo(() => {
    const value = q.trim().toLowerCase()
    return EMAIL_RE.test(value) && !PEOPLE_LIST.some((p) => p.email === value) ? value : null
  }, [q])

  const ccResults = useMemo(() => {
    if (!ccq.trim()) return []
    const s = ccq.toLowerCase()
    return PEOPLE_LIST.filter((p) => p.id !== 'me' && !toSel.includes(p.id) && !ccSel.includes(p.id) && (p.name.toLowerCase().includes(s) || p.title.toLowerCase().includes(s) || p.email.toLowerCase().includes(s))).slice(0, 6)
  }, [ccq, toSel, ccSel])

  const ccManagers = useMemo(() => [...new Set(toSel.map((id) => PEOPLE[id]?.managerId).filter(Boolean))] as string[], [toSel])

  const canSend = toSel.length > 0 && valueKey && msg.trim().length > 8

  const tpl = valueKey ? VALUE_TEMPLATES[valueKey]?.find((t) => t.id === tplId) ?? null : null

  const aiDraft = () => {
    if (!toSel.length) { toast('Pick at least one person first'); return }
    setAiBusy(true)
    setTimeout(() => {
      const names = toSel.map((id) => PEOPLE[id].name.split(' ')[0]).join(' and ')
      setMsg(`${names} ${AI_DRAFTS[valueKey ?? 'ownership']} Keep it in your own words if you can.`)
      setAiBusy(false)
    }, 800)
  }

  const aiPolish = () => {
    if (msg.trim().length < 10) return
    setAiBusy(true)
    setTimeout(() => {
      setMsg((m) => m.trim().replace(/\s+/g, ' ').replace(/\.?$/, '. This made a real difference — thank you for setting the standard.'))
      setAiBusy(false)
    }, 650)
  }

  const submit = () => {
    if (!canSend || !valueKey) return
    sendPraise({ toIds: toSel, valueKey, message: msg.trim(), points, artUrl: tpl ? (tpl.urls[variantIdx] ?? tpl.urls[0]) : undefined, tpl: tpl?.id })
    closeComposer()
    import('canvas-confetti').then((mod) => {
      mod.default({ particleCount: 90, spread: 70, origin: { y: 0.65 }, colors: ['#FFB224', '#FF5A5F', '#7A5AF8', '#0E9384'], disableForReducedMotion: true })
    })
  }

  const previewValue = valueKey ? CORE_VALUES[valueKey] : null
  const activeTpl = tpl && valueKey ? tpl : VALUE_TEMPLATES.customerFirst[0]
  const recipients = toSel.map((id) => ({ id, label: labels[id] ?? PEOPLE[id].name.split(' ')[0] }))

  if (!open) return null

  return (
    <div className="flex flex-col">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 pt-4">
          <h1 className="text-2xl font-extrabold tracking-tight text-navy md:text-[28px]">
            Recognize your <RollWord className="say-shimmer" />
          </h1>
          <Btn variant="ghost" size="sm" onClick={closeComposer}><ArrowLeft size={16} /> Back</Btn>
        </div>
        <div className="mx-auto grid w-full max-w-6xl gap-x-6 gap-y-5 px-5 py-4 lg:grid-cols-[1fr_1.4fr]">
          {/* Left: compose */}
          <div>
            {/* To */}
            <div
              className="flex min-h-12 flex-wrap items-center gap-2 rounded-xl border border-line bg-slate-50 px-3 py-2 transition focus-within:border-brand/40 focus-within:bg-white"
            >
              <span className="text-[13px] font-bold text-muted">To</span>
              {toSel.map((id) => (
                <span key={id} className="flex items-center gap-1.5 rounded-full bg-white py-0.5 pl-1 pr-1.5 shadow-card border border-line">
                  <Avatar id={id} size={22} />
                  <button onClick={() => setToSel(toSel.filter((x) => x !== id))} className="max-w-[110px] truncate text-[13px] font-semibold text-navy">{labels[id] ?? PEOPLE[id].name.split(' ')[0]}</button>
                  <button aria-label={`Remove ${PEOPLE[id].name}`} onClick={() => setToSel(toSel.filter((x) => x !== id))} className="text-muted hover:text-coral"><X size={12} /></button>
                </span>
              ))}
              <input
                id="composer-to-input"
                value={q}
                onChange={(e) => { setQ(e.target.value); setPickerOpen(true) }}
                placeholder={toSel.length ? 'Add more…' : 'Whom do you want to recognise?'}
                className="h-8 min-w-[170px] flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
              />
            </div>
            {pickerOpen && q.trim() && (
              <div className="rail-scroll mt-1.5 max-h-44 overflow-y-auto rounded-xl border border-line bg-white p-1 shadow-card">
                {emailCandidate && (
                  <button
                    onClick={() => {
                      const p = ensurePersonFromEmail(emailCandidate)
                      if (!toSel.includes(p.id)) {
                        setToSel([...toSel, p.id])
                        setLabels((l) => ({ ...l, [p.id]: emailCandidate }))
                      }
                      setQ('')
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition hover:bg-slate-50"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[11px] font-bold text-muted">@</span>
                    <span className="text-[13px] font-semibold text-navy">Add {emailCandidate}</span>
                    <span className="ml-auto text-[11px] text-muted">not in the directory</span>
                  </button>
                )}
                {(pickResults.length === 0 && !emailCandidate) && <p className="px-3 py-2 text-[13px] text-muted">No match — anyone at emids is eligible.</p>}
                {pickResults.map((p) => (
                  <button key={p.id} onClick={() => { if (!toSel.includes(p.id)) { setToSel([...toSel, p.id]); const typed = q.trim(); setLabels((l) => ({ ...l, [p.id]: EMAIL_RE.test(typed) ? typed.toLowerCase() : PEOPLE[p.id].name.split(' ')[0] })) } setQ(''); }} className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition hover:bg-slate-50">
                    <Avatar id={p.id} size={28} />
                    <span className="text-[13px] font-semibold text-navy">{p.name}</span>
                    <span className="text-[12px] text-muted">{p.title}</span>
                    {toSel.includes(p.id) && <span className="ml-auto text-xs font-bold text-mint">Added</span>}
                  </button>
                ))}
              </div>
            )}

            {/* CC */}
            <div
              className="mt-2.5 flex min-h-11 flex-wrap items-center gap-2 rounded-xl border border-line bg-slate-50 px-3 py-2 transition focus-within:border-brand/40 focus-within:bg-white"
            >
              <span className="text-[13px] font-bold text-muted">cc</span>
              {ccManagers.map((id) => (
                <span key={id} className="flex items-center gap-1.5 rounded-full bg-navy/5 border border-line py-0.5 pl-1 pr-2">
                  <Avatar id={id} size={20} />
                  <span className="text-[12px] font-semibold text-navy">{PEOPLE[id]?.name.split(' ')[0] ?? 'Manager'}</span>
                  <span className="text-[10px] font-bold font-mono uppercase tracking-wide text-muted">· manager</span>
                </span>
              ))}
              {ccSel.map((id) => (
                <span key={id} className="flex items-center gap-1.5 rounded-full bg-white py-0.5 pl-1 pr-1.5 shadow-card border border-line">
                  <Avatar id={id} size={22} />
                  <button className="max-w-[110px] truncate text-[13px] font-semibold text-navy">{labels[id] ?? PEOPLE[id]?.name.split(' ')[0]}</button>
                  <button aria-label={`Remove ${labels[id] ?? PEOPLE[id]?.name} from CC`} onClick={() => setCcSel(ccSel.filter((x) => x !== id))} className="text-muted hover:text-coral"><X size={12} /></button>
                </span>
              ))}
              <input
                value={ccq}
                onChange={(e) => { setCcq(e.target.value); setCcPickerOpen(true) }}
                placeholder={ccSel.length || ccManagers.length ? 'Add more…' : 'Anyone else who should hear about this?'}
                className="h-7 min-w-[150px] flex-1 bg-transparent text-[13px] outline-none placeholder:text-muted"
              />
            </div>
            {ccPickerOpen && ccq.trim() && (
              <div className="rail-scroll mt-1.5 max-h-40 overflow-y-auto rounded-xl border border-line bg-white p-1 shadow-card">
                {(() => {
                  const value = ccq.trim().toLowerCase()
                  const candidate = EMAIL_RE.test(value) && !PEOPLE_LIST.some((p) => p.email === value) ? value : null
                  return (
                    <>
                      {candidate && (
                        <button
                          onClick={() => {
                            const p = ensurePersonFromEmail(candidate)
                            if (!ccSel.includes(p.id)) {
                              setCcSel([...ccSel, p.id])
                              setLabels((l) => ({ ...l, [p.id]: candidate }))
                            }
                            setCcq('')
                          }}
                          className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition hover:bg-slate-50"
                        >
                          <span className="flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[11px] font-bold text-muted">@</span>
                          <span className="text-[13px] font-semibold text-navy">Add {candidate}</span>
                          <span className="ml-auto text-[11px] text-muted">not in the directory</span>
                        </button>
                      )}
                      {(ccResults.length === 0 && !candidate) && <p className="px-3 py-2 text-[13px] text-muted">No match — or already added.</p>}
                    </>
                  )
                })()}
                {ccResults.map((p) => (
                  <button key={p.id} onClick={() => { if (!ccSel.includes(p.id)) { setCcSel([...ccSel, p.id]); const typed = ccq.trim(); setLabels((l) => ({ ...l, [p.id]: EMAIL_RE.test(typed) ? typed.toLowerCase() : p.name.split(' ')[0] })) } setCcq('') }} className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition hover:bg-slate-50">
                    <Avatar id={p.id} size={26} />
                    <span className="text-[13px] font-semibold text-navy">{p.name}</span>
                    <span className="text-[12px] text-muted">{p.title}</span>
                    {p.managerId && <span className="ml-auto text-[10.5px] font-bold text-muted font-mono uppercase tracking-wide">manager: {PEOPLE[p.managerId]?.name.split(' ')[0]}</span>}
                  </button>
                ))}
              </div>
            )}

            {/* Value */}
            <label className="mb-1.5 mt-5 flex items-center justify-between text-[11.5px] font-extrabold font-mono uppercase tracking-[0.12em] text-muted">
              <span>Which emids value did they demonstrate?</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {VALUE_KEYS.map((k) => {
                const v = CORE_VALUES[k]
                const on = valueKey === k
                return (
                  <button
                    key={k}
                    onClick={() => {
                      const t = VALUE_TEMPLATES[k]?.[0] ?? null
                      const prev = valueKey ? VALUE_TEMPLATES[valueKey]?.find((x) => x.id === tplId) : null
                      setTplId(t?.id ?? null)
                      setValueKey(k)
                      const first = toSel[0] ? PEOPLE[toSel[0]]?.name.split(' ')[0] : null
                      setMsg((m) => {
                        if (prev?.prefill && m.trimEnd().endsWith(prev.prefill)) {
                          const prefix = m.slice(0, m.length - prev.prefill.length)
                          return t?.prefill ? prefix + t.prefill : m
                        }
                        if (t?.prefill && !m.trim()) return first ? `${first} — ${t.prefill}` : t.prefill
                        return m
                      })
                    }}
                    className={`rounded-xl border px-3.5 py-2 text-[13px] font-bold transition active:scale-95 ${v.soft} ${v.ink} ${on ? 'border-current' : 'border-transparent opacity-75 hover:opacity-100'}`}
                  >
                    {v.label}
                  </button>
                )
              })}
            </div>

            {/* Message */}
            <label className="mb-1.5 mt-5 flex items-center justify-between text-[11.5px] font-extrabold font-mono uppercase tracking-[0.12em] text-muted">
              <span>Describe Their Contribution</span>
            </label>
            <div className="rounded-xl border border-line bg-slate-50 transition focus-within:border-brand/40 focus-within:bg-white">
              <textarea
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                rows={4}
                placeholder="What made them stand out?"
                className="w-full resize-none bg-transparent px-4 pt-3 text-[14.5px] leading-relaxed outline-none placeholder:text-muted"
              />
              <div className="flex flex-wrap items-center gap-2 border-t border-line px-3 py-2.5">
                <Btn size="sm" variant="violet" onClick={aiDraft} disabled={aiBusy}>
                  <Sparkles size={14} /> {aiBusy ? 'Thinking…' : 'Draft for me'}
                </Btn>
                <Btn size="sm" variant="outline" onClick={aiPolish} disabled={aiBusy || msg.trim().length < 10}>
                  <Sparkles size={14} /> Polish
                </Btn>
              </div>
            </div>

            {/* Points */}
            <label className="mb-1.5 mt-5 flex items-center justify-between text-[11.5px] font-extrabold font-mono uppercase tracking-[0.12em] text-muted">
              <span>Attach points</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {POINT_PRESETS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPoints(p)}
                  className={`tnum rounded-xl border py-2.5 text-[13px] font-extrabold transition active:scale-95 ${points === p ? 'border-gold bg-gold text-[#3d2b00] shadow-[0_6px_14px_rgba(255,178,36,0.4)]' : 'border-line bg-white text-muted hover:border-gold/50 hover:text-ink'}`}
                >
                  {p === 0 ? 'Skip' : `+${p}`}
                </button>
              ))}
            </div>
          </div>

          {/* Right: template chooser */}
          <div className="flex h-full flex-col lg:sticky lg:top-20">
            <p className="mb-1.5 text-[11.5px] font-extrabold font-mono uppercase tracking-[0.12em] text-muted">Templates</p>
            <div className="grid grid-cols-3 gap-1.5">
              {activeTpl.urls.map((u, idx) => (
                <button
                  key={u}
                  onClick={() => setVariantIdx(idx)}
                  aria-current={variantIdx === idx}
                  aria-label={`Choose template ${idx + 1}`}
                  className={`block w-full relative overflow-hidden rounded-lg border transition ${variantIdx === idx ? 'border-transparent ring-2 ring-brand shadow-lift' : 'border-line bg-brand-soft/40 hover:border-brand/40'}`}
                  style={{ backgroundImage: `url(${u})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                  <div className="aspect-[1100/314] w-full" />
                  <span className="absolute bottom-1 left-1 rounded-full bg-white/85 px-1.5 py-0.5 text-[9px] font-bold text-navy">{idx + 1}</span>
                  {variantIdx === idx && (
                    <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-white shadow-card"><Check size={10} /></span>
                  )}
                </button>
              ))}
            </div>
            <p className="mb-1.5 mt-5 text-[11.5px] font-extrabold font-mono uppercase tracking-[0.12em] text-muted">Preview</p>
            <div className="relative flex flex-1 flex-col">
              <TemplateCard
                tpl={activeTpl}
                url={activeTpl.urls[variantIdx] ?? activeTpl.urls[0]}
                previewValue={previewValue}
                recipients={recipients}
                points={points}
                msg={msg}
              />
              {canSend && (
                <button
                  onClick={() => setExpanded(true)}
                  aria-label="Expand preview"
                  className="absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/85 text-navy shadow-card transition hover:bg-white"
                >
                  <Maximize2 size={15} />
                </button>
              )}
            </div>
            <div className="mt-auto flex items-center justify-end gap-2">
              <Btn variant="ghost" onClick={closeComposer}>Cancel</Btn>
              <Btn variant="primary" onClick={submit} disabled={!canSend} className="px-5">
                <Send size={15} /> Post it
              </Btn>
            </div>
          </div>
        </div>

      {/* Expanded final preview */}
      <Modal open={expanded && !!tpl && !!valueKey} onClose={() => setExpanded(false)} wide label="Template preview">
        {tpl && valueKey && (
          <div className="p-4 sm:p-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[13px] font-extrabold text-navy">Final preview · {tpl.name}</p>
              <button onClick={() => setExpanded(false)} aria-label="Close preview" className="rounded-full p-1.5 text-muted transition hover:bg-slate-100 hover:text-ink"><X size={18} /></button>
            </div>
            <TemplateCard
              big
              tpl={tpl}
              url={tpl.urls[variantIdx] ?? tpl.urls[0]}
              previewValue={previewValue}
              recipients={recipients}
              points={points}
              msg={msg}
            />
          </div>
        )}
      </Modal>
    </div>
  )
}

export function TemplateCard({ tpl, url, previewValue, recipients, points, msg, big }: {
  tpl?: { name: string; emoji: string }
  url?: string
  previewValue: { label: string; soft: string; ink: string } | null
  recipients: { id: string; label: string }[]
  points: number
  msg: string
  big?: boolean
}) {
  const pad = big ? 'px-5' : 'px-3.5'
  return (
    <div className={`flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card ${big ? 'rounded-3xl' : ''}`}>
      {url && (
        <div className="border-b border-line bg-brand-soft/30">
          <img src={url} alt="" className="block min-h-[150px] w-full object-cover" />
        </div>
      )}
      <div className={`${pad} ${big ? 'py-5' : 'py-4'}`}>
        <p className={`leading-relaxed text-ink ${big ? 'text-[15px]' : 'text-[13px]'}`}>
          {msg.trim()
            ? msg
            : <span className="italic text-muted">Your praise shows up here live as you type…</span>}
        </p>
      </div>
      <div className={`mt-auto flex flex-wrap items-center gap-2 border-y border-line ${pad} ${big ? 'py-3.5' : 'py-3'}`}>
        {recipients.length > 0 && (
          <>
            <div className="flex -space-x-2">
              {recipients.slice(0, 3).map((r) => <span key={r.id} className="rounded-full ring-2 ring-white"><Avatar id={r.id} size={20} /></span>)}
            </div>
            <span className="truncate text-[11px] font-bold text-navy">{recipients.map((r) => r.label).join(', ')}</span>
          </>
        )}
        {points > 0 && <span className="tnum rounded-full bg-gold px-2 py-0.5 text-[10px] font-extrabold text-[#3d2b00]">+{points} pts</span>}
        {previewValue && <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold ${previewValue.soft} ${previewValue.ink}`}>{previewValue.label}</span>}
      </div>
    </div>
  )
}
