import React, { useEffect, useMemo, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import { X } from 'lucide-react'
import { person, initials } from './data'

export function confettiBurst(x = 0.5, y = 0.4) {
  confetti({
    particleCount: 130,
    spread: 75,
    origin: { x, y },
    colors: ['#FFB224', '#FF5A5F', '#7A5AF8', '#2563EB', '#17B26A', '#FFFFFF'],
    disableForReducedMotion: true,
  })
}
export default confettiBurst

/* ---------------------------------- Avatar ---------------------------------- */

const GRADIENTS = [
  'from-[#2563eb] to-[#4facfe]',
  'from-[#7a5af8] to-[#b58cff]',
  'from-[#0fa3a3] to-[#38d9d9]',
  'from-[#ff8938] to-[#ffb224]',
  'from-[#ff5a5f] to-[#ff9a8b]',
  'from-[#0ea5e9] to-[#6ee7b7]',
  'from-[#154071] to-[#5a6a83]',
  'from-[#ec4899] to-[#f97316]',
]

function hashStr(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

export function Avatar({ id, size = 36, ring = false }: { id: string; size?: number; ring?: boolean }) {
  const p = person(id)
  const g = GRADIENTS[hashStr(p.name) % GRADIENTS.length]
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div
        className={`flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br font-semibold text-white select-none ${g}`}
        style={{ fontSize: size * 0.38 }}
      >
        {initials(p.name)}
      </div>
      {p.status === 'online' && size >= 32 && (
        <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-mint" aria-label="online" />
      )}
      {ring && <span className="absolute inset-0 rounded-full ring-2 ring-gold/60" />}
    </div>
  )
}

export function AvatarStack({ ids, max = 4, size = 30 }: { ids: string[]; max?: number; size?: number }) {
  const shown = ids.slice(0, max)
  const rest = ids.length - shown.length
  return (
    <div className="flex -space-x-2.5">
      {shown.map((id) => (
        <div key={id} className="rounded-full ring-2 ring-white">
          <Avatar id={id} size={size} />
        </div>
      ))}
      {rest > 0 && (
        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white text-[11px] font-bold text-violet ring-2 ring-white">
          +{rest}
        </div>
      )}
    </div>
  )
}

/* ---------------------------------- Buttons ---------------------------------- */

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'gold' | 'ghost' | 'outline' | 'mint' | 'violet' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
}

export function Btn({ variant = 'primary', size = 'md', icon, className = '', children, ...rest }: BtnProps) {
  const v = {
    primary: 'bg-brand text-white hover:bg-brand-deep shadow-[0_1px_2px_rgba(10,31,68,.18)]',
    gold: 'bg-gold text-[#3d2b00] hover:brightness-105 shadow-fab',
    mint: 'bg-mint text-white hover:brightness-105',
    violet: 'bg-violet text-white hover:brightness-105',
    danger: 'bg-white text-coral border border-coral/40 hover:bg-coral-soft',
    ghost: 'bg-transparent text-ink hover:bg-slate-100',
    outline: 'bg-white text-ink border border-line hover:border-brand/50 hover:bg-slate-50',
  }[variant]
  const s = { sm: 'h-8 px-3 text-[13px] gap-1.5', md: 'h-10 px-4 text-sm gap-2', lg: 'h-12 px-6 text-[15px] gap-2' }[size]
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-150 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 ${v} ${s} ${className}`}
      {...rest}
    >
      {icon}
      {children}
    </button>
  )
}

export function IconBtn({ children, className = '', ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-slate-100 hover:text-ink ${className}`}
      {...rest}
    />
  )
}

/* ---------------------------------- Surfaces ---------------------------------- */

export function Card({ className = '', children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`rounded-2xl border border-line bg-white shadow-card ${className}`} {...rest}>
      {children}
    </div>
  )
}

export function Chip({ children, className = '', ...rest }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${className}`} {...rest}>
      {children}
    </span>
  )
}

export function Delta({ n, className = '' }: { n: number; className?: string }) {
  const up = n >= 0
  return (
    <span className={`tnum text-xs font-bold ${up ? 'text-mint' : 'text-coral'} ${className}`}>
      {up ? '↑' : '↓'} {Math.abs(n)}
    </span>
  )
}

/* ---------------------------------- Progress ---------------------------------- */

export function Ring({ pct, size = 92, stroke = 9, color = 'var(--color-brand)', track = '#E9EEF7', children }: { pct: number; size?: number; stroke?: number; color?: string; track?: string; children?: React.ReactNode }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={c * (1 - Math.min(1, pct / 100))} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 900ms cubic-bezier(.22,1,.36,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  )
}

export function Sparkline({ data, w = 150, h = 40, stroke = 'var(--color-gold)', fill = 'var(--color-gold)', className = '' }: { data: number[]; w?: number; h?: number; stroke?: string; fill?: string; className?: string }) {
  const max = Math.max(...data, 1)
  const min = Math.min(...data, 0)
  const pts = data.map((d, i) => `${(i / (data.length - 1)) * (w - 6) + 3},${h - 4 - ((d - min) / (max - min || 1)) * (h - 10)}`).join(' ')
  return (
    <svg width={w} height={h} className={`overflow-visible ${className}`}>
      <polygon points={`3,${h - 2} ${pts} ${w - 3},${h - 2}`} fill={fill} opacity="0.13" />
      <polyline points={pts} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={w - 3} cy={h - 4 - ((data[data.length - 1] - min) / (max - min || 1)) * (h - 10)} r="2.6" fill={stroke} stroke="#fff" strokeWidth="1.3" />
    </svg>
  )
}

export function AreaChart({ data, labels, height = 150, color = 'var(--color-brand)', unit = 'pts' }: { data: number[]; labels: string[]; height?: number; color?: string; unit?: string }) {
  const [hover, setHover] = useState<number | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const max = Math.max(...data) * 1.08
  const px = (i: number) => ((i / (data.length - 1)) * 94 + 3)
  const py = (v: number) => 92 - 10 - ((v - Math.min(...data, 0)) / (max || 1)) * (82 - 10)
  const pts = data.map((v, i) => `${px(i).toFixed(2)},${py(v).toFixed(2)}`)
  let path = `M ${pts[0]}`
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1].split(',').map(Number)
    const [x1, y1] = pts[i].split(',').map(Number)
    const cx = (x0 + x1) / 2
    path += ` C ${cx.toFixed(2)},${y0} ${cx.toFixed(2)},${y1} ${x1},${y1}`
  }
  const area = `${path} L ${px(data.length - 1).toFixed(2)},92 L ${px(0).toFixed(2)},92 Z`
  const bestIdx = data.indexOf(Math.max(...data))

  const onMove = (e: React.PointerEvent) => {
    const rect = wrapRef.current?.getBoundingClientRect()
    if (!rect) return
    const ratio = ((e.clientX - rect.left) / rect.width) * 100
    const idx = Math.max(0, Math.min(data.length - 1, Math.round(((ratio - 3) / 94) * (data.length - 1))))
    setHover(idx)
  }

  return (
    <div className="w-full">
      <div ref={wrapRef} className="relative" style={{ height }} onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
        <svg viewBox="0 0 100 96" preserveAspectRatio="none" className="h-full w-full cursor-crosshair" aria-hidden>
          <defs>
            <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.22" />
              <stop offset="100%" stopColor={color} stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {[28, 52, 76].map((y) => <line key={y} x1="3" x2="97" y1={y} y2={y} stroke="#E9EEF7" strokeWidth="0.5" />)}
          <path d={area} fill="url(#areaFill)" />
          <path d={path} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          {hover !== null && <line x1={px(hover)} x2={px(hover)} y1="6" y2="92" stroke={color} strokeWidth="0.4" strokeDasharray="2 2" opacity="0.5" />}
          {hover !== null && <circle cx={px(hover)} cy={py(data[hover])} r="1.4" fill="#fff" stroke={color} strokeWidth="0.8" />}
          <circle cx={px(bestIdx)} cy={py(data[bestIdx])} r="2.4" fill="none" stroke="var(--color-gold)" strokeWidth="0.8" />
          <circle cx={px(data.length - 1)} cy={py(data[data.length - 1])} r="1.6" fill="var(--color-gold)" stroke="#fff" strokeWidth="0.6" />
        </svg>
        {hover !== null && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-xl bg-navy px-3 py-1.5 text-[11px] font-bold text-white shadow-lift"
            style={{ left: `${px(hover)}%`, top: `${Math.max(4, (py(data[hover]) / 96) * 100 - 14)}%` }}
          >
            <span className="tnum">{fmtNumPts(data[hover])}</span> {unit} · <span className="font-semibold opacity-70">{labels[hover]}</span>
          </div>
        )}
      </div>
      <div className="mt-1.5 flex justify-between px-0.5">
        {labels.map((l, i) => (
          <button
            key={l + i}
            onClick={() => setHover(i)}
            className={`text-[10.5px] font-bold transition ${hover === i || (hover === null && i === labels.length - 1) ? 'text-navy' : 'text-muted hover:text-ink'}`}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  )
}

function fmtNumPts(n: number) { return n.toLocaleString('en-IN') }

export function Bar({ pct, color = 'bg-brand', className = '' }: { pct: number; color?: string; className?: string }) {
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-[#E9EEF7] ${className}`}>
      <div className={`h-full rounded-full ${color} transition-[width] duration-700`} style={{ width: `${Math.min(100, pct)}%` }} />
    </div>
  )
}

/* ---------------------------------- Modal ---------------------------------- */

export function Modal({ open, onClose, children, wide = false, label = 'Dialog' }: { open: boolean; onClose: () => void; children: React.ReactNode; wide?: boolean; label?: string }) {
  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={label}>
      <div className="absolute inset-0 bg-navy-deep/50 backdrop-blur-[3px]" onClick={onClose} />
      <div className={`relative m-auto w-full ${wide ? 'max-w-3xl' : 'max-w-lg'} animate-rise overflow-hidden rounded-t-3xl sm:rounded-3xl bg-white shadow-lift max-h-[92vh] flex flex-col`}>
        {children}
      </div>
    </div>
  )
}

/* ---------------------------------- Others ---------------------------------- */

export function SectionTitle({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <h2 className="text-xl font-extrabold tracking-tight text-navy">{children}</h2>
      {right}
    </div>
  )
}

export function EmptyState({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line bg-white px-6 py-14 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-soft text-gold-ink">{icon}</div>
      <div>
        <p className="font-bold text-navy">{title}</p>
        <p className="mt-1 text-sm text-muted">{sub}</p>
      </div>
    </div>
  )
}

export function Segmented<T extends string>({ options, value, onChange }: { options: { key: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="inline-flex rounded-xl border border-line bg-slate-50 p-1">
      {options.map((o) => (
        <button
          key={o.key}
          onClick={() => onChange(o.key)}
          className={`rounded-lg px-3.5 py-1.5 text-[13px] font-semibold transition ${
            value === o.key ? 'bg-white text-navy shadow-card' : 'text-muted hover:text-ink'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function useOutside<T extends HTMLElement>(onOut: () => void) {
  const ref = useRef<T>(null)
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onOut() }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [onOut])
  return ref
}

export function CloseX({ onClick, className = '' }: { onClick: () => void; className?: string }) {
  return (
    <button onClick={onClick} aria-label="Close" className={`absolute right-4 top-4 rounded-full p-1.5 text-muted transition hover:bg-slate-100 hover:text-ink ${className}`}>
      <X size={18} />
    </button>
  )
}

export function useHover<T extends HTMLElement>() {
  const [hover, setHover] = useState(false)
  const props = useMemo(() => ({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
  }), [])
  return { hover, props }
}
