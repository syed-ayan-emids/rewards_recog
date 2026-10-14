import { useEffect, useMemo, useRef, useState } from 'react'

export function useOutside<T extends HTMLElement>(onOut: () => void) {
  const ref = useRef<T>(null)
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onOut() }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [onOut])
  return ref
}

export function useHover<T extends HTMLElement>() {
  const [hover, setHover] = useState(false)
  const props = useMemo(() => ({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
  }), [])
  return { hover, props }
}
