import { Avatar } from '../atoms'
import { useStore, type Screen } from '../../store'

export interface ProfileMenuProps {
  /** Called when the menu should close (item picked or click outside). */
  close: () => void
}

export default function ProfileMenu({ close }: ProfileMenuProps) {
  const { setScreen, toast } = useStore()
  const go = (s: Screen) => { setScreen(s); close() }
  return (
    <div className="absolute right-0 top-12 z-40 w-60 animate-rise overflow-hidden rounded-2xl border border-line bg-white p-1.5 shadow-lift">
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
        <button key={i.l} onClick={i.fn} className="block w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-ink transition hover:bg-slate-50">{i.l}</button>
      ))}
    </div>
  )
}
