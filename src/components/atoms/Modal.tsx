import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'

export function Modal({ open, onClose, children, wide = false, label = 'Dialog' }: { open: boolean; onClose: () => void; children: React.ReactNode; wide?: boolean; label?: string }) {
  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [open, onClose])
  if (!open) return null
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6" role="dialog" aria-modal="true" aria-label={label}>
      <div className="absolute inset-0 bg-navy-deep/50 backdrop-blur-[3px]" onClick={onClose} />
      <div className={`relative m-auto w-full ${wide ? 'max-w-3xl' : 'max-w-lg'} animate-rise overflow-hidden rounded-t-3xl sm:rounded-3xl bg-white shadow-lift max-h-[92vh] flex flex-col`}>
        {children}
      </div>
    </div>,
    document.body,
  )
}
