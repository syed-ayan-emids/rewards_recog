import { useState } from 'react'
import { CheckCircle2, UserCheck } from 'lucide-react'
import { Avatar, Btn, Card, Chip, EmptyState } from '../components/atoms'
import { PENDING_APPROVALS, person } from '../data'
import { useStore, fmtNum } from '../store'
import type { ApprovalItem } from '../data'

const TABS = [
  { key: 'inbox', label: 'To approve' },
  { key: 'endorse', label: 'Endorsements' },
  { key: 'done', label: 'Done' },
] as const
type Tab = (typeof TABS)[number]['key']

const kindLabel = (a: ApprovalItem) =>
  a.kind === 'nomination-endorsement' ? 'Nomination endorsement' : a.points ? `Points approval · +${a.points} pts` : 'High-value redemption'

export default function ApprovalsScreen() {
  const { toast } = useStore()
  const [tab, setTab] = useState<Tab>('inbox')
  const [sel, setSel] = useState<string | null>(PENDING_APPROVALS[0]?.id ?? null)
  const [decided, setDecided] = useState<Record<string, 'approved' | 'returned' | 'declined'>>({})

  const live = PENDING_APPROVALS.filter((a) => !decided[a.id])
  const done = PENDING_APPROVALS.filter((a) => decided[a.id] !== undefined)
  const list: ApprovalItem[] =
    tab === 'inbox'
      ? live.filter((a) => a.kind !== 'nomination-endorsement')
      : tab === 'endorse'
        ? live.filter((a) => a.kind === 'nomination-endorsement')
        : done
  const item = list.find((a) => a.id === sel) ?? list[0] ?? null

  const resolve = (a: ApprovalItem, verdict: 'approved' | 'returned' | 'declined') => {
    setDecided((d) => ({ ...d, [a.id]: verdict }))
    setSel(null)
    toast(
      verdict === 'approved' ? `${a.points ? fmtNum(a.points) + ' pts ' : ''}approved — routed to next step` : verdict === 'returned' ? 'Returned with query — sender notified' : 'Noted for next time — policy record updated',
      verdict === 'approved' ? 'mint' : undefined,
    )
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold tracking-tight text-navy md:text-[28px]">Approvals inbox</h1>
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[150px_310px_1fr]">
        {/* Folder rail */}
        <nav className="lg:sticky lg:top-20">
          <div className="rail-scroll flex gap-1.5 overflow-x-auto pb-1 lg:flex-col lg:pb-0">
            {TABS.map((t) => {
              const n = t.key === 'inbox'
                ? live.filter((a) => a.kind !== 'nomination-endorsement').length
                : t.key === 'endorse'
                  ? live.filter((a) => a.kind === 'nomination-endorsement').length
                  : done.length
              const on = tab === t.key
              return (
                <button key={t.key} onClick={() => setTab(t.key)} className={`flex w-full shrink-0 items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-[13px] font-semibold transition ${on ? 'bg-brand text-white' : 'text-muted hover:bg-slate-100 hover:text-ink'}`}>
                  {t.label}
                  {n > 0 && <span className={`tnum rounded-full px-1.5 text-[11px] font-extrabold ${on ? 'bg-white/25 text-white' : 'bg-slate-100 text-ink'}`}>{n}</span>}
                </button>
              )
            })}
          </div>
        </nav>

        {/* Mail list */}
        <div>
          <div className="space-y-2">
            {list.map((a) => (
              <ListItem key={a.id} a={a} on={item?.id === a.id} onSelect={() => setSel(a.id)} />
            ))}
            {list.length === 0 && (
              <EmptyState icon={<CheckCircle2 size={26} />} title={tab === 'done' ? 'No decisions yet' : 'Inbox zero'} sub={tab === 'done' ? 'Your approvals will show up here with full audit trail.' : 'Nothing routed to you right now. The tree syncs every 15 minutes.'} />
            )}
          </div>
        </div>

        {/* Reading pane */}
        <div>
          {item ? (
            <Card className="overflow-hidden" key={item.id}>
              <ApprovalDetail item={item} onResolve={resolve} verdict={decided[item.id]} />
            </Card>
          ) : (
            <EmptyState icon={<UserCheck size={26} />} title="Select an item" sub="Pick something from the list to see the full request." />
          )}
        </div>
      </div>
    </div>
  )
}

export interface ListItemProps {
  a: ApprovalItem
  /** Whether this item is the currently selected one. */
  on: boolean
  onSelect: () => void
}

function ListItem({ a, on, onSelect }: ListItemProps) {
  return (
    <button onClick={onSelect} className={`w-full rounded-2xl border p-3.5 text-left transition ${on ? 'border-brand shadow-lift ring-1 ring-brand/30' : 'border-line bg-white hover:border-brand/40 hover:bg-slate-50/60'}`}>
      <div className="flex items-start gap-3">
        <Avatar id={a.fromId} size={38} />
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-[13px] font-semibold leading-tight text-navy">{a.title}</p>
          <p className="mt-1 truncate text-[12px] text-muted">{person(a.fromId).name} · {a.when}</p>
        </div>
      </div>
    </button>
  )
}

export type ApprovalVerdict = 'approved' | 'returned' | 'declined'

export interface ApprovalDetailProps {
  item: ApprovalItem
  onResolve: (a: ApprovalItem, v: ApprovalVerdict) => void
  /** Present once the item has been resolved by the manager. */
  verdict?: ApprovalVerdict
}

function ApprovalDetail({ item, onResolve, verdict }: ApprovalDetailProps) {
  const [comment, setComment] = useState('')
  return (
    <div>
      <div className="hero-room dotgrid px-6 py-4 text-white">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.08em] text-gold">{kindLabel(item)}</p>
          {verdict && <Chip className={verdict === 'approved' ? 'bg-mint text-white' : 'bg-warn text-navy-deep'}>{verdict === 'approved' ? 'Approved' : 'Next time'}</Chip>}
        </div>
        <div className="mt-2 flex items-center gap-3">
          <Avatar id={item.fromId} size={42} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-extrabold">{person(item.fromId).name}</p>
            <p className="truncate text-[12px] text-white/65">{person(item.fromId).title} · routes up the reporting line automatically</p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-line">
        <section className="px-6 py-4">
          <p className="text-[14px] font-semibold text-navy">{item.title}</p>
          <blockquote className="mt-2 rounded-xl border-l-4 border-slate-300 bg-slate-50 px-4 py-2.5 text-[13px] italic leading-snug text-ink">{item.detail}</blockquote>
        </section>

        <section className="px-6 py-4">
          {!verdict && (
            <>
              <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a note (optional, visible in audit trail)" className="h-10 w-full rounded-xl border border-line bg-slate-50 px-4 text-sm outline-none focus:border-brand/40 focus:bg-white" />
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Btn variant="mint" onClick={() => onResolve(item, 'approved')}>Approve</Btn>
                <Btn variant="danger" onClick={() => onResolve(item, 'declined')}>Next time</Btn>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  )
}
