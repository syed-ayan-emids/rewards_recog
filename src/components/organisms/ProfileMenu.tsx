import { useEffect, useRef } from 'react'
import { Avatar } from '../atoms'
import { useStore, type Screen } from '../../store'

export interface ProfileMenuProps {
  /** Called when the menu should close (item picked, Escape, or click outside). */
  close: () => void
}

export default function ProfileMenu({ close }: ProfileMenuProps) {
  const { setScreen, toast } = useStore()
  const menuRef = useRef<HTMLDivElement>(null)
  const go = (s: Screen) => { setScreen(s); close() }

  // focus the first item so keyboard users land inside the menu
  useEffect(() => {
    const first = menuRef.current?.querySelector<HTMLButtonElement>('button')
    first?.focus()
  }, [])

  // Arrow Up/Down move between items, Escape closes and hands focus back
  const onKey = (e: React.KeyboardEvent) => {
    const items = [...menuRef.current?.querySelectorAll<HTMLButtonElement>('button') ?? []]
    if (e.key === 'Escape') { e.preventDefault(); close(); (document.activeElement as HTMLElement)?.blur(); document.querySelector<HTMLButtonElement>('[aria-label="Profile menu"]')?.focus(); return }
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    e.preventDefault()
    const idx = items.indexOf(document.activeElement as HTMLButtonElement)
    const next = e.key === 'ArrowDown' ? (idx + 1) % items.length : (idx - 1 + items.length) % items.length
    items[next]?.focus()
  }

  return (
    <div ref={menuRef} role="menu" onKeyDown={onKey} className="absolute right-0 top-12 z-40 w-60 animate-rise overflow-hidden rounded-2xl border border-line bg-white p-1.5 shadow-lift">
      <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
        <Avatar id="me" size={40} />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-navy">Ayan</p>
          <p className="truncate text-xs text-muted">Senior Eng Manager</p>
        </div>
      </div>
      <div className="my-1 h-px bg-line" />
      {[
        { l: 'My profile', fn: () => go('profile') },
        { l: 'Log out', fn: () => { toast('You are logged out'); close() } },
      ].map((i) => (
        <button key={i.l} role="menuitem" onClick={i.fn} className="block w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-ink transition hover:bg-slate-50">{i.l}</button>
      ))}
    </div>
  )
}
