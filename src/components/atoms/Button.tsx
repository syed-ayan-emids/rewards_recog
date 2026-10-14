import React from 'react'

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
