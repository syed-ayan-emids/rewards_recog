import React from 'react'
import { Avatar } from '../atoms'

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
