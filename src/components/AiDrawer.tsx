import React, { useEffect, useRef, useState } from 'react'
import { ArrowUp, Sparkles, X } from 'lucide-react'
import { Btn, useOutside, confettiBurst } from '../ui'
import { AI_PROMPTS, PEOPLE, TEAM_STATS } from '../data'
import { useStore } from '../store'

type Msg = { id: number; who: 'ai' | 'me'; text: React.ReactNode; actions?: { label: string; fn: () => void }[] }

export default function AiDrawer() {
  const { openAi, setAi, setComposer, setScreen, toast } = useStore()
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const idRef = useRef(0)
  const listRef = useRef<HTMLDivElement>(null)
  const ref = useOutside<HTMLDivElement>(() => setAi(false))

  const nid = () => ++idRef.current

  const push = (m: Msg) => setMsgs((ms) => [...ms, m])

  const ask = (prompt: string) => {
    if (!prompt.trim() || typing) return
    push({ id: nid(), who: 'me', text: prompt })
    setInput(''); setTyping(true)
    setTimeout(() => {
      setTyping(false)
      answer(prompt.toLowerCase())
    }, 850)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }

  const answer = (lower: string) => {
    if (lower.includes('nomination') && lower.includes('daniel')) {
      push({
        id: nid(), who: 'ai',
        text: (
          <>
            <p>Here's a draft for the Innovator category — grounded in his Q3 impact:</p>
            <p className="mt-2 rounded-xl bg-violet-soft/60 border-l-4 border-violet px-3 py-2.5 text-[13.5px]">
              "Daniel rebuilt the release-validation pipeline into an LLQ eval harness, cutting validation from 4 hours to 40 minutes. Adoption spread to two other pods without being asked — replication is the real signal."
            </p>
            <p className="mt-2 text-xs text-muted">Assisted — review before submitting. Evidence checklist: metrics ✓ · named systems ✓ · outcome ✓</p>
          </>
        ),
        actions: [
          { label: 'Nominate Daniel', fn: () => { setScreen('awards'); setAi(false) } },
        ],
      })
    } else if (lower.includes('recogn') || lower.includes('hasn') || lower.includes('team')) {
      const weak = TEAM_STATS.filter((t) => t.received <= 4 || t.lastRecognized.includes('days')).map((t) => `${PEOPLE[t.id].name} — ${t.received} received`)
      push({
        id: nid(), who: 'ai',
        text: (
          <>
            <p>Recognition health for your 8 direct reports this quarter:</p>
            <p className="mt-2 rounded-xl border-l-4 border-coral bg-coral-soft/50 px-3 py-2.5 text-[13.5px] font-medium">
              Falling through the cracks: {weak.join(' · ')}. Sanjay and Rohan haven't been recognized in 2+ weeks.
            </p>
            <p className="mt-2 text-xs text-muted">Manager tip: teams with 100% monthly recognition coverage show 2.3× higher retention intent.</p>
          </>
        ),
        actions: [
          { label: 'Open team dashboard', fn: () => { setScreen('team'); setAi(false) } },
          { label: 'Praise Sanjay', fn: () => { setComposer({ open: true, preset: { toId: 'p9' } }); setAi(false); confettiBurst(0.5, 0.6) } },
        ],
      })
    } else if (lower.includes('policy') || lower.includes('250')) {
      push({
        id: nid(), who: 'ai',
        text: (
          <>
            <p className="rounded-xl border-l-4 border-warn bg-warn-soft/60 px-3 py-2.5 text-[13.5px]">Policy check — +250 pts:</p>
            <ul className="mt-2 list-disc pl-5 text-[13.5px] text-ink">
              <li>Single-gift cap for IC givers is 100 pts — route approval to finance beyond that</li>
              <li>Award specifics must include a named outcome (write-up specificity ≥ 60)</li>
              <li>Team pool usage stays under guardrail at 81%</li>
            </ul>
            <p className="mt-2 text-xs text-muted">Assisted — routing suggestion prepared.</p>
          </>
        ),
        actions: [{ label: 'Review in approvals', fn: () => { setScreen('approvals'); setAi(false) } }],
      })
    } else if (lower.includes('summar') || lower.includes('health')) {
      push({
        id: nid(), who: 'ai',
        text: (
          <>
            <p><b className="text-navy">Month at a glance:</b></p>
            <ul className="mt-1.5 list-disc pl-5 text-[13.5px]">
              <li>47 recognitions exchanged inside your pod (↑ 22% vs last month)</li>
              <li>86% of teammates received at least one recognition</li>
              <li>Top value: Customer First — 38% of all kudos</li>
              <li>Budget pool 81% consumed; pace is ahead of last quarter</li>
            </ul>
            <p className="mt-2 text-xs text-muted">Assisted digest — refreshed 4 min ago.</p>
          </>
        ),
        actions: [{ label: 'Send to my inbox', fn: () => { toast('Digest sent to your email'); setAi(false) } }],
      })
    } else {
      push({
        id: nid(), who: 'ai',
        text: 'I can draft nominations, write praise in someone\'s voice, run policy checks before you approve, or summarize recognition health. Try one of the suggestions below.',
      })
    }
  }

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [msgs, typing])

  return (
    <>
      {openAi && <div className="fixed inset-0 z-40 bg-navy-deep/40 backdrop-blur-[2px] lg:hidden" onClick={() => setAi(false)} />}
      <aside
        ref={ref}
        aria-label="AI assistant"
        className={`fixed z-50 flex flex-col overflow-hidden border-l border-line bg-white shadow-lift transition-transform duration-300 ${
          openAi ? 'translate-x-0' : 'translate-x-full hidden'
        } right-0 top-0 h-dvh w-full max-w-[400px]`}
      >
        <div className="hero-room dotgrid flex items-center gap-3 px-5 py-4 text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15"><Sparkles size={19} className="text-gold" /></span>
          <div className="min-w-0">
            <p className="text-[15px] font-extrabold">emids AI</p>
            <p className="text-[11.5px] text-white/70">Validates · drafts · routes approvals</p>
          </div>
          <button onClick={() => setAi(false)} aria-label="Close AI assistant" className="ml-auto rounded-full p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"><X size={18} /></button>
        </div>

        <div ref={listRef} className="rail-scroll flex-1 overflow-y-auto px-4 py-4">
          {msgs.length === 0 && (
            <div className="rounded-2xl border border-dashed border-violet/30 bg-violet-soft/40 p-4">
              <p className="text-sm font-bold text-violet-ink">Your workflow agent is in the panel</p>
              <p className="mt-1 text-[13px] text-muted">Drafts write-ups, policy-checks gift amounts, prepares jury briefs, and nudges you when someone on your team is fading from view. Everything it writes stays editable.</p>
            </div>
          )}
          <div className="space-y-4">
            {msgs.map((m) => (
              <div key={m.id} className={m.who === 'me' ? 'flex justify-end' : ''}>
                {m.who === 'me' ? (
                  <p className="max-w-[85%] rounded-2xl rounded-br-md bg-brand px-3.5 py-2.5 text-[13.5px] font-medium text-white">{m.text}</p>
                ) : (
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-soft text-violet"><Sparkles size={14} /></span>
                    <div className="min-w-0 flex-1 rounded-2xl rounded-tl-md bg-slate-50 px-3.5 py-3 text-[13.5px] leading-relaxed text-ink">
                      {m.text}
                      {m.actions && (
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {m.actions.map((a) => (
                            <Btn key={a.label} size="sm" variant={a.label.startsWith('Praise') ? 'gold' : 'outline'} onClick={a.fn}>{a.label}</Btn>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-soft text-violet"><Sparkles size={14} className="animate-pulse" /></span>
                <span className="flex gap-1 rounded-2xl rounded-tl-md bg-slate-50 px-4 py-3">
                  {[0, 1, 2].map((i) => <span key={i} className="h-1.5 w-1.5 rounded-full bg-violet" style={{ animation: `pulseDot 1s ${i * 0.15}s infinite` }} />)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-line px-4 pb-4 pt-3">
          <div className="rail-scroll mb-2 flex gap-1.5 overflow-x-auto pb-1">
            {AI_PROMPTS.map((p) => (
              <button key={p} onClick={() => ask(p)} className="shrink-0 rounded-full border border-violet/30 bg-violet-soft px-3 py-1.5 text-[12px] font-semibold text-violet-ink transition hover:brightness-95">
                {p}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); ask(input) }}
            className="flex items-center gap-2 rounded-2xl border border-line bg-slate-50 p-1.5 pl-4 focus-within:border-violet/40 focus-within:bg-white"
          >
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask the agent…" aria-label="Message the AI assistant" className="h-9 flex-1 bg-transparent text-sm outline-none placeholder:text-muted" />
            <Btn type="submit" variant="violet" className="!h-9 !w-9 !px-0" aria-label="Send">
              <ArrowUp size={16} />
            </Btn>
          </form>
        </div>
      </aside>
    </>
  )
}
