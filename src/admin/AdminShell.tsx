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
      {/* Floating pill header — same chrome language as the employee shell */}
      <header className="sticky top-2 z-20 mx-2.5 mt-2 rounded-[20px] border border-line bg-white/88 backdrop-blur-md shadow-[0_4px_18px_rgba(10,31,68,0.07)]">
        <div className="mx-auto flex h-16 max-w-[1560px] items-center gap-3 px-5 lg:px-10">
          <img src="/emids-icon.png" alt="emids" className="h-9 w-9 object-contain" />
          <p className="text-[16px] font-extrabold tracking-tight text-navy">EMIDS <span className="hidden font-bold text-muted sm:inline">· Admin console</span></p>
          <span className="hidden shrink-0 items-center rounded-full bg-brand text-white px-2.5 py-1 text-[10.5px] font-extrabold font-mono uppercase tracking-wider sm:inline-flex">{role}</span>
          <Btn size="sm" variant="ghost" onClick={onExit} className="ml-auto !h-8 text-muted hover:!bg-slate-100 hover:text-navy">
            <ArrowLeft size={14} /> Back to app
          </Btn>
        </div>
        <div className="rail-scroll mx-auto flex max-w-[1560px] gap-2 overflow-x-auto px-5 pb-2.5 pt-1 lg:px-10">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => onTab(t.key)}
              className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-3.5 py-2 text-[13px] font-bold transition outline-none focus-visible:bg-brand-soft/50 ${active === t.key ? 'border-brand bg-brand text-white shadow-card' : 'border-line bg-white text-muted hover:text-ink'}`}
            >
              {t.label}
              {t.badge !== undefined && t.badge > 0 && (
                <span className={`tnum flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10.5px] font-extrabold ${active === t.key ? 'bg-white/25 text-white' : 'bg-brand-soft text-brand'}`}>{t.badge}</span>
              )}
            </button>
          ))}
        </div>
      </header>
      <main className="mx-auto max-w-[1560px] px-5 py-5 lg:px-10 lg:py-7">
        <div key={active} className="animate-rise">
          {children}
        </div>
      </main>
    </div>
  )
}
