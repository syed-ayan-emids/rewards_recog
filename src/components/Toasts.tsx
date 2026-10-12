import { CheckCircle2 } from 'lucide-react'
import { useStore } from '../store'

export default function Toasts() {
  const { toasts } = useStore()
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex flex-col items-center gap-2 lg:bottom-8" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-center gap-2.5 rounded-full bg-navy px-4 py-2.5 text-sm font-semibold text-white shadow-lift animate-rise"
        >
          <CheckCircle2 size={16} className={t.kind === 'gold' ? 'text-gold' : 'text-mint'} />
          {t.msg}
        </div>
      ))}
    </div>
  )
}
