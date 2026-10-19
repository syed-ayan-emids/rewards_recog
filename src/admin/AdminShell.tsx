import type { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Btn } from '../components/atoms'

export interface AdminShellProps {
  /** Console persona shown in the header, e.g. "Program admin". */
  role: string
  tabs: { key: string; label: string; badge?: number }[]
  active: string
  onTab: (key: string) => void
  onExit: () => void
  children: ReactNode
}

/** Chrome template for the two admin consoles — same emids theme, own portal feel. */
export default function AdminShell({ role, tabs, active, onTab, onExit, children }: AdminShellProps) {
  return (
    <div className="min-h-dvh bg-page-art">
      <header className="sticky top-0 z-20 bg-navy text-white shadow-[0_8px_24px_rgba(3,13,28,0.35)]">
        <div className="mx-auto flex h-14 max-w-[1200px] items-center gap-3 px-5">
          <img src="/emids-icon.png" alt="emids" className="h-8 w-8 rounded-md bg-white/95 object-contain p-0.5" />
          <p className="text-[14px] font-extrabold tracking-tight">emids · Admin console</p>
          <span className="hidden rounded-full bg-gold px-2.5 py-0.5 text-[10.5px] font-extrabold uppercase tracking-wider text-[#3d2b00] sm:inline-flex">{role}</span>
          <Btn size="sm" variant="ghost" onClick={onExit} className="!text-white/85 hover:!bg-white/10 ml-auto !h-8">
            <ArrowLeft size={14} /> Back to app
          </Btn>
        </div>
        <div className="mx-auto flex max-w-[1200px] gap-1.5 overflow-x-auto px-5 pb-0 pt-1.5">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => onTab(t.key)}
              className={`relative flex shrink-0 items-center gap-1.5 rounded-t-lg px-3.5 py-2 text-[12.5px] font-bold transition ${active === t.key ? 'bg-page-art text-brand' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
            >
              {t.label}
              {t.badge !== undefined && (
                <span className={`tnum rounded-full px-1.5 py-0.5 text-[10px] font-extrabold ${active === t.key ? 'bg-brand-soft text-brand' : 'bg-white/15 text-white/75'}`}>{t.badge}</span>
              )}
            </button>
          ))}
        </div>
      </header>
      <main className="mx-auto max-w-[1200px] px-5 py-7">
        <div key={active} className="animate-rise">
          {children}
        </div>
      </main>
    </div>
  )
}
