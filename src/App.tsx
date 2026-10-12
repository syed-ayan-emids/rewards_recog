import React, { useState } from 'react'
import {
  Bell, Check, ChevronDown, Home, ListFilter, Gift, Wallet, CalendarCheck,
  Sparkles, Trophy, MessageSquare, Cake, PartyPopper,
} from 'lucide-react'
import { StoreProvider, useStore, type Screen } from './store'
import { Avatar, useOutside } from './ui'
import Composer from './components/Composer'
import AiDrawer from './components/AiDrawer'
import Toasts from './components/Toasts'
import HomeScreen from './screens/Home'
import FeedScreen from './screens/Feed'
import RewardsScreen from './screens/Rewards'
import WalletScreen from './screens/Wallet'
import AwardsScreen from './screens/Awards'
import ApprovalsScreen from './screens/Approvals'
import TeamScreen from './screens/Team'
import JuryScreen from './screens/Jury'
import OrgTreeScreen from './screens/OrgTree'
import ProfileScreen from './screens/Profile'

const NAV: { key: Screen; label: string; icon: React.ReactNode }[] = [
  { key: 'home', label: 'Dashboard', icon: <Home size={17} /> },
  { key: 'feed', label: 'Feed', icon: <ListFilter size={17} /> },
  { key: 'wallet', label: 'My Wallet', icon: <Wallet size={17} /> },
  { key: 'rewards', label: 'My Rewards', icon: <Gift size={17} /> },
  { key: 'approvals', label: 'Approvals', icon: <CalendarCheck size={17} /> },
]

/* ---------------------------------- Notifications ---------------------------------- */

const GROUP_META: Record<string, { icon: React.ReactNode; label: string; bg: string; fg: string }> = {
  praise: { icon: <MessageSquare size={15} />, label: 'New praises', bg: 'bg-gold-soft', fg: 'text-gold-ink' },
  approval: { icon: <CalendarCheck size={15} />, label: 'Approvals waiting', bg: 'bg-brand-soft', fg: 'text-brand' },
  window: { icon: <Trophy size={15} />, label: 'EoQ windows', bg: 'bg-violet-soft', fg: 'text-violet' },
  milestone: { icon: <Cake size={15} />, label: 'Milestones', bg: 'bg-coral-soft', fg: 'text-coral' },
}

function NotifBell() {
  const [open, setOpen] = useState(false)
  const ref = useOutside<HTMLDivElement>(() => setOpen(false))
  const { notifications, markAllRead, setScreen } = useStore()
  const unread = notifications.filter((n) => n.unread).length
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} aria-label={`Notifications, ${unread} unread`} className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-white text-muted transition hover:text-ink hover:border-brand/30">
        <Bell size={18} />
        {unread > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-coral px-1 text-[10px] font-bold text-white">{unread}</span>}
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-40 w-[380px] max-w-[92vw] animate-rise overflow-hidden rounded-2xl border border-line bg-white shadow-lift">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="font-bold text-navy">Notifications</p>
            <button onClick={markAllRead} className="flex items-center gap-1 text-xs font-semibold text-brand hover:underline"><Check size={13} /> Mark all read</button>
          </div>
          <div className="rail-scroll max-h-[380px] overflow-y-auto p-2">
            {(['approval', 'praise', 'window', 'milestone'] as const).map((g) => {
              const items = notifications.filter((n) => n.group === g)
              if (!items.length) return null
              const m = GROUP_META[g]
              return (
                <div key={g} className="mb-1">
                  <div className={`flex items-center gap-2 px-2.5 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wide ${m.fg}`}>
                    {m.icon} {m.label}
                  </div>
                  {items.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => { setOpen(false); setScreen(n.go ?? 'home') }}
                      className="flex w-full items-start gap-3 rounded-xl px-2.5 py-2 text-left transition hover:bg-slate-50"
                    >
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ background: n.unread ? 'var(--color-brand)' : 'transparent' }} />
                      <span className="min-w-0">
                        <span className="block truncate text-[13px] font-semibold text-ink">{n.title}</span>
                        <span className="block truncate text-xs text-muted">{n.sub} · {n.when}</span>
                      </span>
                    </button>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------------------------------- Shell ---------------------------------- */

function Shell() {
  const { screen, setScreen, notifications, openComposer, setComposer, setAi, openAi: aiOpen } = useStore()
  const [profileMenu, setProfileMenu] = useState(false)
  const menuRef = useOutside<HTMLDivElement>(() => setProfileMenu(false))
  const approvalsCount = notifications.filter((n) => n.unread && n.group === 'approval').length

  return (
    <div className="min-h-dvh bg-page-art">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-line bg-white/88 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1560px] items-stretch gap-2 px-5 lg:px-10">
          <div className="mr-5 flex items-center gap-2.5">
            <img src="/emids-icon.png" alt="emids" className="h-9 w-9 object-contain" />
            <p className="text-[16px] font-extrabold tracking-tight text-navy">emids <span className="hidden font-bold text-muted sm:inline">· Recognition &amp; Rewards</span></p>
          </div>

          <nav className="rail-scroll hidden flex-1 items-stretch gap-1 overflow-x-auto lg:flex" aria-label="Primary">
            {NAV.map((n) => {
              const active = screen === n.key
              return (
                <button
                  key={n.key}
                  onClick={() => setScreen(n.key)}
                  aria-current={active ? 'page' : undefined}
                  className={`relative flex shrink-0 items-center gap-1.5 border-b-2 px-3.5 text-[13px] font-semibold transition ${active ? 'border-brand text-navy' : 'border-transparent text-muted hover:border-line hover:text-ink'}`}
                >
                  {n.icon}
                  {n.label}
                  {n.key === 'approvals' && approvalsCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-soft px-1.5 text-[10.5px] font-extrabold text-brand">{approvalsCount}</span>
                  )}
                </button>
              )
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            <NotifBell />
            <div ref={menuRef} className="relative flex items-center">
              <button onClick={() => setProfileMenu(!profileMenu)} aria-label="Profile menu" className="flex items-center gap-1.5 rounded-full p-0.5 pr-2 transition hover:bg-slate-100">
                <Avatar id="me" size={36} />
                <ChevronDown size={14} className="hidden text-muted sm:block" />
              </button>
              {profileMenu && <ProfileMenu close={() => setProfileMenu(false)} />}
            </div>
          </div>
        </div>

        {/* Mobile secondary nav row */}
        <div className="rail-scroll flex gap-1.5 overflow-x-auto border-t border-line px-4 py-2 lg:hidden">
          {NAV.map((n) => {
            const active = screen === n.key
            return (
              <button
                key={n.key}
                onClick={() => setScreen(n.key)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12.5px] font-bold transition ${active ? 'bg-brand text-white' : 'bg-slate-100 text-muted'}`}
              >
                {n.label}
              </button>
            )
          })}
        </div>
      </header>

      <main className="mx-auto max-w-[1560px] px-5 pb-28 pt-8 lg:px-10 lg:pb-16 xl:pt-[72px]">
        <div key={screen} className="page-fade">
          {screen === 'home' && <HomeScreen />}
          {screen === 'feed' && <FeedScreen />}
          {screen === 'rewards' && <RewardsScreen />}
          {screen === 'wallet' && <WalletScreen />}
          {screen === 'awards' && <AwardsScreen />}
          {screen === 'jury' && <JuryScreen />}
          {screen === 'approvals' && <ApprovalsScreen />}
          {screen === 'team' && <TeamScreen />}
          {screen === 'org' && <OrgTreeScreen />}
          {screen === 'profile' && <ProfileScreen />}
        </div>
      </main>

      {/* Mobile bottom bar */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 backdrop-blur-md lg:hidden" aria-label="Mobile">
        <div className="mx-auto grid max-w-md grid-cols-5 items-center px-2">
          <MobileTab k="home" icon={<Home size={21} />} label="Home" />
          <MobileTab k="feed" icon={<MessageSquare size={21} />} label="Feed" />
          <div className="relative flex justify-center">
            <button
              onClick={() => setComposer({ open: true })}
              aria-label="Send a Congratz"
              className="absolute -top-6 flex h-14 w-14 animate-pulse-dot items-center justify-center rounded-full bg-gold text-[#3d2b00] shadow-fab transition active:scale-95"
            >
              <PartyPopper size={22} />
            </button>
            <span className="pt-2 text-xs font-semibold text-gold-ink">Praise</span>
          </div>
          <MobileTab k="wallet" icon={<Wallet size={21} />} label="Wallet" />
          <MobileTab k="approvals" icon={<CalendarCheck size={21} />} label="Approve" badge={approvalsCount} />
        </div>
      </nav>

      <Composer open={openComposer.open} preset={openComposer.preset} />
      <AiDrawer />
      <Toasts />
    </div>
  )
}

function MobileTab({ k, icon, label, badge }: { k: Screen; icon: React.ReactNode; label: string; badge?: number }) {
  const { screen, setScreen } = useStore()
  const active = screen === k
  return (
    <button onClick={() => setScreen(k)} className={`relative flex flex-col items-center gap-0.5 py-2.5 text-[10.5px] font-semibold transition ${active ? 'text-brand' : 'text-muted'}`}>
      {icon}
      {label}
      {badge ? <span className="absolute right-[18%] top-1 h-2 w-2 rounded-full bg-coral" /> : null}
    </button>
  )
}

function ProfileMenu({ close }: { close: () => void }) {
  const { setScreen, setComposer, setAi } = useStore()
  const go = (s: Screen) => { setScreen(s); close() }
  return (
    <div className="absolute right-0 top-12 z-40 w-60 animate-rise overflow-hidden rounded-2xl border border-line bg-white p-1.5 shadow-lift">
      <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
        <Avatar id="me" size={40} />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-navy">Ayan</p>
          <p className="truncate text-xs text-muted">Senior Eng Manager</p>
        </div>
      </div>
      <div className="my-1 h-px bg-line" />
      {[
        { l: 'My rewards', fn: () => go('rewards') },
        { l: 'My profile', fn: () => go('profile') },
        { l: 'My team', fn: () => go('team') },
        { l: 'Org tree', fn: () => go('org') },
        { l: 'Quarterly awards', fn: () => go('awards') },
        { l: 'Jury dashboard', fn: () => go('jury') },
        { l: 'AI assistant', fn: () => { setAi(true); close() } },
      ].map((i) => (
        <button key={i.l} onClick={i.fn} className="block w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-ink transition hover:bg-slate-50">{i.l}</button>
      ))}
      <div className="my-1 h-px bg-line" />
      <button onClick={() => { setComposer({ open: true }); close() }} className="block w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-brand transition hover:bg-brand-soft">Send a Congratz</button>
    </div>
  )
}

function Root() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  )
}

export default Root
