export type ValueKey = 'customerFirst' | 'innovation' | 'collaboration' | 'ownership' | 'winningMindset'

export const CORE_VALUES: Record<ValueKey, { label: string; ink: string; soft: string; solid: string }> = {
  customerFirst: { label: 'Customer First', ink: 'text-value-cf', soft: 'bg-value-cf-soft', solid: '#0fa3a3' },
  innovation: { label: 'Innovation', ink: 'text-value-in', soft: 'bg-value-in-soft', solid: '#7a5af8' },
  collaboration: { label: 'Collaboration', ink: 'text-value-co', soft: 'bg-value-co-soft', solid: '#3898ff' },
  ownership: { label: 'Ownership', ink: 'text-value-ow', soft: 'bg-value-ow-soft', solid: '#ff8938' },
  winningMindset: { label: 'Winning Mindset', ink: 'text-value-wm', soft: 'bg-value-wm-soft', solid: '#ff5a5f' },
}
export const VALUE_KEYS = Object.keys(CORE_VALUES) as ValueKey[]

/* Per-value recognition templates. `urls` holds 6 banner variants (1100x314): 3 people-photo banners followed by 3 illustration banners — rendered h-auto at native ratio. The composer prepends the recipient's first name to prefill when one is selected. */
export type PraiseTemplate = { id: string; name: string; emoji: string; urls: string[]; dark?: boolean; prefill?: string }

export const VALUE_TEMPLATES: Record<ValueKey, PraiseTemplate[]> = {
  customerFirst: [
    { id: 'cf-star', name: 'Service Star', emoji: '⭐',
      urls: [
        '/xoxo/customer_first_01.jpg', '/xoxo/customer_first_02.jpg', '/xoxo/customer_first_03.jpg',
        '/xoxo/customer_first_illu_01.jpg', '/xoxo/customer_first_illu_02.jpg', '/xoxo/customer_first_illu_03.jpg',
      ],
      prefill: 'Thank you for putting the client first this week — every request you took got a quick, clear reply.' },
  ],
  innovation: [
    { id: 'in-spark', name: 'Fresh Spark', emoji: '💡',
      urls: [
        '/xoxo/innovation_01.jpg', '/xoxo/innovation_02.jpg', '/xoxo/innovation_03.jpg',
        '/xoxo/innovation_illu_01.jpg', '/xoxo/innovation_illu_02.jpg', '/xoxo/innovation_illu_03.jpg',
      ],
      prefill: 'The simpler way you found is saving all of us real time now — great catch, and thank you.' },
  ],
  collaboration: [
    { id: 'co-team', name: 'One Team', emoji: '🤝',
      urls: [
        '/xoxo/collaboration_01.jpg', '/xoxo/collaboration_02.jpg', '/xoxo/collaboration_03.jpg',
        '/xoxo/collaboration_illu_01.jpg', '/xoxo/collaboration_illu_02.jpg', '/xoxo/collaboration_illu_03.jpg',
      ],
      prefill: 'Thanks for jumping in to help another team this week — we all noticed, and they did too.' },
  ],
  ownership: [
    { id: 'ow-done', name: 'Done & Done', emoji: '✅',
      urls: [
        '/xoxo/ownership_01.jpg', '/xoxo/ownership_02.jpg', '/xoxo/ownership_03.jpg',
        '/xoxo/ownership_illu_01.jpg', '/xoxo/ownership_illu_02.jpg', '/xoxo/ownership_illu_03.jpg',
      ],
      prefill: 'Nobody wanted that job — you took it, finished it well, and never needed reminders. Thank you.' },
  ],
  winningMindset: [
    { id: 'wm-champion', name: "Champion's Push", emoji: '🔥',
      urls: [
        '/xoxo/winning_mindset_01.jpg', '/xoxo/winning_mindset_02.jpg', '/xoxo/winning_mindset_03.jpg',
        '/xoxo/winning_mindset_illu_01.jpg', '/xoxo/winning_mindset_illu_02.jpg', '/xoxo/winning_mindset_illu_03.jpg',
      ],
      prefill: 'Rough week, and you still kept everyone moving — you made the hard part look easy. Thank you.' },
  ],
}

export type Person = {
  id: string
  name: string
  email: string
  title: string
  dept: string
  office: string
  managerId?: string
  tenure: string
  joined: string
  badges: string[]
  status: 'online' | 'offline'
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const PEOPLE: Record<string, Person> = {
  me: { id: 'me', name: 'Ayan', email: 'ayan@emids.com', title: 'Senior Engineering Manager', dept: 'Data Engineering', office: 'Bengaluru', tenure: '6 yrs · joined Jul 2020', joined: 'Jul 2020', badges: ['Value Champion ×3', 'Top Giver — Q1', '5-Year Milestone'], status: 'online' },
  p1: { id: 'p1', name: 'Aarav Sharma', email: 'aarav.sharma@emids.com', title: 'Data Engineer II', dept: 'Data Engineering', office: 'Bengaluru', managerId: 'me', tenure: '2 yrs', joined: 'Jun 2024', badges: ['Spotlight Star'], status: 'online' },
  p2: { id: 'p2', name: 'Daniel Cho', email: 'daniel.cho@emids.com', title: 'Principal Engineer', dept: 'Data Engineering', office: 'Chicago', managerId: 'me', tenure: '7 yrs', joined: 'Mar 2019', badges: ['Architect Award', 'EoQ Winner — Innovator'], status: 'offline' },
  p3: { id: 'p3', name: 'Priya Menon', email: 'priya.menon@emids.com', title: 'Analytics Lead', dept: 'Analytics', office: 'Kochi', managerId: 'me', tenure: '4 yrs', joined: 'Apr 2022', badges: ['Customer Hero', 'Value Champion ×2'], status: 'online' },
  p4: { id: 'p4', name: 'Rohan Patel', email: 'rohan.patel@emids.com', title: 'Platform Engineer', dept: 'Data Engineering', office: 'Pune', managerId: 'me', tenure: '1.5 yrs', joined: 'Feb 2025', badges: [], status: 'online' },
  p5: { id: 'p5', name: 'Sofia Reyes', email: 'sofia.reyes@emids.com', title: 'QA Specialist', dept: 'Quality', office: 'Chicago', managerId: 'me', tenure: '3 yrs', joined: 'Nov 2023', badges: ['Quality Sentinel'], status: 'offline' },
  p6: { id: 'p6', name: 'Kenji Watanabe', email: 'kenji.watanabe@emids.com', title: 'Data Scientist', dept: 'Analytics', office: 'Bengaluru', managerId: 'me', tenure: '2 yrs', joined: 'Sep 2024', badges: [], status: 'online' },
  p7: { id: 'p7', name: 'Emily Tran', email: 'emily.tran@emids.com', title: 'Product Designer', dept: 'Design', office: 'Chicago', managerId: 'vp', tenure: '5 yrs', joined: 'Aug 2021', badges: ['Design Craft', 'EoQ Winner — Customer Champion'], status: 'online' },
  p8: { id: 'p8', name: 'Vikram Rao', email: 'vikram.rao@emids.com', title: 'Delivery Director', dept: 'Delivery', office: 'Bengaluru', managerId: 'vp', tenure: '8 yrs', joined: 'May 2018', badges: ['Client Champion ×4'], status: 'offline' },
  ceo: { id: 'ceo', name: 'Anand Desai', email: 'anand.desai@emids.com', title: 'Chief Executive Officer', dept: 'Executive', office: 'Chicago', tenure: '10 yrs', joined: 'Mar 2016', badges: ['Company Builder'], status: 'offline' },
  vp: { id: 'vp', name: 'Kavita Nair', email: 'kavita.nair@emids.com', title: 'VP Engineering', dept: 'Data Engineering', office: 'Bengaluru', managerId: 'ceo', tenure: '9 yrs', joined: 'Jan 2017', badges: ['Leader Spotlight', 'Top Giver — Q2'], status: 'online' },
  cto: { id: 'cto', name: 'Grace Liu', email: 'grace.liu@emids.com', title: 'Chief Technology Officer', dept: 'Executive', office: 'Chicago', managerId: 'ceo', tenure: '7 yrs', joined: 'Oct 2019', badges: ['Architect Award'], status: 'online' },
  p9: { id: 'p9', name: 'Sanjay Kumar', email: 'sanjay.kumar@emids.com', title: 'Data Engineer I', dept: 'Data Engineering', office: 'Pune', managerId: 'me', tenure: '10 mo', joined: 'Dec 2025', badges: [], status: 'offline' },
  p10: { id: 'p10', name: 'Nia Thomas', email: 'nia.thomas@emids.com', title: 'Sr. Analyst', dept: 'Analytics', office: 'Kochi', managerId: 'me', tenure: '3 yrs', joined: 'Jan 2023', badges: ['Spotlight Star', 'Value Champion'], status: 'online' },
  p11: { id: 'p11', name: 'David Park', email: 'david.park@emids.com', title: 'Cloud Architect', dept: 'Data Engineering', office: 'Chicago', managerId: 'vp', tenure: '5 yrs', joined: 'Feb 2021', badges: ['Cloud Craft'], status: 'offline' },
  p12: { id: 'p12', name: 'Anjali Gupta', email: 'anjali.gupta@emids.com', title: 'EA, Engineering', dept: 'Operations', office: 'Bengaluru', managerId: 'vp', tenure: '2 yrs', joined: 'Jul 2024', badges: [], status: 'online' },
  p13: { id: 'p13', name: 'Ishaan Verma', email: 'ishaan.verma@emids.com', title: 'Cloud Engineer II', dept: 'Data Engineering', office: 'Pune', managerId: 'me', tenure: '1 yr', joined: 'Aug 2025', badges: [], status: 'online' },
  p14: { id: 'p14', name: 'Grace Mathew', email: 'grace.mathew@emids.com', title: 'QA Lead', dept: 'Quality', office: 'Kochi', managerId: 'me', tenure: '2 yrs', joined: 'May 2024', badges: [], status: 'offline' },
}
export const PEOPLE_LIST = Object.values(PEOPLE)
export const person = (id: string): Person => PEOPLE[id] ?? PEOPLE.me

/* Registers a recipient typed as a bare email address (not in the directory) and returns their persona. */
export function ensurePersonFromEmail(email: string): Person {
  const normalized = email.trim().toLowerCase()
  const existing = PEOPLE_LIST.find((p) => p.email === normalized)
  if (existing) return existing
  const id = 'ext-' + normalized.replace(/[^a-z0-9]/g, '-')
  if (PEOPLE[id]) return PEOPLE[id]
  const label = normalized.split('@')[0].split(/[._-]/).filter(Boolean)[0] ?? 'guest'
  const created: Person = {
    id,
    name: label.charAt(0).toUpperCase() + label.slice(1),
    email: normalized,
    title: 'External recipient',
    dept: 'External',
    office: '—',
    tenure: '—',
    joined: '—',
    badges: [],
    status: 'offline',
  }
  PEOPLE[id] = created
  return created
}

export const fmtName = (p: Person) => p.name
export const initials = (name: string) => name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()

export type ReactionKey = 'clap' | 'celebrate' | 'heart' | 'highfive' | 'insight'
export const REACTIONS: { key: ReactionKey; label: string; icon: string }[] = [
  { key: 'clap', label: 'Applause', icon: '👏' },
  { key: 'celebrate', label: 'Celebrate', icon: '🎉' },
  { key: 'heart', label: 'Love', icon: '❤️' },
  { key: 'highfive', label: 'High five', icon: '🙌' },
  { key: 'insight', label: 'Insightful', icon: '💡' },
]

export type Comment = { id: string; fromId: string; text: string; when: string }

export type Post = {
  id: string
  kind: 'praise' | 'award' | 'milestone' | 'welcome'
  awardLabel?: string
  fromId: string
  toIds: string[]
  valueKey?: ValueKey
  tpl?: string
  message: string
  points?: number
  when: string
  comments: Comment[]
  counts: Partial<Record<ReactionKey, number>>
  myReaction?: ReactionKey
}

export const POSTS: Post[] = [
  {
    id: 'q1', kind: 'praise', fromId: 'p2', toIds: ['p1'], valueKey: 'ownership', points: 50, when: '2 h ago',
    message: "Aarav jumped on the payer-claims pipeline outage at 6 AM, traced it to the schema drift in the eligibility feed, and shipped the fix before standup. The CVS account never noticed. That is what ownership looks like.",
    comments: [
      { id: 'c1', fromId: 'p3', text: 'Legend. That feed is a nightmare on a good day.', when: '1 h ago' },
    ],
    counts: { clap: 24, celebrate: 9, heart: 7, highfive: 4, insight: 2 },
  },
  {
    id: 'q2', kind: 'award', awardLabel: 'Innovator of Q3', fromId: 'vp', toIds: ['p2'], valueKey: 'innovation', points: 2000, when: 'Yesterday',
    message: "Daniel built the LLQ eval harness that halved our release validation time from 4 hours to 40 minutes. Jury vote was unanimous.",
    comments: [
      { id: 'c2', fromId: 'me', text: 'So deserved — the harness is a thing of beauty.', when: '20 h ago' },
      { id: 'c3', fromId: 'p10', text: 'Congrats Daniel! 🏆', when: '18 h ago' },
    ],
    counts: { celebrate: 41, clap: 18, heart: 12, highfive: 8, insight: 1 },
  },
  {
    id: 'q3', kind: 'praise', fromId: 'p5', toIds: ['p6'], valueKey: 'customerFirst', points: 25, when: 'Yesterday',
    message: "Kenji's anomaly report on readmission-risk drift gave the client team a week of head start on model revalidation. Made us look proactive instead of reactive.",
    comments: [],
    counts: { heart: 11, insight: 6, clap: 5, highfive: 2, celebrate: 0 },
  },
  {
    id: 'q4', kind: 'praise', fromId: 'me', toIds: ['p10'], valueKey: 'collaboration', when: '2 d ago',
    message: "Nia sat with the QA squad for two sprints and turned their tribal knowledge into runbooks the whole pod now uses. Cross-team glue never shows in velocity, but everyone feels it.",
    comments: [
      { id: 'c4', fromId: 'p4', text: 'Those runbooks saved my week.', when: '1 d ago' },
    ],
    counts: { clap: 16, heart: 9, highfive: 5, celebrate: 2, insight: 3 },
  },
  {
    id: 'q5', kind: 'milestone', fromId: 'vp', toIds: ['p8'], when: '3 d ago',
    message: "Vikram completes 8 years at emids. From a two-client portfolio to owning delivery for our largest strategic account — happy milestone, Vikram!",
    comments: [
      { id: 'c5', fromId: 'p7', text: '8 years! The account legend himself.', when: '2 d ago' },
    ],
    counts: { celebrate: 33, heart: 15, clap: 12, highfive: 9, insight: 0 },
  },
  {
    id: 'q6', kind: 'praise', fromId: 'p4', toIds: ['p5'], valueKey: 'winningMindset', points: 25, when: '4 d ago',
    message: "Sofia caught the race condition in the eligibility batch just before the release freeze window and wrote the repro test so it never slips through again.",
    comments: [],
    counts: { clap: 14, heart: 6, highfive: 4, celebrate: 1, insight: 1 },
  },
  {
    id: 'q7', kind: 'welcome', fromId: 'me', toIds: ['p9'], when: '1 w ago',
    message: "Please join me in welcoming Sanjay to the Data pod! He has already picked up the census pipeline and his first PR review was sharp. Give him a follow and say hello.",
    comments: [],
    counts: { heart: 10, celebrate: 8, clap: 7, highfive: 3, insight: 0 },
  },
  {
    id: 'q8', kind: 'praise', fromId: 'p12', toIds: ['p11'], valueKey: 'ownership', points: 25, when: '1 w ago',
    message: "David reworked the environment onboarding so a new joiner gets a working stack in one day instead of one week. Onboarding NPS went from 31 to 78.",
    comments: [],
    counts: { clap: 21, insight: 8, heart: 4, celebrate: 2, highfive: 2 },
  },
]

export type LedgerEntry = { id: string; label: string; kind: 'award' | 'redemption' | 'grant' | 'earning'; amount: number; when: string }

export const LEDGER: LedgerEntry[] = [
  { id: 'l1', label: 'EoQ payout — Top Giver, Q3', kind: 'award', amount: 2000, when: 'Sep 30' },
  { id: 'l2', label: 'Manager grant — onboarding runbook', kind: 'grant', amount: 100, when: 'Sep 12' },
  { id: 'l3', label: 'Weekly earning streak — 4 kudos sent', kind: 'earning', amount: 40, when: 'Sep 08' },
  { id: 'l4', label: 'Redemption — Amazon Pay ₹1,000', kind: 'redemption', amount: -950, when: 'Aug 28' },
  { id: 'l5', label: 'Recognized your teammate streak', kind: 'earning', amount: 30, when: 'Aug 25' },
  { id: 'l6', label: 'EoQ jury bonus — participation', kind: 'award', amount: 150, when: 'Aug 15' },
  { id: 'l7', label: 'Redemption — Starbucks ₹250', kind: 'redemption', amount: -220, when: 'Aug 02' },
  { id: 'l8', label: 'Milestone — 5-year tenure award', kind: 'award', amount: 500, when: 'Jul 21' },
]

export type ApprovalItem = {
  id: string
  kind: 'points-approval' | 'nomination-endorsement' | 'high-value-redemption'
  fromId: string
  points?: number
  when: string
  title: string
  detail: string
  valueKey?: ValueKey
  policy: { verdict: 'pass' | 'flag'; notes: string[] }
  route: { step: string; owner: string; done: boolean }[]
  budget: string
}

export const PENDING_APPROVALS: ApprovalItem[] = [
  {
    id: 'a1', kind: 'points-approval', fromId: 'p4', points: 100, when: '3 h ago',
    title: 'Rohan wants to award +100 pts to Sofia Reyes',
    detail: '"Sofia caught the race condition before the freeze and wrote the repro test so it never slips again."',
    valueKey: 'winningMindset',
    policy: { verdict: 'pass', notes: ['Write-up quality: specific and factual', 'Within per-person monthly limit (100/150)'] },
    route: [
      { step: 'Direct manager (you)', owner: 'Ayan', done: false },
      { step: 'Cost-centre head', owner: 'Kavita Nair', done: false },
    ],
    budget: 'Uses 100 of your 945 pts remaining team pool',
  },
  {
    id: 'a2', kind: 'nomination-endorsement', fromId: 'p3', when: '6 h ago',
    title: 'Priya nominated Nia Thomas for Customer Champion',
    detail: 'Nia led the payer-portal redesign analytics and drove a 12-point CSAT jump for the CVS account. Client PM named her individually in the QBR.',
    valueKey: 'customerFirst',
    policy: { verdict: 'pass', notes: ['Client-attributable outcome present', 'Not a prior winner this fiscal (rule ok)'] },
    route: [
      { step: 'Manager endorsement (you)', owner: 'Ayan', done: false },
      { step: 'Jury review', owner: 'EoQ panel', done: false },
    ],
    budget: 'Nominations cost nothing — jury decides points',
  },
  {
    id: 'a3', kind: 'points-approval', fromId: 'p9', points: 250, when: '1 d ago',
    title: 'Sanjay wants to award +250 pts to Kenji Watanabe',
    detail: '"Kenji rebuilt the drift monitor overnight before demos."',
    valueKey: 'innovation',
    policy: { verdict: 'flag', notes: ['Exceeds single-gift cap of 100 for IC givers', 'Write-up is short — specificity score 38/100', 'Suggested: reduce to 100 pts or add named outcomes'] },
    route: [
      { step: 'Direct manager (you)', owner: 'Ayan', done: false },
      { step: 'Finance (≥ 200 pts)', owner: 'Anjali Gupta', done: false },
    ],
    budget: 'Uses 250 of your 945 pts remaining team pool',
  },
  {
    id: 'a4', kind: 'high-value-redemption', fromId: 'p2', points: 1850, when: '2 d ago',
    title: 'Daniel redeemed MakeMyTrip ₹2,000 voucher',
    detail: 'High-value redemption routed to you per finance policy (≥ ₹1,500).',
    policy: { verdict: 'pass', notes: ['Balance earned legitimately (4,120 pts lifetime)', 'No velocity anomaly detected'] },
    route: [
      { step: 'Manager ack (you)', owner: 'Ayan', done: true },
      { step: 'Finance release', owner: 'Anjali Gupta', done: false },
    ],
    budget: 'No impact — redemption ledger',
  },
]

export type TeamMemberStat = { id: string; given: number; received: number; lastRecognized: string; valuesTop: ValueKey }
export type TeamId = 'humana' | 'dev'

export const TEAMS: { id: TeamId; name: string }[] = [
  { id: 'humana', name: 'Humana Team' },
  { id: 'dev', name: 'Development Team' },
]

export const TEAM_STATS: Record<TeamId, TeamMemberStat[]> = {
  humana: [  { id: 'p1', given: 14, received: 9, lastRecognized: 'Today', valuesTop: 'ownership' },
  { id: 'p3', given: 11, received: 12, lastRecognized: 'Yesterday', valuesTop: 'customerFirst' },
  { id: 'p10', given: 9, received: 8, lastRecognized: '2 d ago', valuesTop: 'collaboration' },
  { id: 'p5', given: 8, received: 10, lastRecognized: '3 d ago', valuesTop: 'winningMindset' },
  { id: 'p6', given: 6, received: 14, lastRecognized: 'Yesterday', valuesTop: 'customerFirst' },
  { id: 'p2', given: 7, received: 17, lastRecognized: 'Today', valuesTop: 'innovation' },
  { id: 'p9', given: 0, received: 2, lastRecognized: '— 21 days', valuesTop: 'collaboration' },
  { id: 'p4', given: 3, received: 4, lastRecognized: '— 16 days', valuesTop: 'ownership' },
  ],
  dev: [
    { id: 'p7', given: 10, received: 13, lastRecognized: 'Today', valuesTop: 'customerFirst' },
    { id: 'p11', given: 4, received: 9, lastRecognized: '3 d ago', valuesTop: 'ownership' },
    { id: 'p12', given: 2, received: 3, lastRecognized: '6 d ago', valuesTop: 'winningMindset' },
    { id: 'p13', given: 5, received: 6, lastRecognized: '2 d ago', valuesTop: 'innovation' },
    { id: 'p14', given: 7, received: 5, lastRecognized: '5 d ago', valuesTop: 'collaboration' },
  ],
}

export type LeaderRow = { id: string; pts: number }

// Peer points received this quarter — EoQ prize payouts not included
export const TEAM_LEADERBOARD: LeaderRow[] = [
  { id: 'p2', pts: 420 },
  { id: 'me', pts: 380 },
  { id: 'p1', pts: 275 },
  { id: 'p3', pts: 250 },
  { id: 'p6', pts: 220 },
  { id: 'p10', pts: 190 },
  { id: 'p5', pts: 160 },
  { id: 'p4', pts: 90 },
  { id: 'p9', pts: 25 },
]

export type AwardCategory = {
  id: string; name: string; base: ValueKey; desc: string
  status: 'open' | 'voting' | 'announced'; nomCount: number; prize: number
  closes: string
}

export const AWARD_CATEGORIES: AwardCategory[] = [
  { id: 'cc', name: 'Customer Champion', base: 'customerFirst', desc: 'For work that made the customer visibly better off — measured, attested, real.', status: 'voting', nomCount: 12, prize: 2000, closes: 'Voting underway' },
  { id: 'in', name: 'Innovator', base: 'innovation', desc: 'New ways of solving old problems. Automation, tooling, process reinvention.', status: 'open', nomCount: 9, prize: 2000, closes: 'Oct 31' },
  { id: 'tp', name: 'Team Player', base: 'collaboration', desc: 'The glue. Cross-team help, mentoring, knowledge-sharing that scales.', status: 'open', nomCount: 14, prize: 2000, closes: 'Oct 31' },
  { id: 'rs', name: 'Rising Star', base: 'ownership', desc: 'Tenured under 18 months, already operating a level above.', status: 'open', nomCount: 6, prize: 1500, closes: 'Oct 31' },
]

export type MyNomination = { id: string; categories: string; nomId: string; status: 'submitted' | 'endorsed' | 'jury' | 'result'; result?: string }

export const MY_NOMINATIONS: MyNomination[] = [
  { id: 'n1', categories: 'Team Player', nomId: 'p7', status: 'result', result: 'Winner — announced Sep 30' },
  { id: 'n2', categories: 'Innovator', nomId: 'p6', status: 'endorsed' },
]

export type JuryNominee = {
  id: string; categories: string; nomId: string; nomBy: string
  brief: string; flags: string[]; score: number; votes: number
}

export const JURY_NOMINEES: JuryNominee[] = [
  { id: 'j1', categories: 'Customer Champion', nomId: 'p3', nomBy: 'Priya Menon', brief: 'Drove the payer-portal analytics revamp, lifting CSAT 12 points in one quarter. Counted client reference-ability, not just effort.', flags: [], score: 4, votes: 3 },
  { id: 'j2', categories: 'Customer Champion', nomId: 'p8', nomBy: 'Anjali Gupta', brief: 'Turned around a failing go-live with a recovery plan the client now calls their playbook. Delivery metrics returned to green in 5 weeks.', flags: ['Prior winner — FY24'], score: 5, votes: 4 },
  { id: 'j3', categories: 'Innovator', nomId: 'p2', nomBy: 'Daniel Cho', brief: 'Halved release validation time with an eval harness now adopted by two other pods. Clear, measurable, replicable innovation.', flags: [], score: 5, votes: 5 },
  { id: 'j4', categories: 'Innovator', nomId: 'p9', nomBy: 'Rohan Patel', brief: 'Rebuilt drift monitoring before a major demo; however, evidence is thin on adoption beyond the pod.', flags: ['Self-nominated by peer', 'Low evidence'], score: 2, votes: 1 },
  { id: 'j5', categories: 'Team Player', nomId: 'p5', nomBy: 'Sofia Reyes', brief: 'Kept three codebases release-ready simultaneously while documenting tribal knowledge into a shared QA playbook.', flags: [], score: 4, votes: 2 },
  { id: 'j6', categories: 'Team Player', nomId: 'p11', nomBy: 'David Park', brief: 'Mentored the environment onboarding redesign; repeatedly unblocks other pods without being asked.', flags: [], score: 4, votes: 3 },
  { id: 'j7', categories: 'Rising Star', nomId: 'p1', nomBy: 'Rohan Patel', brief: 'Jumped on the eligibility feed at 6 AM and stabilised it within one week of a major client demo — operating well above tenure.', flags: [], score: 5, votes: 4 },
]

export type Notification = { id: string; group: 'praise' | 'approval' | 'window' | 'milestone'; title: string; sub: string; when: string; unread: boolean; go?: 'team' | 'awards' | 'home' }

export const NOTIFICATIONS: Notification[] = [
  { id: 'nt1', group: 'approval', title: 'Approval pending — Rohan → Sofia +100 pts', sub: 'Needs budget confirmation', when: '3 h ago', unread: true, go: 'team' },
  { id: 'nt2', group: 'approval', title: 'Nomination endorsement — Nia Thomas', sub: 'Jury review next', when: '6 h ago', unread: true, go: 'team' },
  { id: 'nt3', group: 'praise', title: 'Daniel Cho praised your runbook work', sub: '+ Team Player react by 9 others', when: '1 d ago', unread: true, go: 'home' },
  { id: 'nt4', group: 'window', title: 'EoQ nominations close Oct 31', sub: '4 categories are open', when: '2 d ago', unread: false, go: 'awards' },
  { id: 'nt5', group: 'milestone', title: "Vikram's 8-year anniversary today", sub: 'Say Congrats on the feed', when: '3 d ago', unread: false, go: 'home' },
  { id: 'nt6', group: 'praise', title: 'You appeared in 3 recognitions this week', sub: 'Weekly digest', when: '4 d ago', unread: false, go: 'home' },
]

export type Modalities = { week: string; personId: string; type: string }

export const ORG_STATS = { recognitions: 279 }

export const DASH_STATS = {
  given: 14,
  got: 9,
}

export const MILESTONES: Modalities[] = [
  { week: 'Today', personId: 'p8', type: '8-year work anniversary' },
  { week: 'Tomorrow', personId: 'p7', type: '5-year work anniversary' },
  { week: 'Fri', personId: 'p3', type: 'Birthday' },
  { week: 'Next Mon', personId: 'p11', type: '4-year work anniversary' },
]

export const TOP_VALUES = [
  { key: 'customerFirst' as ValueKey, count: 86 },
  { key: 'collaboration' as ValueKey, count: 71 },
  { key: 'ownership' as ValueKey, count: 52 },
  { key: 'innovation' as ValueKey, count: 41 },
  { key: 'winningMindset' as ValueKey, count: 29 },
]

export type TreeNode = { id: string; children?: TreeNode[] }

export const ORG_TREE: TreeNode = {
  id: 'ceo',
  children: [
    { id: 'cto', children: [
      { id: 'vp', children: [
        { id: 'p11' }, { id: 'p12' },
        { id: 'me', children: [ { id: 'p1' }, { id: 'p2' }, { id: 'p3' }, { id: 'p4' }, { id: 'p5' }, { id: 'p6' }, { id: 'p9' }, { id: 'p10' }, { id: 'p13' }, { id: 'p14' } ] },
      ] },
    ] },
    { id: 'p8' },
  ],
}

export const RECOGNITION_HEAT: Record<string, number> = { ceo: 12, cto: 9, vp: 31, me: 44, p1: 18, p2: 29, p3: 21, p4: 5, p5: 14, p6: 19, p9: 2, p10: 15, p11: 8, p12: 4, p8: 16, p7: 11, p13: 3, p14: 4 }

export const AI_PROMPTS = [
  'Draft a nomination for Daniel Cho — Innovator',
  "Who on my team hasn't been recognized this quarter?",
  'Check policy for a +250 pt award',
  "Summarize my team's recognition health",
]
