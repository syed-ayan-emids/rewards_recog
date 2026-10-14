import { X } from 'lucide-react'

export function CloseX({ onClick, className = '' }: { onClick: () => void; className?: string }) {
  return (
    <button onClick={onClick} aria-label="Close" className={`absolute right-4 top-4 rounded-full p-1.5 text-muted transition hover:bg-slate-100 hover:text-ink ${className}`}>
      <X size={18} />
    </button>
  )
}
