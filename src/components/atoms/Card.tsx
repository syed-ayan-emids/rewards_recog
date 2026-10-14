import React from 'react'

export function Card({ className = '', children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`rounded-2xl border border-line bg-white shadow-card ${className}`} {...rest}>
      {children}
    </div>
  )
}
