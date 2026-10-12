import React, { useState } from 'react'
import { ArrowRight, CheckCircle2, Inbox, Reply, ShieldAlert, ShieldCheck, Sparkles, UserCheck, XCircle } from 'lucide-react'
import { Avatar, Btn, Card, Chip, EmptyState, Ring } from '../ui'
import { CORE_VALUES, PENDING_APPROVALS, person } from '../data'
import { useStore, fmtNum } from '../store'
import type { ApprovalItem } from '../data'

const TABS = [
  { key: 'inbox', label: 'To approve' },
  { key: 'endorse', label: 'Endorsements' },
  { key: 'delegated', label: 'Delegated' },
  { key: 'done', label: 'Done' },
] as const
type Tab = (typeof TABS)[number]['key']

export default function ApprovalsScreen() {
  const { toast } = useStore()
  const [tab, setTab] = useState<Tab>('inbox')
  const [sel, setSel] = useState<string | null>(PENDING_APPROVALS[0]?.id ?? null)
  const [doneIds, setDoneIds] = useState<string[]>([])
  const [declined, setDeclined] = useState<Record<string, boolean>>({})

  const live = PENDING_APPROVALS.filter((a) => !doneIds.includes(a.id) && !(tab === 'inbox' && a.kind === 'high-value-redemption' && false))
  const done = [...doneIds.map((id) => PENDING_APPROVALS.find((a) => a.id === id)!).filter(Boolean)]
  const list = tab === 'done' ? done : live.filter((a) => tab === 'inbox' ? true : a.kind === 'nomination-endorsement')
  const item = live.find((a) => a.id === sel) ?? done.find((a) => a.id === sel) ?? list[0] ?? null

  const resolve = (a: ApprovalItem, verdict: 'approved' | 'returned' | 'declined') => {
    setDoneIds((d) => [...d, a.id])
    setSel(null)
    toast(
      verdict === 'approved' ? `${a.points ? fmtNum(a.points) + ' pts ' : ''}approved — routed to next step` : verdict === 'returned' ? 'Returned with query — sender notified' : 'Declined — policy note recorded',
      verdict === 'approved' ? 'mint' : undefined,
    )
  }

  const budget = { total: 5000, left: 945 }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-muted">Company tree sync · routed from HRIS</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-navy md:text-[34px]">Approvals inbox</h1>
        </div>
        <Card className="flex items-center gap-3.5 px-5 py-3.5">
          <Ring pct={((budget.total - budget.left) / budget.total) * 100} size={64} stroke={7} color={budget.left < 1000 ? 'var(--color-warn)' : 'var(--color-brand)'}>
            <span className="tnum text-[12px] font-extrabold text-navy">81%</span>
          </Ring>
          <div>
            <p className="text-[13px] font-extrabold text-navy">Q4 team pool</p>
            <p className="tnum text-[12px] text-muted">{fmtNum(budget.left)} pts left of {fmtNum(budget.total)}</p>
          </div>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
        {/* List */}
        <div>
          <div className="rail-scroll mb-3 flex gap-1.5 overflow-x-auto pb-1">
            {TABS.map((t) => {
              const n = t.key === 'inbox' ? live.filter((a) => a.kind !== 'nomination-endorsement').length : t.key === 'endorse' ? live.filter((a) => a.kind === 'nomination-endorsement').length : t.key === 'done' ? done.length : 0
              const on = tab === t.key
              return (
                <button key={t.key} onClick={() => { setTab(t.key); setSel(t.key === 'done' ? done[0]?.id ?? null : live[0]?.id ?? null) }} className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-bold transition ${on ? 'border-navy bg-navy text-white' : 'border-line bg-white text-muted hover:text-ink'}`}>
                  {t.label}
                  {n > 0 && <span className={`tnum rounded-full px-1.5 text-[11px] font-extrabold ${on ? 'bg-white/20' : 'bg-slate-100 text-ink'}`}>{n}</span>}
                </button>
              )
            })}
          </div>
          <div className="space-y-2.5">
            {list.map((a) => {
              const on = item?.id === a.id
              const isNom = a.kind === 'nomination-endorsement'
              return (
                <button
                  key={a.id}
                  onClick={() => setSel(a.id)}
                  className={`group w-full rounded-2xl border p-4 text-left transition ${on ? 'border-brand bg-white shadow-lift' : 'border-line bg-white hover:border-brand/40'} ${declined[a.id] ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar id={a.fromId} size={38} />
                      <span className={`absolute -bottom-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full border-2 border-white ${isNom ? 'bg-violet text-white' : 'bg-gold text-[#3d2b00]'}`}>
                        <Inbox size={9} />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-[13.5px] font-bold leading-snug text-navy">{a.title}</p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-muted">
                        {person(a.fromId).name} · {a.when}
                      </p>
                    </div>
                    {a.policy.verdict === 'flag' ? (
                      <Chip className="shrink-0 bg-warn-soft text-warn"><ShieldAlert size={11} /> Flag</Chip>
                    ) : (
                      <Chip className="shrink-0 bg-mint-soft text-mint"><ShieldCheck size={11} /> PASS</Chip>
                    )}
                  </div>
                </button>
              )
            })}
            {list.length === 0 && (
              <EmptyState icon={<CheckCircle2 size={26} />} title={tab === 'done' ? 'No decisions yet' : 'Inbox zero'} sub={tab === 'done' ? 'Your approvals will show up here with full audit trail.' : 'Nothing routed to you right now. The tree syncs every 15 minutes.'} />
            )}
          </div>
        </div>

        {/* Detail */}
        <div>
          {item ? (
            <Card className="overflow-hidden" key={item.id}>
              <ApprovalDetail item={item} onResolve={resolve} />
            </Card>
          ) : (
            <EmptyState icon={<UserCheck size={26} />} title="Select an item" sub="Pick something from the inbox to see the policy verdict and routing." />
          )}
        </div>
      </div>
    </div>
  )
}

function ApprovalDetail({ item, onResolve }: { item: ApprovalItem; onResolve: (a: ApprovalItem, v: 'approved' | 'returned' | 'declined') => void }) {
  const [comment, setComment] = useState('')
  const v = item.valueKey ? CORE_VALUES[item.valueKey] : null
  const flag = item.policy.verdict === 'flag'
  return (
    <div>
      <div className="hero-room dotgrid px-6 py-5 text-white">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-gold">
          {item.kind === 'nomination-endorsement' ? 'Nomination endorsement' : item.points ? `Points approval · +${item.points} pts` : 'High-value redemption'}
        </div>
        <div className="mt-3 flex items-center gap-3.5">
          <Avatar id={item.fromId} size={46} />
          <div>
            <p className="text-lg font-extrabold">{person(item.fromId).name}</p>
            <p className="text-[12.5px] text-white/65">{person(item.fromId).title} · routes up the reporting line automatically</p>
          </div>
          {v && <Chip className={`ml-auto ${v.soft} ${v.ink}`}>{v.label}</Chip>}
        </div>
      </div>

      <div className="divide-y divide-line">
        <section className="px-6 py-5">
          <p className="text-[15px] font-bold text-navy">{item.title}</p>
          <p className="mt-2 rounded-xl border-l-4 border-slate-300 bg-slate-50 px-4 py-3 text-[14px] italic leading-relaxed text-ink">{item.detail}</p>
          {item.policy.notes.map((n, i) => (
            <div key={i} className={`mt-2.5 flex items-start gap-2 rounded-lg px-1 text-[13px] ${i === 0 ? '' : ''}`}>
              <Sparkles size={14} className={`mt-0.5 shrink-0 ${flag ? 'text-warn' : 'text-violet'}`} />
              <p className="text-muted">{n}</p>
            </div>
          ))}
        </section>

        <section className="px-6 py-5">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Routing · orchestrated by the workflow agent</p>
          <div className="flex items-center">
            {item.route.map((r, i) => (
              <React.Fragment key={r.step}>
                <div className="flex items-center gap-2">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-extrabold ${r.done ? 'bg-mint text-white' : flag ? 'bg-warn-soft text-warn ring-2 ring-warn/40' : 'bg-slate-100 text-muted'}`}>
                    {r.done ? <CheckCircle2 size={14} /> : i + 1}
                  </span>
                  <div className="max-w-[150px]">
                    <p className="truncate text-[12px] font-bold text-navy">{r.step}</p>
                    <p className="truncate text-[11px] text-muted">{r.owner}</p>
                  </div>
                </div>
                {i < item.route.length - 1 && <div className={`mx-2 h-[2px] flex-1 rounded ${r.done ? 'bg-mint' : 'bg-line'}`} />}
              </React.Fragment>
            ))}
          </div>
          <p className="mt-3 flex items-center gap-2 rounded-xl bg-gold-soft/70 px-3.5 py-2.5 text-[12.5px] font-semibold text-gold-ink">
            <Sparkles size={13} /> {item.budget}
          </p>
        </section>

        <section className="px-6 py-5">
          <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a note (optional, visible in audit trail)" className="h-11 w-full rounded-xl border border-line bg-slate-50 px-4 text-sm outline-none focus:border-brand/40 focus:bg-white" />
          <div className="mt-3.5 flex flex-wrap gap-2">
            <Btn variant="mint" onClick={() => onResolve(item, 'approved')}><CheckCircle2 size={16} /> Approve &amp; forward</Btn>
            <Btn variant="outline" onClick={() => onResolve(item, 'returned')}><Reply size={15} /> Return for info</Btn>
            <Btn variant="danger" onClick={() => onResolve(item, 'declined')}><XCircle size={15} /> Decline</Btn>
            <span className="ml-auto items-center gap-1.5 text-[11.5px] text-muted hidden sm:flex"><ArrowRight size={13} /> Every decision is logged with a reason</span>
          </div>
        </section>
      </div>
    </div>
  )
}
