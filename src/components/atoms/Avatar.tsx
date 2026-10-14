import { person, initials } from '../../data'

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
