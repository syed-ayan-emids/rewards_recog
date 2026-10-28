import Hero from '@/components/organisms/Hero'
import { StatCards } from '@/components/organisms/StatCards'
import EoQShowcase from '@/components/organisms/EoQShowcase'
import Leaderboard from '@/components/organisms/Leaderboard'
import { getMe, getDashboardStats, getLeaderboard, getShowcaseSlides } from '@/lib/data-api'

// Fresh on every load while data is mock — later this becomes revalidate-based.
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const [me, stats, leaderboard, slides] = await Promise.all([
    getMe(),
    getDashboardStats(),
    getLeaderboard(),
    getShowcaseSlides(),
  ])

  return (
    <div>
      <Hero name={me.name} />

      <div className="mb-3 flex items-end justify-between gap-4 -mx-2.5 lg:-mx-[30px]">
        <p className="text-[11px] font-extrabold font-mono uppercase tracking-[0.2em] text-brand">My activity</p>
        <p className="text-[11px] font-extrabold font-mono uppercase tracking-[0.2em] text-brand">Team highlights</p>
      </div>

      <StatCards balance={stats.balance} given={stats.given} got={stats.got} orgRecognitions={stats.orgRecognitions} />

      <div className="grid grid-cols-1 md:grid-cols-2 items-stretch gap-4 -mx-2.5 lg:-mx-[30px]">
        <div className="flex flex-col">
          <div className="flex flex-1 flex-col [&>*]:flex [&>*]:h-full [&>*]:min-h-0">
            <EoQShowcase slides={slides} />
          </div>
        </div>
        <div className="flex flex-col">
          <p className="mb-3 text-[11px] font-extrabold font-mono uppercase tracking-[0.2em] text-brand">Top performers</p>
          <Leaderboard rows={leaderboard} />
        </div>
      </div>
    </div>
  )
}
