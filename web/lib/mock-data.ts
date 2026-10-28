// Mock data — trimmed port of src/data.ts, dashboard datasets only.
// This is the ONLY file the dashboard talks to today; data-api.ts wraps it so
// Ayan's FastAPI slots in here later without touching components.

export interface Person {
  id: string
  name: string
  email: string
  title: string
  status: 'online' | 'offline'
}

export const PEOPLE: Record<string, Person> = {
  me: { id: 'me', name: 'Ayan', email: 'ayan@emids.com', title: 'Senior Engineering Manager', status: 'online' },
  p1: { id: 'p1', name: 'Aarav Sharma', email: 'aarav.sharma@emids.com', title: 'Data Engineer II', status: 'online' },
  p2: { id: 'p2', name: 'Daniel Cho', email: 'daniel.cho@emids.com', title: 'Principal Engineer', status: 'offline' },
  p3: { id: 'p3', name: 'Priya Menon', email: 'priya.menon@emids.com', title: 'Analytics Lead', status: 'online' },
  p6: { id: 'p6', name: 'Kenji Watanabe', email: 'kenji.watanabe@emids.com', title: 'Data Scientist', status: 'online' },
}

export const person = (id: string): Person => PEOPLE[id] ?? PEOPLE.me

export const initials = (name: string) =>
  name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()

export interface LeaderRow {
  id: string
  pts: number
}

export const TEAM_LEADERBOARD: LeaderRow[] = [
  { id: 'p2', pts: 420 },
  { id: 'me', pts: 380 },
  { id: 'p1', pts: 275 },
  { id: 'p3', pts: 250 },
  { id: 'p6', pts: 220 },
]

export const ORG_STATS = { recognitions: 279 }

export const DASH_STATS = { given: 14, got: 9 }

export interface Slide {
  key: string
  img: string
  title: string
  headline: string
  blurb: string
  cta: string
  cta2?: string
}

export const SHOWCASE_SLIDES: Slide[] = [
  {
    key: 'eoq',
    img: '/img2.jpg',
    title: 'EoQ window · Q4',
    headline: 'Nominations close in 19 days',
    blurb: '4 categories open · jury voting starts Nov 3',
    cta: 'Nominate now',
    cta2: 'See categories',
  },
  {
    key: 'awards',
    img: '/img1.png',
    title: 'Quarterly Awards',
    headline: 'Awards worth 7,500 pts this quarter',
    blurb: 'Nominate the teammate who shipped, saved, and showed up. The jury reads every word.',
    cta: 'Nominate someone',
  },
  {
    key: 'jury',
    img: '/img2.jpg',
    title: 'Jury Dashboard',
    headline: 'Your jury ballot is half-cast',
    blurb: 'Round 1 voting is underway — your ballot locks Nov 14, 5 PM IST.',
    cta: 'Cast your vote',
  },
]
