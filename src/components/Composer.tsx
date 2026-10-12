import React, { useEffect, useMemo, useState } from 'react'
import { Eye, EyeOff, Globe, Lock, PartyPopper, Send, Sparkles, Users, X } from 'lucide-react'
import { Modal, Avatar, Btn, CloseX } from '../ui'
import { CORE_VALUES, VALUE_KEYS, PEOPLE_LIST, PEOPLE } from '../data'
import type { ValueKey } from '../data'
import { useStore } from '../store'

const POINT_PRESETS = [0, 25, 50, 100]

const AI_DRAFTS: Record<ValueKey, string> = {
  customerFirst: 'went above and beyond for the client this week — the turnaround on their urgent request was seamless, and the client team specifically called it out in the QBR thread.',
  innovation: 'found a cleaner way to solve a problem we had all stopped questioning. The new approach cut manual effort substantially and is already being picked up by other pods.',
  collaboration: 'stepped in across team boundaries without hesitation — unblocked two other squads this week and shared the context so it stuck.',
  ownership: 'took the hard ticket nobody wanted and drove it end-to-end: root cause, fix, and a repro test so it never comes back.',
  winningMindset: 'brought real momentum at the most critical moment of the sprint — late nights, calm head, and a shipped result to show for it.',
}

export default function Composer({ open, preset }: { open: boolean; preset?: { toId?: string } }) {
  const { setComposer, sendPraise, toast } = useStore()
  const [toSel, setToSel] = useState<string[]>(preset?.toId ? [preset.toId] : [])
  const [q, setQ] = useState('')
  const [pickerOpen, setPickerOpen] = useState(false)
  const [valueKey, setValueKey] = useState<ValueKey | null>(null)
  const [msg, setMsg] = useState('')
  const [points, setPoints] = useState(0)
  const [visibility, setVisibility] = useState<'public' | 'private'>('public')
  const [aiBusy, setAiBusy] = useState(false)
  const [assisted, setAssisted] = useState(false)

  useEffect(() => {
    if (open) {
      setToSel(preset?.toId ? [preset.toId] : [])
      setQ(''); setValueKey(null); setMsg(''); setPoints(0); setVisibility('public'); setAssisted(false)
      setTimeout(() => document.getElementById('composer-to-input')?.focus(), 60)
    }
  }, [open, preset])

  const pickResults = useMemo(() => {
    if (!q.trim()) return []
    const s = q.toLowerCase()
    return PEOPLE_LIST.filter((p) => p.id !== 'me' && (p.name.toLowerCase().includes(s) || p.title.toLowerCase().includes(s))).slice(0, 6)
  }, [q])

  const spec = useMemo(() => {
    let s = 0
    if (msg.length > 40) s += 30
    if (/\bdeliver|\bship|\bfix|\bclient|\brelease|\bqbr|\bdeadline/i.test(msg)) s += 25
    if (msg.length > 120) s += 20
    if (/\d/.test(msg)) s += 15
    if (valueKey) s += 10
    return Math.min(100, s)
  }, [msg, valueKey])

  const canSend = toSel.length > 0 && valueKey && msg.trim().length > 8

  const aiDraft = () => {
    if (!toSel.length) { toast('Pick at least one person first'); return }
    setAiBusy(true)
    setTimeout(() => {
      const names = toSel.map((id) => PEOPLE[id].name.split(' ')[0]).join(' and ')
      setMsg(`${names} ${AI_DRAFTS[valueKey ?? 'ownership']} Keep it in your own words if you can.`)
      setAssisted(true); setAiBusy(false)
    }, 800)
  }

  const aiPolish = () => {
    if (msg.trim().length < 10) return
    setAiBusy(true)
    setTimeout(() => {
      setMsg((m) => m.trim().replace(/\s+/g, ' ').replace(/\.?$/, '. This made a real difference — thank you for setting the standard.'))
      setAssisted(true); setAiBusy(false)
    }, 650)
  }

  const submit = () => {
    if (!canSend || !valueKey) return
    sendPraise({ toIds: toSel, valueKey, message: msg.trim(), points })
    setComposer({ open: false })
    import('canvas-confetti').then((mod) => {
      mod.default({ particleCount: 90, spread: 70, origin: { y: 0.65 }, colors: ['#FFB224', '#FF5A5F', '#7A5AF8', '#0E9384'], disableForReducedMotion: true })
    })
  }

  const previewValue = valueKey ? CORE_VALUES[valueKey] : null

  return (
    <Modal open={open} onClose={() => setComposer({ open: false })} wide label="New Congrats">
      <div className="flex flex-col overflow-hidden">
        {/* Compact header */}
        <div className="flex items-center gap-3 border-b border-line px-6 py-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy"><PartyPopper size={18} className="text-gold" /></span>
          <div className="min-w-0">
            <p className="text-[17px] font-extrabold tracking-tight text-navy">New Congrats</p>
            <p className="text-[11.5px] text-muted">Recognition in under 30 seconds — no forms, just the specific thing</p>
          </div>
          <CloseX onClick={() => setComposer({ open: false })} />
        </div>

        <div className="rail-scroll grid flex-1 overflow-y-auto lg:grid-cols-[1.55fr_1fr]">
          {/* Left: compose */}
          <div className="px-6 py-5">
            {/* To */}
            <label className="mb-1.5 flex items-center justify-between text-[11.5px] font-extrabold uppercase tracking-[0.12em] text-muted">
              <span>To</span>
              {!toSel.length && <span className="tnum normal-case tracking-normal font-semibold">1st of 3 taps</span>}
            </label>
            <div
              className="flex min-h-12 flex-wrap items-center gap-2 rounded-xl border border-line bg-slate-50 px-3 py-2 transition focus-within:border-brand/40 focus-within:bg-white"
            >
              <Users size={16} className="text-muted" />
              {toSel.map((id) => (
                <span key={id} className="flex items-center gap-1.5 rounded-full bg-white py-0.5 pl-1 pr-1.5 shadow-card border border-line">
                  <Avatar id={id} size={22} />
                  <button onClick={() => setToSel(toSel.filter((x) => x !== id))} className="max-w-[110px] truncate text-[13px] font-semibold text-navy">{PEOPLE[id].name.split(' ')[0]}</button>
                  <button aria-label={`Remove ${PEOPLE[id].name}`} onClick={() => setToSel(toSel.filter((x) => x !== id))} className="text-muted hover:text-coral"><X size={12} /></button>
                </span>
              ))}
              <input
                id="composer-to-input"
                value={q}
                onChange={(e) => { setQ(e.target.value); setPickerOpen(true) }}
                placeholder={toSel.length ? 'Add more…' : 'Type a name — synced from the org tree'}
                className="h-8 min-w-[170px] flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
              />
            </div>
            {pickerOpen && q.trim() && (
              <div className="rail-scroll mt-1.5 max-h-44 overflow-y-auto rounded-xl border border-line bg-white p-1 shadow-card">
                {pickResults.length === 0 && <p className="px-3 py-2 text-[13px] text-muted">No match — anyone at emids is eligible.</p>}
                {pickResults.map((p) => (
                  <button key={p.id} onClick={() => { if (!toSel.includes(p.id)) setToSel([...toSel, p.id]); setQ(''); }} className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition hover:bg-slate-50">
                    <Avatar id={p.id} size={28} />
                    <span className="text-[13px] font-semibold text-navy">{p.name}</span>
                    <span className="text-[12px] text-muted">{p.title}</span>
                    {toSel.includes(p.id) && <span className="ml-auto text-xs font-bold text-mint">Added</span>}
                  </button>
                ))}
              </div>
            )}

            {/* Value */}
            <label className="mb-1.5 mt-5 flex items-center justify-between text-[11.5px] font-extrabold uppercase tracking-[0.12em] text-muted">
              <span>Which emids value did they live?</span>
              <span className="tnum normal-case tracking-normal font-semibold">2nd tap</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {VALUE_KEYS.map((k) => {
                const v = CORE_VALUES[k]
                const on = valueKey === k
                return (
                  <button
                    key={k}
                    onClick={() => setValueKey(k)}
                    className={`rounded-xl border px-3.5 py-2 text-[13px] font-bold transition active:scale-95 ${v.soft} ${v.ink} ${on ? 'border-current' : 'border-transparent opacity-75 hover:opacity-100'}`}
                  >
                    {v.label}
                  </button>
                )
              })}
            </div>

            {/* Message */}
            <label className="mb-1.5 mt-5 flex items-center justify-between text-[11.5px] font-extrabold uppercase tracking-[0.12em] text-muted">
              <span>What exactly did they do?</span>
              <span className="tnum normal-case tracking-normal font-semibold">3rd tap</span>
            </label>
            <div className="rounded-xl border border-line bg-slate-50 transition focus-within:border-brand/40 focus-within:bg-white">
              <textarea
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                rows={4}
                placeholder="Name what they did and what it changed. Specific beats generic — every time."
                className="w-full resize-none bg-transparent px-4 pt-3 text-[14.5px] leading-relaxed outline-none placeholder:text-muted"
              />
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-3 py-2.5">
                <div className="flex gap-1.5">
                  <Btn size="sm" variant="violet" onClick={aiDraft} disabled={aiBusy}>
                    <Sparkles size={14} /> {aiBusy ? 'Thinking…' : 'Draft for me'}
                  </Btn>
                  <Btn size="sm" variant="outline" onClick={aiPolish} disabled={aiBusy || msg.trim().length < 10}>
                    <Sparkles size={14} /> Polish
                  </Btn>
                </div>
                <div className="flex items-center gap-2">
                  {assisted && <span className="flex items-center gap-1 rounded-full bg-violet-soft px-2 py-0.5 text-[10.5px] font-bold text-violet"><Sparkles size={10} /> Assisted — review</span>}
                  <div className="flex items-center gap-1.5">
                    <div className="tnum text-[10.5px] font-bold text-muted">Specificity</div>
                    <div className="h-1.5 w-14 overflow-hidden rounded-full bg-[#E9EEF7]"><div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${spec}%`, background: spec >= 60 ? 'var(--color-mint)' : 'var(--color-gold)' }} /></div>
                    <span className="tnum text-[10.5px] font-extrabold text-muted">{spec}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: preview + points + delivery */}
          <aside className="border-t border-line bg-slate-50/70 px-5 py-5 lg:border-l lg:border-t-0">
            <label className="mb-2 flex items-center gap-1.5 text-[11.5px] font-extrabold uppercase tracking-[0.12em] text-muted"><Eye size={13} /> How it lands in the feed</label>
            <div className="rounded-2xl border border-line bg-white p-3.5 shadow-card">
              <div className="flex items-center gap-2">
                <Avatar id="me" size={30} />
                <div className="min-w-0">
                  <p className="truncate text-[12px] font-bold text-navy">Ayan</p>
                  <p className="text-[10.5px] text-muted">{canSend ? 'will post in a moment' : 'just now · emids feed'}</p>
                </div>
                {points > 0 && <span className="tnum ml-auto rounded-full bg-gold px-2 py-0.5 text-[10.5px] font-extrabold text-[#3d2b00]">+{points} pts</span>}
              </div>
              <p className="mt-2 text-[12.5px] leading-relaxed text-ink line-clamp-4">
                {msg.trim()
                  ? (visibility === 'public' ? msg : msg)
                  : <span className="text-muted italic">Your praise shows up here live as you type…</span>}
              </p>
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5 border-t border-line pt-2.5">
                {toSel.length > 0 ? (
                  <>
                    <div className="flex -space-x-2">
                      {toSel.slice(0, 3).map((id) => <span key={id} className="rounded-full ring-2 ring-white"><Avatar id={id} size={20} /></span>)}
                    </div>
                    <span className="text-[11px] font-bold text-navy">{toSel.map((id) => PEOPLE[id].name.split(' ')[0]).join(', ')}</span>
                  </>
                ) : (
                  <span className="text-[11px] text-muted">pick someone →</span>
                )}
                {previewValue && <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold ${previewValue.soft} ${previewValue.ink}`}>{previewValue.label}</span>}
              </div>
            </div>

            {/* Points */}
            <label className="mb-1.5 mt-5 flex items-center justify-between text-[11.5px] font-extrabold uppercase tracking-[0.12em] text-muted">
              <span>Attach points</span>
              <span className="normal-case tracking-normal font-semibold">optional</span>
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
            <p className="mt-2 flex items-start gap-1.5 text-[11px] leading-snug text-muted">
              {points >= 100
                ? <><Lock size={12} className="mt-0.5 shrink-0" /> 100+ pts needs your manager's approval — budget has 945 pts left</>
                : <><Globe size={12} className="mt-0.5 shrink-0" /> Points come from your team pool and land in their My Rewards balance instantly</>}
            </p>

            {/* Delivery */}
            <label className="mb-1.5 mt-5 block text-[11.5px] font-extrabold uppercase tracking-[0.12em] text-muted">Delivery</label>
            <div className="space-y-1.5">
              {([['public', 'Public feed', 'Everyone sees it. Maximum lift.', <Eye size={15} key="e" />], ['private', 'Quiet note', 'Only them — and their manager if points attached.', <EyeOff size={15} key="o" />]] as const).map(([k, t, sub, ic]) => (
                <button
                  key={k}
                  onClick={() => setVisibility(k as 'public' | 'private')}
                  className={`flex w-full items-start gap-2.5 rounded-xl border px-3.5 py-3 text-left transition ${visibility === k ? 'border-brand bg-brand-soft/60' : 'border-line bg-white hover:border-brand/40'}`}
                >
                  <span className={`mt-0.5 ${visibility === k ? 'text-brand' : 'text-muted'}`}>{ic}</span>
                  <span>
                    <span className="block text-[13px] font-bold text-navy">{t}</span>
                    <span className="block text-[11.5px] text-muted">{sub}</span>
                  </span>
                  <span className={`ml-auto mt-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 transition ${visibility === k ? 'border-brand bg-brand' : 'border-line'}`}>
                    {visibility === k && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-2.5 text-[11px] text-muted">Also delivered to Teams &amp; Slack · managed in Settings</p>
          </aside>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-line px-6 py-4">
          <p className="tnum text-[12px] text-muted">≈ {7 + Math.floor(msg.length / 90)} seconds · {visibility === 'public' ? 'public post' : 'quiet note'}{points > 0 ? ` · ${points} pts from team pool` : ''}</p>
          <div className="flex gap-2">
            <Btn variant="ghost" onClick={() => setComposer({ open: false })}>Cancel</Btn>
            <Btn variant="primary" onClick={submit} disabled={!canSend} className="px-5">
              <Send size={15} /> Post it
            </Btn>
          </div>
        </div>
      </div>
    </Modal>
  )
}
