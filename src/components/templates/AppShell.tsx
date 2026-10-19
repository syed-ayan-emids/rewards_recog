import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react'
import { ChevronDown, Home, Gift, Sparkles, PartyPopper, Users } from 'lucide-react'
import { useStore, type Screen } from '../../store'
import { Avatar, useOutside } from '../atoms'
import NotifBell from '../organisms/NotifBell'
import ProfileMenu from '../organisms/ProfileMenu'
import Composer from '../organisms/Composer'
import AiDrawer from '../organisms/AiDrawer'
import Toasts from '../organisms/Toasts'
import HomeScreen from '../../pages/Home'
import RewardsScreen from '../../pages/Rewards'
import AwardsScreen from '../../pages/Awards'
import MyTeamScreen from '../../pages/Team'
import JuryScreen from '../../pages/Jury'
import ProfileScreen from '../../pages/Profile'

const NAV: { key: Screen; label: string; icon: ReactNode }[] = [
  { key: 'home', label: 'Dashboard', icon: <Home size={17} /> },
  { key: 'team', label: 'My Team', icon: <Users size={17} /> },
  { key: 'rewards', label: 'My Rewards', icon: <Gift size={17} /> },
]

export default function AppShell() {
  const { screen, setScreen, notifications, openComposer, setComposer, setAi, openAi: aiOpen } = useStore()
  const [profileMenu, setProfileMenu] = useState(false)
  const menuRef = useOutside<HTMLDivElement>(() => setProfileMenu(false))
  const approvalsCount = notifications.filter((n) => n.unread && n.group === 'approval').length
  const [scrolled, setScrolled] = useState(false)
  const [underline, setUnderline] = useState({ left: -100, width: 0 })
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', h, { passive: true })
    h()
    return () => window.removeEventListener('scroll', h)
  }, [])

  const glideTo = () => {
    const nav = navRef.current
    const active = nav?.querySelector('[aria-current="page"]') as HTMLElement | null
    if (active) setUnderline({ left: active.offsetLeft + 12, width: active.offsetWidth - 24 })
  }
  useEffect(() => {
    glideTo()
    const ro = navRef.current ? new ResizeObserver(() => glideTo()) : null
    if (ro && navRef.current) ro.observe(navRef.current)
    window.addEventListener('resize', glideTo)
    return () => {
      ro?.disconnect()
      window.removeEventListener('resize', glideTo)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen])

  // Arrow Left/Right cycles focus across the emids logo + nav items
  // (handler on the header so it works whether focus starts on the logo or a nav item)
  const onHeaderKey = (e: ReactKeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    const items = [...(e.currentTarget as HTMLElement).querySelectorAll<HTMLButtonElement>('button[aria-label="Go to dashboard"], nav button')]
    const idx = items.indexOf(document.activeElement as HTMLButtonElement)
    if (idx < 0) return
    e.preventDefault()
    const next = e.key === 'ArrowRight' ? (idx + 1) % items.length : (idx - 1 + items.length) % items.length
    items[next]?.focus()
  }

  // First ArrowUp/ArrowDown touch: navbar grabs focus on the nav item matching the current screen
  // (Dashboard on home as default); once in the navbar, further Up/Down presses resume page scrolling
  // and no longer re-grab the navbar (that caused the flicker while keyboard-scrolling)
  const navArmed = useRef(false)
  const navReleased = useRef(false)
  useEffect(() => {
    navArmed.current = false
    navReleased.current = false
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
      const headerEl = document.querySelector('header')
      const items = headerEl ? [...headerEl.querySelectorAll<HTMLButtonElement>('button[aria-label="Go to dashboard"], nav button')] : []
      if (items.indexOf(document.activeElement as HTMLButtonElement) >= 0) {
        ;(document.activeElement as HTMLElement).blur()
        navArmed.current = false
        navReleased.current = true
        return // default Up/Down scrolls the page from here
      }
      if (navArmed.current || navReleased.current) return // stay released — no re-grab flicker
      e.preventDefault()
      const target = items.find((b) => b.dataset.screen === screen) ?? items.find((b) => b.dataset.screen === 'home') ?? items[0] ?? null
      target?.focus()
      navArmed.current = true
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [screen])

  return (
    <div className="min-h-dvh bg-page-art">
      {/* Skip to main content — first keyboard stop */}
      <a href="#main-content" className="skip-link">Skip to main content</a>
      {/* Top bar — curved floating pill */}
      <header onKeyDown={onHeaderKey} className={`sticky top-2 z-20 mx-2.5 mt-2 rounded-[20px] border border-line bg-white/88 backdrop-blur-md transition-shadow duration-300 ${scrolled ? 'shadow-[0_4px_18px_rgba(10,31,68,0.07)]' : ''}`}>
        <div className="mx-auto flex h-16 max-w-[1560px] items-stretch gap-2 px-5 lg:px-10">
          <div className="mr-5 flex items-center gap-2.5">
            <button onClick={() => setScreen('home')} aria-label="Go to dashboard" title="Go to dashboard" className="flex cursor-pointer items-center gap-2.5 rounded-lg transition hover:opacity-80">
              <img src="/emids-icon.png" alt="emids" className="h-9 w-9 object-contain" />
              <span className="text-[16px] font-extrabold tracking-tight text-navy">EMIDS <span className="hidden font-bold text-muted sm:inline">· Rewards and Recognition</span></span>
            </button>
          </div>

          <nav ref={navRef} className="rail-scroll relative hidden flex-1 items-stretch gap-1 overflow-x-auto lg:flex" aria-label="Primary">
            {NAV.map((n) => {
              const active = screen === n.key
              return (
                <button
                  key={n.key}
                  data-screen={n.key}
                  onClick={() => setScreen(n.key)}
                  aria-current={active ? 'page' : undefined}
                  className={`relative flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 text-[13px] font-semibold transition outline-none focus-visible:bg-brand-soft/50 ${active ? 'text-navy' : 'text-muted hover:text-ink'}`}
                >
                  {n.icon}
                  {n.label}
                  {n.key === 'team' && approvalsCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-soft px-1.5 text-[10.5px] font-extrabold text-brand">{approvalsCount}</span>
                  )}
                </button>
              )
            })}
            <span aria-hidden className="absolute bottom-0 hidden h-[2.5px] rounded-full bg-brand transition-all duration-300 ease-out lg:block" style={{ left: underline.left, width: underline.width }} />
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

      <main id="main-content" tabIndex={-1} className="mx-auto mt-2 max-w-[1560px] px-5 pb-28 pt-3 lg:px-10 lg:pb-16">
        {/* Back affordance for pages not reachable from the primary nav (awards, jury, profile) */}
        {!NAV.some((n) => n.key === screen) && screen !== 'compose' && (
          <div className="flex justify-end">
            <button
              onClick={() => setScreen('home')}
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[12.5px] font-bold text-muted transition hover:text-navy"
            >
              ← Back to dashboard
            </button>
          </div>
        )}
        <div key={screen} className="page-fade">
          {screen === 'home' && <HomeScreen />}
          {screen === 'rewards' && <RewardsScreen />}
          {screen === 'awards' && <AwardsScreen />}
          {screen === 'jury' && <JuryScreen />}
          {screen === 'team' && <MyTeamScreen />}
          {screen === 'profile' && <ProfileScreen />}
          {screen === 'compose' && <Composer open preset={openComposer.preset} />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0d0d12] pb-20 pt-8 text-white/85 lg:pb-0">
        <div className="mx-auto flex max-w-[1560px] flex-col items-center justify-center gap-3 px-5 py-5 text-center sm:px-10">
          <div className="flex items-center gap-2">
            <button onClick={() => setScreen('home')} aria-label="Go to dashboard" title="Go to dashboard" className="flex cursor-pointer items-center gap-2 rounded-lg transition hover:opacity-80">
              <img src="/emids-icon.png" alt="emids" className="h-6 w-6 object-contain" />
              <span className="text-[13px] font-extrabold tracking-tight text-white">EMIDS <span className="font-bold text-white/60">· Rewards and Recognition</span></span>
            </button>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[13px] font-semibold" aria-label="Brand">
            <a href="https://www.emids.com/code-of-conduct/" target="_blank" rel="noreferrer" className="transition hover:text-white">Code of Conduct</a>
            <a href="https://www.emids.com/privacy-policy/" target="_blank" rel="noreferrer" className="transition hover:text-white">Privacy Policy</a>
            <a href="https://Health1.Meritain.com/app/public/#/one/insurerCode=MERITAIN_I&brandCode=MERITAINOVER/machine-readable-transparency-in-coverage?reportingEntityType=TPA_A6673&lock=true" target="_blank" rel="noreferrer" className="transition hover:text-white">Transparency in Coverage</a>
            <a href="https://www.emids.com/cookie-policy/" target="_blank" rel="noreferrer" className="transition hover:text-white">Cookie Policy</a>
            <a href="https://www.emids.com/accessibility-statement/" target="_blank" rel="noreferrer" className="transition hover:text-white">Accessibility Statement</a>
          </nav>
        </div>
      </footer>

      {/* Mobile bottom bar */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 backdrop-blur-md lg:hidden" aria-label="Mobile">
        <div className="mx-auto grid max-w-md grid-cols-4 items-center px-2">
          <MobileTab k="home" icon={<Home size={21} />} label="Home" />
          <div className="relative flex justify-center">
            <button
              onClick={() => setComposer({ open: true })}
              aria-label="Recognize a teammate"
              className="absolute -top-6 flex h-14 w-14 animate-pulse-dot items-center justify-center rounded-full bg-gold text-[#3d2b00] shadow-fab transition active:scale-95"
            >
              <PartyPopper size={22} />
            </button>
            <span className="pt-2 text-xs font-semibold text-gold-ink">Praise</span>
          </div>
          <MobileTab k="rewards" icon={<Gift size={21} />} label="Rewards" />
          <MobileTab k="team" icon={<Users size={21} />} label="My Team" badge={approvalsCount} />
        </div>
      </nav>

      {/* Floating AI assistant */}
      <button
        onClick={() => setAi(true)}
        aria-label="Open AI assistant"
        className={`fixed bottom-24 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-violet text-white shadow-[0_10px_26px_rgba(122,90,248,0.5)] ring-2 ring-white/70 transition-all duration-300 hover:scale-105 lg:bottom-7 lg:right-7 lg:h-14 lg:w-14 ${aiOpen ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
      >
        <Sparkles size={20} />
        <span className="absolute -left-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-mint" aria-hidden />
      </button>

      <AiDrawer />
      <Toasts />
    </div>
  )
}

export interface MobileTabProps {
  k: Screen
  icon: ReactNode
  label: string
  badge?: number
}

function MobileTab({ k, icon, label, badge }: MobileTabProps) {
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
