import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Home, Gift, Users, Bell } from 'lucide-react'
import { Avatar } from '../components/atoms'
import './globals.css'

export const metadata: Metadata = {
  title: 'emids · Rewards & Recognition',
  description: 'Recognize teammates, celebrate milestones, and spend reward points — the emids employee portal.',
}

// Employee shell: dashboard is the only real page in this slice.
const NAV = [
  { href: '/', label: 'Dashboard', icon: Home, active: true },
  { href: '#', label: 'My Team', icon: Users, active: false },
  { href: '#', label: 'My Rewards', icon: Gift, active: false },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-dvh bg-page-art">
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>

          <header className="sticky top-2 z-20 mx-2.5 mt-2 rounded-[20px] border border-line bg-white/88 shadow-[0_4px_18px_rgba(10,31,68,0.07)] backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-[1560px] items-stretch gap-2 px-5 lg:px-10">
              <div className="mr-5 flex items-center gap-2.5">
                <Link
                  href="/"
                  aria-label="Go to dashboard"
                  title="Go to dashboard"
                  className="flex items-center gap-2.5 rounded-lg transition hover:opacity-80"
                >
                  <Image src="/emids-icon.png" alt="emids" width={36} height={36} className="h-9 w-9 object-contain" />
                  <span className="text-[16px] font-extrabold tracking-tight text-navy">
                    EMIDS <span className="hidden font-bold text-muted sm:inline">· Rewards and Recognition</span>
                  </span>
                </Link>
              </div>

              <nav className="relative hidden flex-1 items-stretch gap-1 overflow-x-auto lg:flex" aria-label="Primary">
                {NAV.map((n) => (
                  <Link
                    key={n.label}
                    href={n.href}
                    aria-current={n.active ? 'page' : undefined}
                    className={`relative flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 text-[13px] font-semibold transition outline-none focus-visible:bg-brand-soft/50 ${n.active ? 'text-navy' : 'text-muted hover:text-ink'}`}
                  >
                    <n.icon size={17} />
                    {n.label}
                  </Link>
                ))}
                <span
                  aria-hidden
                  className="absolute bottom-0 left-[12px] hidden h-[2.5px] w-[104px] rounded-full bg-brand lg:block"
                />
              </nav>

              <div className="ml-auto flex items-center gap-1.5">
                <button
                  aria-label="Notifications"
                  className="relative rounded-full p-2 text-muted transition hover:bg-slate-100"
                >
                  <Bell size={17} />
                  <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-coral" aria-hidden />
                </button>
                <button
                  aria-label="Profile menu"
                  className="flex items-center gap-1.5 rounded-full p-0.5 pr-2 transition hover:bg-slate-100"
                >
                  <Avatar id="me" size={36} />
                </button>
              </div>
            </div>
          </header>

          <main
            id="main-content"
            tabIndex={-1}
            className="mx-auto mt-2 max-w-[1560px] px-5 pb-28 pt-3 lg:px-10 lg:pb-16"
          >
            {children}
          </main>

          <footer className="bg-[#0d0d12] pb-20 pt-8 text-white/85 lg:pb-0">
            <div className="mx-auto flex max-w-[1560px] flex-col items-center justify-center gap-3 px-5 py-5 text-center sm:px-10">
              <div className="flex items-center gap-2">
                <Link
                  href="/"
                  aria-label="Go to dashboard"
                  title="Go to dashboard"
                  className="flex items-center gap-2 rounded-lg transition hover:opacity-80"
                >
                  <Image src="/emids-icon.png" alt="emids" width={24} height={24} className="h-6 w-6 object-contain" />
                  <span className="text-[13px] font-extrabold tracking-tight text-white">
                    EMIDS <span className="font-bold text-white/60">· Rewards and Recognition</span>
                  </span>
                </Link>
              </div>
              <nav
                className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[13px] font-semibold"
                aria-label="Brand"
              >
                <a
                  href="https://www.emids.com/code-of-conduct/"
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-white"
                >
                  Code of Conduct
                </a>
                <a
                  href="https://www.emids.com/privacy-policy/"
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-white"
                >
                  Privacy Policy
                </a>
                <a
                  href="https://www.emids.com/cookie-policy/"
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-white"
                >
                  Cookie Policy
                </a>
                <a
                  href="https://www.emids.com/accessibility-statement/"
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-white"
                >
                  Accessibility Statement
                </a>
              </nav>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
