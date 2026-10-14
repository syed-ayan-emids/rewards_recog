import React, { useState } from 'react'
import { Bell, Check, CalendarCheck, Trophy, MessageSquare, Cake } from 'lucide-react'
import { useOutside } from '../atoms'
import { useStore } from '../../store'

const GROUP_META: Record<string, { icon: React.ReactNode; label: string; bg: string; fg: string }> = {
  praise: { icon: <MessageSquare size={15} />, label: 'New praises', bg: 'bg-gold-soft', fg: 'text-gold-ink' },
  approval: { icon: <CalendarCheck size={15} />, label: 'Approvals waiting', bg: 'bg-brand-soft', fg: 'text-brand' },
  window: { icon: <Trophy size={15} />, label: 'EoQ windows', bg: 'bg-violet-soft', fg: 'text-violet' },
  milestone: { icon: <Cake size={15} />, label: 'Milestones', bg: 'bg-coral-soft', fg: 'text-coral' },
}

export default function NotifBell() {
  const [open, setOpen] = useState(false)
  const ref = useOutside<HTMLDivElement>(() => setOpen(false))
  const { notifications, markAllRead, setScreen } = useStore()
  const unread = notifications.filter((n) => n.unread).length
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} aria-label={`Notifications, ${unread} unread`} className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-white text-muted transition hover:text-ink hover:border-brand/30">
        <Bell size={18} />
        {unread > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-coral px-1 text-[10px] font-bold text-white">{unread}</span>}
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-40 w-[380px] max-w-[92vw] animate-rise overflow-hidden rounded-2xl border border-line bg-white shadow-lift">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="font-bold text-navy">Notifications</p>
            <button onClick={markAllRead} className="flex items-center gap-1 text-xs font-semibold text-brand hover:underline"><Check size={13} /> Mark all read</button>
          </div>
          <div className="rail-scroll max-h-[380px] overflow-y-auto p-2">
            {(['approval', 'praise', 'window', 'milestone'] as const).map((g) => {
              const items = notifications.filter((n) => n.group === g)
              if (!items.length) return null
              const m = GROUP_META[g]
              return (
                <div key={g} className="mb-1">
                  <div className={`flex items-center gap-2 px-2.5 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wide ${m.fg}`}>
                    {m.icon} {m.label}
                  </div>
                  {items.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => { setOpen(false); if (n.group === 'approval') setScreen('team', 'approvals'); else setScreen(n.go ?? 'home') }}
                      className="flex w-full items-start gap-3 rounded-xl px-2.5 py-2 text-left transition hover:bg-slate-50"
                    >
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ background: n.unread ? 'var(--color-brand)' : 'transparent' }} />
                      <span className="min-w-0">
                        <span className="block truncate text-[13px] font-semibold text-ink">{n.title}</span>
                        <span className="block truncate text-xs text-muted">{n.sub} · {n.when}</span>
                      </span>
                    </button>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
