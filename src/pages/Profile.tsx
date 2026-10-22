import { useState } from 'react'
import { Building2, Landmark, MapPin, Send } from 'lucide-react'
import { Avatar, Btn, Card, Chip, Segmented, SectionTitle } from '../components/atoms'
import { CORE_VALUES, POSTS, person } from '../data'
import { useStore, fmtNum } from '../store'

export default function ProfileScreen() {
  const { profileId, setComposer } = useStore()
  const p = person(profileId)
  const [tab, setTab] = useState<'received' | 'given'>('received')
  const isMe = profileId === 'me'

  const received = POSTS.filter((x) => x.toIds.includes(profileId))
  const given = POSTS.filter((x) => x.fromId === profileId)
  const entries = tab === 'received' ? received : given
  const manager = p.managerId ? person(p.managerId) : null

  return (
    <div>
      {/* Header */}
      <Card className="hero-room relative overflow-hidden p-0 text-white">
        <div className="dotgrid px-6 py-7 md:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <Avatar id={p.id} size={86} />
            <div className="min-w-0 flex-1">
              <h1 className="text-3xl font-extrabold tracking-tight md:text-[34px]">{p.name}</h1>
              <p className="mt-1 text-[15px] font-semibold text-white/80">{p.title} · {p.dept}</p>
              <div className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1.5 text-[12.5px] text-white/60">
                <span className="flex items-center gap-1.5"><MapPin size={13} /> {p.office}</span>
                <span className="flex items-center gap-1.5"><Landmark size={13} /> {p.tenure}</span>
                {manager && (
                  <span className="flex items-center gap-1.5"><Building2 size={13} /> Reports to {manager.name}</span>
                )}
              </div>
            </div>
            {isMe ? (
              <Chip className="shrink-0 self-start bg-gold px-3.5 py-2 text-[12px] font-extrabold text-[#3d2b00] sm:self-center">You</Chip>
            ) : (
              <Btn variant="gold" className="shrink-0 self-start sm:self-center" onClick={() => setComposer({ open: true, preset: { toId: p.id } })}>
                <Send size={15} /> Recognize
              </Btn>
            )}
          </div>

          <div className="mt-7 grid max-w-xl grid-cols-3 gap-3">
            {[
              ['Points earned', fmtNum(received.filter((x) => x.points).reduce((s, x) => s + (x.points ?? 0), 0) + (isMe ? 1240 : 0))],
              ['Received', String(received.length)],
              ['Given', String(given.length)],
            ].map(([l, v]) => (
              <div key={l} className="rounded-xl bg-white/10 px-4 py-3.5 backdrop-blur-sm">
                <p className="tnum text-[20px] font-extrabold text-gold">{v}</p>
                <p className="mt-0.5 text-[10px] font-bold font-mono uppercase tracking-wider text-white/60">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Journey */}
      <div className="mt-7">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-extrabold tracking-tight text-navy">Recognition journey</h2>
          <Segmented options={[{ key: 'received', label: `Received ${received.length}` }, { key: 'given', label: `Given ${given.length}` }]} value={tab} onChange={setTab} />
        </div>
        <div className="space-y-3">
          {entries.map((post) => {
            const other = tab === 'received' ? person(post.fromId) : person(post.toIds[0])
            const v = post.valueKey ? CORE_VALUES[post.valueKey] : null
            return (
              <Card key={post.id} className="flex items-center gap-3.5 p-4 transition hover:shadow-lift">
                <Avatar id={other.id} size={40} />
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px]">
                    <span className="font-extrabold text-navy">{other.name}</span>
                    <span className="text-muted"> · {tab === 'received' ? 'praised you' : 'you praised them'} · {post.when}</span>
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-[12.5px] text-muted">{post.message}</p>
                </div>
                {v && <Chip className={`shrink-0 ${v.soft} ${v.ink}`}>{v.label}</Chip>}
              </Card>
            )
          })}
          {entries.length === 0 && (
            <Card className="p-10 text-center">
              <p className="font-bold text-navy">Nothing here yet</p>
              <p className="mt-1 text-sm text-muted">The journey starts with one recognition.</p>
            </Card>
          )}
        </div>

        {/* Tenure timeline */}
        <div className="mt-8">
          <SectionTitle>Tenure timeline</SectionTitle>
          <Card className="relative p-6">
            <div className="absolute bottom-6 left-[86px] top-6 w-px bg-line" />
            <div className="space-y-5">
              {[
                ['Jul 2020', 'Joined emids — Data Engineering'],
                ['Jan 2022', 'Promoted to Engineering Manager'],
                ['Sep 2023', 'First EoQ win — Team Player'],
                ['Jul 2025', '5-year milestone · +500 pts from leadership'],
                ['Now', 'Senior Engineering Manager · pod of 8'],
              ].map(([when, what], i, arr) => (
                <div key={when + i} className="flex items-start gap-4">
                  <div className="w-[70px] shrink-0 pt-0.5 text-right">
                    <p className="text-[11.5px] font-extrabold text-navy">{when}</p>
                  </div>
                  <span className={`relative z-10 mt-0.5 h-3 w-3 shrink-0 rounded-full border-2 border-white ${i === arr.length - 1 ? 'bg-gold ring-2 ring-gold/30' : 'bg-brand'}`} />
                  <p className="min-w-0 flex-1 text-[13.5px] font-medium text-ink">{what}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
