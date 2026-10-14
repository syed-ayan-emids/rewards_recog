import { Avatar } from '../atoms'

/** Row of overlapping avatars with a "+N" overflow badge. */
export interface AvatarStackProps {
  ids: string[]
  /** How many avatars to show before collapsing into "+N". */
  max?: number
  size?: number
}

export function AvatarStack({ ids, max = 4, size = 30 }: AvatarStackProps) {
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
