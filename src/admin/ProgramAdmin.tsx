import { useState } from 'react'
import type { ReactNode } from 'react'
import { BadgeCheck, BellRing, CalendarHeart, Check, FileDown, Gauge, Megaphone, Plug, ShieldCheck, SlidersHorizontal, Trash2 } from 'lucide-react'
import { Btn, Card, Chip } from '../components/atoms'
import { ORG_STATS, PEOPLE_LIST } from '../data'
import { useStore } from '../store'
import { ADMIN_BANNERS, AWARD_CAPS, AWARD_WINDOW, DIRECTORY, INTEGRATIONS, MEDIA_ASSETS, MILESTONE_RULES, NOTIF_SETTINGS, PHASE_LABEL, RECOGNITION_RULES, REGION_POOLS, SCHEDULED_EXPORTS, type AdminBanner, type AwardCap, type AwardPhase, type AwardWindowState, type BannerAudience, type DirectoryPersonEntry, type DirectoryStatus, type MilestoneRule, type NotificationSetting, type RecognitionRules } from './data'
import AdminShell from './AdminShell'

export interface ProgramAdminProps {
  onExit: () => void
}

type Tab = 'overview' | 'people' | 'banners' | 'awards' | 'rules' | 'milestones' | 'notifications' | 'integrations' | 'exports' | 'media'
const AUDIENCE_LABEL: Record<BannerAudience, string> = { all: 'All teams', humana: 'Humana', pacca: 'PACCA AI' }

export default function ProgramAdmin({ onExit }: ProgramAdminProps) {
  const [tab, setTab] = useState<Tab>('overview')
  const [banners, setBanners] = useState<AdminBanner[]>(ADMIN_BANNERS)
  const [caps, setCaps] = useState<AwardCap[]>(AWARD_CAPS)
  const [windowState, setWindowState] = useState<AwardWindowState>(AWARD_WINDOW)
  const [rules, setRules] = useState<RecognitionRules>(RECOGNITION_RULES)
  const [directory, setDirectory] = useState(DIRECTORY)
  const [milestones, setMilestones] = useState<MilestoneRule[]>(MILESTONE_RULES)
  const [notifs, setNotifs] = useState<NotificationSetting[]>(NOTIF_SETTINGS)

  const activePeople = Object.values(directory).filter((d) => d.status === 'active').length

  return (
    <AdminShell
      role="Program admin"
      tabs={[
        { key: 'overview', label: 'Overview' },
        { key: 'people', label: 'People', badge: activePeople },
        { key: 'banners', label: 'Banners', badge: banners.filter((b) => b.active).length },
        { key: 'awards', label: 'Awards', badge: caps.length },
        { key: 'rules', label: 'Recognition rules' },
        { key: 'milestones', label: 'Milestones', badge: milestones.filter((m) => m.active).length },
        { key: 'notifications', label: 'Notifications' },
        { key: 'integrations', label: 'Integrations' },
        { key: 'exports', label: 'Exports' },
      ]}
      active={tab}
      onTab={(k) => setTab(k as Tab)}
      onExit={onExit}
    >
      {tab === 'overview' && <OverviewPanel banners={banners} window={windowState} rules={rules} directory={directory} />}
      {tab === 'people' && <PeoplePanel directory={directory} setDirectory={setDirectory} />}
      {tab === 'banners' && <BannersPanel banners={banners} setBanners={setBanners} />}
      {tab === 'awards' && <AwardsPanel caps={caps} setCaps={setCaps} window={windowState} setWindow={setWindowState} />}
      {tab === 'rules' && <RulesPanel rules={rules} setRules={setRules} />}
      {tab === 'milestones' && <MilestonesPanel milestones={milestones} setMilestones={setMilestones} />}
      {tab === 'notifications' && <NotificationsPanel notifs={notifs} setNotifs={setNotifs} />}
      {tab === 'integrations' && <IntegrationsPanel />}
      {tab === 'exports' && <ExportsPanel />}
    </AdminShell>
  )
}


/* ------------------------------ Overview ------------------------------ */

function OverviewPanel({ banners, window: w, rules, directory }: { banners: AdminBanner[]; window: AwardWindowState; rules: RecognitionRules; directory: Record<string, { status: DirectoryStatus }> }) {
  const { approvals, decided } = useStore()
  const pending = approvals.filter((a) => !decided[a.id]).length
  const activeBanners = banners.filter((b) => b.active).length
  const poolRemaining = REGION_POOLS.reduce((s, p) => s + (p.allocated - p.spent), 0)

  const tiles = [
    { label: 'Total recognitions', value: ORG_STATS.recognitions.toLocaleString('en-IN'), hint: 'Across emids, all time', tint: 'text-navy', icon: <Gauge size={16} className="text-brand" /> },
    { label: 'Open approvals', value: String(pending), hint: 'Waiting on managers', tint: 'text-navy', icon: <Megaphone size={16} className="text-gold-ink" /> },
    { label: 'Live banners', value: `${activeBanners} / ${banners.length}`, hint: 'Audience-targeted strips', tint: 'text-navy', icon: <ShieldCheck size={16} className="text-violet" /> },
    { label: 'Voucher pool left', value: REGION_POOLS ? `₹${poolRemaining.toLocaleString('en-IN')}` : '—', hint: "Finance's shared pools", tint: 'text-mint', icon: <SlidersHorizontal size={16} className="text-mint" /> },
  ]

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {tiles.map((t) => (
          <Card key={t.label} className="p-5">
            <p className="flex items-center gap-2">{t.icon}<span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted">{t.label}</span></p>
            <p className={`tnum mt-2.5 text-[30px] font-extrabold leading-none ${t.tint}`}>{t.value}</p>
            <p className="mt-1.5 text-[11px] text-muted">{t.hint}</p>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <p className="text-[15px] font-extrabold text-navy">Program state</p>
        <div className="mt-3 space-y-2.5 rounded-2xl border border-line bg-slate-50 px-4 py-3.5">
          <Row label="Award window" value={<Chip className={w.phase === 'nominations' ? 'bg-mint-soft text-mint' : w.phase === 'voting' ? 'bg-gold-soft text-gold-ink' : 'bg-violet-soft text-violet'}>{PHASE_LABEL[w.phase]}</Chip>} />
          <Row label="Award quarter" value={<span className="font-extrabold text-navy">{w.quarter}</span>} />
          <Row label="Voting closes" value={<span className="tnum font-extrabold text-navy">{w.votingEnd}</span>} />
          <Row label="Max points per praise" value={<span className="tnum font-extrabold text-navy">{rules.maxPointsPerPraise}</span>} />
          <Row label="Auto-approve below" value={<span className="tnum font-extrabold text-navy">{rules.autoApproveBelow} pts</span>} />
        </div>
        <p className="mt-2.5 text-[11px] text-muted">Edits take effect on save.</p>
      </Card>

      <SetupChecklist banners={banners} />
    </div>
  )
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return <p className="flex items-center justify-between text-[13px]"><span className="font-semibold text-muted">{label}</span><span>{value}</span></p>
}

/* ------------------------------ Banners ------------------------------ */

function BannersPanel({ banners, setBanners }: { banners: AdminBanner[]; setBanners: (b: AdminBanner[]) => void }) {
  const [savedId, setSavedId] = useState<string | null>(null)

  const patch = (id: string, delta: Partial<AdminBanner>) =>
    setBanners(banners.map((b) => (b.id === id ? { ...b, ...delta } : b)))

  const save = (id: string) => {
    setSavedId(id)
    localStorage.setItem('banners', JSON.stringify(banners))
    setTimeout(() => setSavedId(null), 1800)
  }

  return (
    <div className="space-y-4">
      <PanelHead icon={<Megaphone size={16} />} tint="bg-gold-soft text-gold-ink" title="Banners" sub="Dashboard strips · audience and expiry" />
      {banners.map((b) => (
        <Card key={b.id} className="p-5">
          <div className="flex flex-wrap items-center gap-2.5">
            <input
              value={b.title}
              onChange={(e) => patch(b.id, { title: e.target.value })}
              className="min-w-0 flex-1 basis-52 rounded-xl border border-line bg-white px-3.5 py-2 text-[13.5px] font-extrabold text-navy outline-none focus:border-brand/50"
              placeholder="Banner title"
            />
            <select
              value={b.audience}
              onChange={(e) => patch(b.id, { audience: e.target.value as BannerAudience })}
              className="rounded-xl border border-line bg-white px-3 py-2 text-[13px] font-bold text-navy outline-none focus:border-brand/50"
            >
              {(['all', 'humana', 'pacca'] as BannerAudience[]).map((a) => (
                <option key={a} value={a}>{AUDIENCE_LABEL[a]}</option>
              ))}
            </select>
            <button
              onClick={() => patch(b.id, { active: !b.active })}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-extrabold transition ${b.active ? 'bg-mint-soft text-mint' : 'bg-slate-100 text-muted'}`}
            >
              <span className={`h-2 w-2 rounded-full ${b.active ? 'bg-mint' : 'bg-slate-400'}`} />
              {b.active ? 'Live' : 'Paused'}
            </button>
            {savedId === b.id && <Chip className="bg-mint-soft text-mint"><Check size={12} /> Saved</Chip>}
          </div>
          <textarea
            value={b.message}
            onChange={(e) => patch(b.id, { message: e.target.value })}
            rows={2}
            className="mt-2.5 w-full resize-none rounded-xl border border-line bg-white px-3.5 py-2 text-[13px] text-ink outline-none placeholder:text-muted focus:border-brand/50"
            placeholder="Banner message"
          />
          <div className="mt-2.5 flex flex-wrap items-center gap-3">
            <label className="flex min-w-0 flex-1 basis-52 flex-col gap-1.5">
              <span className={LABEL_CLS}>Media (optional)</span>
              <select
                value={b.media ?? ''}
                onChange={(e) => patch(b.id, { media: e.target.value || undefined })}
                className={SELECT_CLS}
              >
                <option value="">No image</option>
                {MEDIA_ASSETS.map((a) => <option key={a} value={a}>{a.replace('/', '').replace(/%20/g, ' ')}</option>)}
              </select>
            </label>
            <p className="text-[11px] font-bold text-muted">Shows until <span className="font-extrabold text-navy">{b.ends}</span> · to <b>{AUDIENCE_LABEL[b.audience]}</b></p>
            <div className="flex items-center gap-2">
              <Btn size="sm" variant="outline" onClick={() => setBanners(banners.filter((x) => x.id !== b.id))}>
                <Trash2 size={13} /> Remove
              </Btn>
              <Btn size="sm" variant="primary" onClick={() => save(b.id)}>Save banner</Btn>
            </div>
          </div>
        </Card>
      ))}

      <Btn variant="primary" onClick={() => setBanners([...banners, { id: 'bn' + Date.now(), title: '', message: '', audience: 'all', active: false, ends: 'Apr 30' }])}>
        New banner
      </Btn>
    </div>
  )
}

/* ------------------------------ Awards (window + caps) ------------------------------ */

function AwardsPanel({ caps, setCaps, window: w, setWindow }: {
  caps: AwardCap[]
  setCaps: (c: AwardCap[]) => void
  window: AwardWindowState
  setWindow: (w: AwardWindowState) => void
}) {
  const [capsSaved, setCapsSaved] = useState<string | null>(null)
  const [windowSaved, setWindowSaved] = useState(false)
  const [draftWindow, setDraftWindow] = useState(w)

  return (
    <div className="space-y-4">
      <PanelHead icon={<ShieldCheck size={16} />} tint="bg-violet-soft text-violet" title="Awards" sub="Window phase · category caps" />

      <Card className="p-5">
        <p className="text-[15px] font-extrabold text-navy">Window</p>
        <div className="mt-3 grid gap-4 md:grid-cols-4">
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLS}>Phase</span>
            <select value={draftWindow.phase} onChange={(e) => setDraftWindow({ ...draftWindow, phase: e.target.value as AwardPhase })} className={SELECT_CLS}>
              {(Object.keys(PHASE_LABEL) as AwardPhase[]).map((p) => <option key={p} value={p}>{PHASE_LABEL[p]}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLS}>Quarter</span>
            <input value={draftWindow.quarter} onChange={(e) => setDraftWindow({ ...draftWindow, quarter: e.target.value })} className={INPUT_CLS} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLS}>Nominations end</span>
            <input value={draftWindow.nominationsEnd} onChange={(e) => setDraftWindow({ ...draftWindow, nominationsEnd: e.target.value })} className={INPUT_CLS} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLS}>Voting ends</span>
            <input value={draftWindow.votingEnd} onChange={(e) => setDraftWindow({ ...draftWindow, votingEnd: e.target.value })} className={INPUT_CLS} />
          </label>
        </div>
        <div className="mt-4 flex items-center gap-2.5">
          <Btn size="sm" variant="primary" onClick={() => { setWindow(draftWindow); setWindowSaved(true); setTimeout(() => setWindowSaved(false), 1800) }}>Save window</Btn>
          {windowSaved && <Chip className="bg-mint-soft text-mint"><Check size={12} /> Saved</Chip>}
        </div>
      </Card>

      <p className="text-[13px] font-extrabold text-navy">Category caps</p>
      {caps.map((c) => (
        <Card key={c.id} className="p-5">
          <CapRow cap={c} onEdit={(next) => setCaps(caps.map((x) => (x.id === c.id ? next : x)))} saved={capsSaved === c.id} onSave={() => { setCaps(caps.map((x) => (x.id === c.id ? c : x))); setCapsSaved(c.id); setTimeout(() => setCapsSaved(''), 1800) }} />
        </Card>
      ))}
    </div>
  )
}

function CapRow({ cap, onEdit, saved, onSave }: { cap: AwardCap; onEdit: (next: AwardCap) => void; saved: boolean; onSave: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <p className="min-w-40 flex-1 text-[15px] font-extrabold text-navy">{cap.category}</p>
      <NumField label="Max nominations" value={cap.maxNominations} min={1} onChange={(v) => onEdit({ ...cap, maxNominations: v })} />
      <NumField label="Max award pts" value={cap.maxPoints} min={50} step={50} onChange={(v) => onEdit({ ...cap, maxPoints: v })} />
      <Chip className="bg-slate-100 text-muted">{cap.window}</Chip>
      {saved && <Chip className="bg-mint-soft text-mint"><Check size={12} /> Saved</Chip>}
      <div className="ml-auto"><Btn size="sm" variant="primary" onClick={onSave}>Save</Btn></div>
    </div>
  )
}

/* ------------------------------ Recognition rules ------------------------------ */

function RulesPanel({ rules, setRules }: { rules: RecognitionRules; setRules: (r: RecognitionRules) => void }) {
  const [draft, setDraft] = useState(rules)
  const [saved, setSaved] = useState(false)

  return (
    <div className="space-y-4">
      <PanelHead icon={<SlidersHorizontal size={16} />} tint="bg-brand-soft text-brand" title="Recognition rules" sub="Point cap · auto-approve · expiry" />
      <Card className="p-5">
        <div className="grid gap-4 md:grid-cols-3">
          <NumField label="Max points per praise" value={draft.maxPointsPerPraise} min={10} step={10} onChange={(v) => setDraft({ ...draft, maxPointsPerPraise: v })} />
          <NumField label="Auto-approve below (pts)" value={draft.autoApproveBelow} min={0} step={10} onChange={(v) => setDraft({ ...draft, autoApproveBelow: v })} />
          <NumField label="Points expiry (months)" value={draft.pointsExpiryMonths} min={1} onChange={(v) => setDraft({ ...draft, pointsExpiryMonths: v })} />
        </div>
        <div className="mt-4 flex items-center gap-2.5">
          <Btn size="sm" variant="primary" onClick={() => { setRules(draft); setSaved(true); setTimeout(() => setSaved(false), 1800) }}>Save rules</Btn>
          {saved && <Chip className="bg-mint-soft text-mint"><Check size={12} /> Saved</Chip>}
        </div>
      </Card>
    </div>
  )
}

/* ------------------------------ shared bits ------------------------------ */

const LABEL_CLS = 'text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted'
const SELECT_CLS = 'rounded-xl border border-line bg-white px-3 py-2.5 text-[13.5px] font-bold text-navy outline-none focus:border-brand/50'
const INPUT_CLS = 'rounded-xl border border-line bg-white px-3 py-2 text-[13px] font-bold text-navy outline-none focus:border-brand/50'

function PanelHead({ icon, tint, title, sub }: { icon: ReactNode; tint: string; title: string; sub: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tint}`}>{icon}</span>
      <div className="min-w-0">
        <p className="text-[16px] font-extrabold text-navy">{title}</p>
        <p className="text-[12.5px] text-muted">{sub}</p>
      </div>
    </div>
  )
}

function NumField({ label, value, min, step = 1, onChange }: { label: string; value: number; min: number; step?: number; onChange: (v: number) => void }) {
  return (
    <label className="flex flex-col gap-1">
      <span className={LABEL_CLS}>{label}</span>
      <input
        type="number"
        value={value}
        min={min}
        step={step}
        onChange={(e) => onChange(Math.max(min, Number(e.target.value) || min))}
        className={`${INPUT_CLS} tnum w-32`}
      />
    </label>
  )
}

/* ------------------------------ People directory ------------------------------ */

const STATUS_LABEL: Record<DirectoryStatus, string> = { active: 'Active', onleave: 'On leave', paused: 'Paused' }

function PeoplePanel({ directory, setDirectory }: { directory: Record<string, DirectoryPersonEntry>; setDirectory: (d: Record<string, DirectoryPersonEntry>) => void }) {
  const [q, setQ] = useState('')
  const [office, setOffice] = useState('');
  const offices = [...new Set(PEOPLE_LIST.map((p) => p.office))]
  const rows = PEOPLE_LIST.filter((p) =>
    (q ? p.name.toLowerCase().includes(q.toLowerCase()) || p.email.toLowerCase().includes(q.toLowerCase()) : true)
    && (office ? p.office === office : true))

  const patch = (id: string, delta: Partial<{ status: DirectoryStatus; eligible: boolean }>) => {
    const entry = directory[id] ?? { id, status: 'active' as DirectoryStatus, eligible: true }
    setDirectory({ ...directory, [id]: { ...entry, ...delta } })
  }

  return (
    <div className="space-y-4">
      <PanelHead icon={<BadgeCheck size={16} />} tint="bg-brand-soft text-brand" title="People" sub="Eligibility to recommend and receive" />
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name or email…"
            className="min-w-56 flex-1 rounded-xl border border-line bg-white px-3.5 py-2 text-[13px] text-navy outline-none placeholder:text-muted focus:border-brand/50"
          />
          <select value={office} onChange={(e) => setOffice(e.target.value)} className={SELECT_CLS}>
            <option value="">All offices</option>
            {offices.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <Chip className="shrink-0 bg-brand-soft text-brand">{rows.length} shown</Chip>
        </div>
      </Card>

      {rows.map((p) => {
        const entry = directory[p.id] ?? { status: 'active' as DirectoryStatus, eligible: true }
        return (
          <Card key={p.id} className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-extrabold text-navy">{p.name}</p>
                <p className="truncate text-[11.5px] text-muted">{p.title} · {p.office} · {p.email}</p>
              </div>
              <Chip className={entry.status === 'active' ? 'bg-mint-soft text-mint' : entry.status === 'onleave' ? 'bg-gold-soft text-gold-ink' : 'bg-coral-soft text-coral'}>
                {entry.status === 'active' ? 'Active' : entry.status === 'onleave' ? 'On leave' : 'Paused'}
              </Chip>
              <select
                value={entry.status}
                onChange={(e) => patch(p.id, { status: e.target.value as DirectoryStatus })}
                className="rounded-xl border border-line bg-white px-3 py-2 text-[12.5px] font-bold text-navy outline-none focus:border-brand/50"
              >
                {(['active', 'onleave', 'paused'] as DirectoryStatus[]).map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
              </select>
              <button
                onClick={() => patch(p.id, { eligible: !entry.eligible })}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-extrabold transition ${entry.eligible ? 'bg-brand-soft text-brand' : 'bg-slate-100 text-muted'}`}
              >
                <BadgeCheck size={12} /> {entry.eligible ? 'Eligible' : 'Not eligible'}
              </button>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

/* ------------------------------ Milestones ------------------------------ */

function MilestonesPanel({ milestones, setMilestones }: { milestones: MilestoneRule[]; setMilestones: (m: MilestoneRule[]) => void }) {
  return (
    <div className="space-y-4">
      <PanelHead icon={<CalendarHeart size={16} />} tint="bg-gold-soft text-gold-ink" title="Milestones" sub="Anniversaries · auto-top-up" />
      {milestones.map((m) => (
        <Card key={m.id} className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-extrabold text-navy">{m.label}</p>
              <p className="text-[11.5px] text-muted">{m.detail} · auto-top-up</p>
            </div>
            <NumField label="Points" value={m.points} min={0} step={25} onChange={(v) => setMilestones(milestones.map((x) => (x.id === m.id ? { ...x, points: v } : x)))} />
            <Chip className="bg-slate-100 text-muted">{m.trigger === 'anniversary' ? 'Anniversary' : 'Birthday'}</Chip>
            <button
              onClick={() => setMilestones(milestones.map((x) => (x.id === m.id ? { ...x, active: !x.active } : x)))}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-extrabold transition ${m.active ? 'bg-mint-soft text-mint' : 'bg-slate-100 text-muted'}`}
            >
              <span className={`h-2 w-2 rounded-full ${m.active ? 'bg-mint' : 'bg-slate-400'}`} />
              {m.active ? 'On' : 'Off'}
            </button>
          </div>
        </Card>
      ))}
    </div>
  )
}

/* ------------------------------ Notifications ------------------------------ */

function NotificationsPanel({ notifs, setNotifs }: { notifs: NotificationSetting[]; setNotifs: (n: NotificationSetting[]) => void }) {
  return (
    <div className="space-y-4">
      <PanelHead icon={<BellRing size={16} />} tint="bg-violet-soft text-violet" title="Notifications" sub="Delivery channels" />
      <Card className="p-4">
        {notifs.map((n, i) => (
          <div key={n.id} className={`flex flex-wrap items-center gap-3 py-3 ${i < notifs.length - 1 ? 'border-b border-line' : ''}`}>
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-extrabold text-navy">{n.label}</p>
              <p className="text-[11.5px] text-muted">{n.detail}</p>
            </div>
            <button
              onClick={() => setNotifs(notifs.map((x) => (x.id === n.id ? { ...x, on: !x.on } : x)))}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-extrabold transition ${n.on ? 'bg-brand-soft text-brand' : 'bg-slate-100 text-muted'}`}
            >
              <span className={`h-2 w-2 rounded-full ${n.on ? 'bg-brand' : 'bg-slate-400'}`} />
              {n.on ? 'On · sending' : 'Off'}
            </button>
          </div>
        ))}
      </Card>
    </div>
  )
}

/* ------------------------------ Integrations ------------------------------ */

function IntegrationsPanel() {
  return (
    <div className="space-y-4">
      <PanelHead icon={<Plug size={16} />} tint="bg-brand-soft text-brand" title="Integrations" sub="Sync status" />
      {INTEGRATIONS.map((it) => (
        <Card key={it.id} className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-extrabold text-navy">{it.name}</p>
              <p className="text-[11.5px] text-muted">{it.note}</p>
            </div>
            <Chip className="bg-slate-100 text-muted">{it.kind}</Chip>
            <Chip className={it.state === 'connected' ? 'bg-mint-soft text-mint' : 'bg-coral-soft text-coral'}>
              {it.state === 'connected' ? '✓ Connected' : '! Degraded'}
            </Chip>
            <span className="tnum text-[11px] text-muted">last sync {it.lastSync}</span>
          </div>
        </Card>
      ))}
    </div>
  )
}

/* ------------------------------ Exports ------------------------------ */

function ExportsPanel() {
  const [exportedId, setExportedId] = useState<string | null>(null)
  return (
    <div className="space-y-4">
      <PanelHead icon={<FileDown size={16} />} tint="bg-mint-soft text-mint" title="Scheduled exports" sub="CSV · emailed per run" />
      {SCHEDULED_EXPORTS.map((x) => (
        <Card key={x.id} className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-extrabold text-navy">{x.report}</p>
              <p className="text-[11.5px] text-muted">{x.details} · to {x.recipients}</p>
            </div>
            <Chip className="bg-slate-100 text-muted">CSV · {x.nextRun}</Chip>
            <Btn size="sm" variant="outline" onClick={() => setExportedId(x.id === exportedId ? null : x.id)}>
              {exportedId === x.id ? 'Running…' : 'Run now'}
            </Btn>
          </div>
        </Card>
      ))}
      {exportedId && (
        <Card className="p-4">
          <p className="text-[12.5px] text-muted">The <b className="text-navy">{SCHEDULED_EXPORTS.find((x) => x.id === exportedId)?.report}</b> report runs on live data.</p>
        </Card>
      )}
    </div>
  )
}

/* ------------------------------ Setup checklist ------------------------------ */

function SetupChecklist({ banners }: { banners: AdminBanner[] }) {
  const items = [
    { done: banners.some((b) => b.active), label: 'A banner is live on the dashboard' },
    { done: true, label: 'Integrations connected (Entra ID · HRIS · Slack)' },
    { done: true, label: 'Recognition rules tuned' },
  ]
  const doneCount = items.filter((i) => i.done).length

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-[15px] font-extrabold text-navy">Program checklist</p>
        <Chip className="bg-mint-soft text-mint">{doneCount} / {items.length} done</Chip>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#E9EEF7]">
        <div className="h-full rounded-full bg-brand transition-[width] duration-700" style={{ width: `${(doneCount / items.length) * 100}%` }} />
      </div>
      <div className="mt-3 space-y-2">
        {items.map((i) => (
          <p key={i.label} className={`flex items-center gap-2 text-[12.5px] ${i.done ? 'text-mint' : 'text-muted'}`}>
            {i.done ? <Check size={13} /> : <span className="h-3.5 w-3.5 rounded-full border-2 border-line" />} {i.label}
          </p>
        ))}
      </div>
    </Card>
  )
}
