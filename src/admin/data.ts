/* Admin portal mock data — shaped like the future backend API would return.
   Kept separate from src/data.ts so the employee dataset stays untouched. */

/* ------------------------------ Program admin ------------------------------ */

export type BannerAudience = 'all' | 'humana' | 'pacca'

export interface AdminBanner {
  id: string
  title: string
  message: string
  audience: BannerAudience
  active: boolean
  ends: string
  /** Optional image shown beside the strip (path to a public asset or any URL). */
  media?: string
}

export const MEDIA_ASSETS = ['/img1.png', '/img2.jpg', '/emids-hero.webp', '/Cute%20astronaut%20operating%20laptop.gif', '/Nice%20rabbit%20with%20balloon.gif']

export const ADMIN_BANNERS: AdminBanner[] = [
  { id: 'bn1', title: 'Q4 EoQ window open', message: 'Nominations for the Endeavour of the Quarter are open until Mar 31 — nominate the teammate who made the difference.', audience: 'all', active: true, ends: 'Mar 31' },
  { id: 'bn2', title: 'Humana leads participation', message: 'Humana leads participation this month at 92%. The target for every team is 85%.', audience: 'humana', active: true, ends: 'Mar 15' },
  { id: 'bn3', title: 'PACCA AI all-hands', message: 'Tuesday all-hands: the recognition dashboard goes org-wide.', audience: 'pacca', active: false, ends: 'Feb 28' },
]

export interface AwardCap {
  id: string
  category: string
  /** Max nominations one person can file in the window. */
  maxNominations: number
  /** Max points attachable to a single award nomination. */
  maxPoints: number
  window: string
}

export const AWARD_CAPS: AwardCap[] = [
  { id: 'cap1', category: 'Customer Champion', maxNominations: 3, maxPoints: 250, window: 'FY26 · Q4' },
  { id: 'cap2', category: 'Innovator', maxNominations: 2, maxPoints: 300, window: 'FY26 · Q4' },
  { id: 'cap3', category: 'Team Player', maxNominations: 3, maxPoints: 200, window: 'FY26 · Q4' },
  { id: 'cap4', category: 'Rising Star', maxNominations: 1, maxPoints: 150, window: 'FY26 · Q4' },
]

export type AwardPhase = 'nominations' | 'voting' | 'results'

export interface AwardWindowState {
  phase: AwardPhase
  quarter: string
  nominationsEnd: string
  votingEnd: string
}

export const AWARD_WINDOW: AwardWindowState = {
  phase: 'nominations',
  quarter: 'FY26 · Q4',
  nominationsEnd: 'Mar 31',
  votingEnd: 'Apr 21',
}

export const PHASE_LABEL: Record<AwardPhase, string> = {
  nominations: 'Nominations open',
  voting: 'Jury voting',
  results: 'Winners announced',
}

export interface RecognitionRules {
  /** Points a single praise can carry. */
  maxPointsPerPraise: number
  /** Praises at or below this many points skip manager review. */
  autoApproveBelow: number
  /** Unspent grid points lapse after this many months. */
  pointsExpiryMonths: number
}

export const RECOGNITION_RULES: RecognitionRules = {
  maxPointsPerPraise: 100,
  autoApproveBelow: 50,
  pointsExpiryMonths: 12,
}

/* ------------------------------ People directory ------------------------------ */

export type DirectoryStatus = 'active' | 'onleave' | 'paused'

export interface DirectoryPersonEntry {
  id: string
  status: DirectoryStatus
  /** Person can give (and receive) recognition. */
  eligible: boolean
}

export const DIRECTORY: Record<string, DirectoryPersonEntry> = {
  me: { id: 'me', status: 'active', eligible: true },
  p1: { id: 'p1', status: 'active', eligible: true },
  p2: { id: 'p2', status: 'active', eligible: true },
  p3: { id: 'p3', status: 'active', eligible: true },
  p4: { id: 'p4', status: 'onleave', eligible: false },
  p5: { id: 'p5', status: 'active', eligible: true },
  p6: { id: 'p6', status: 'active', eligible: true },
  p7: { id: 'p7', status: 'active', eligible: true },
  p8: { id: 'p8', status: 'paused', eligible: false },
  p9: { id: 'p9', status: 'active', eligible: true },
  p10: { id: 'p10', status: 'active', eligible: true },
  p11: { id: 'p11', status: 'active', eligible: true },
  p12: { id: 'p12', status: 'active', eligible: true },
  p13: { id: 'p13', status: 'active', eligible: true },
  p14: { id: 'p14', status: 'active', eligible: true },
  vp: { id: 'vp', status: 'active', eligible: true },
  cto: { id: 'cto', status: 'active', eligible: true },
  ceo: { id: 'ceo', status: 'active', eligible: true },
}

/* ------------------------------ Milestones & celebrations ------------------------------ */

export interface MilestoneRule {
  id: string
  label: string
  trigger: 'anniversary' | 'birthday'
  detail: string
  /** Points auto-topped up on the moment. */
  points: number
  active: boolean
}

export const MILESTONE_RULES: MilestoneRule[] = [
  { id: 'ms1', label: 'Work anniversary — 1 year', trigger: 'anniversary', detail: 'Posts to feed', points: 100, active: true },
  { id: 'ms2', label: 'Work anniversary — 3 years', trigger: 'anniversary', detail: 'Posts to feed + auto banner', points: 250, active: true },
  { id: 'ms3', label: 'Work anniversary — 5 years', trigger: 'anniversary', detail: 'Posts to feed + award', points: 500, active: true },
  { id: 'ms4', label: 'Birthday', trigger: 'birthday', detail: 'Posts to feed', points: 50, active: false },
]

/* ------------------------------ Notifications ------------------------------ */

export interface NotificationSetting {
  id: string
  label: string
  detail: string
  on: boolean
}

export const NOTIF_SETTINGS: NotificationSetting[] = [
  { id: 'nf1', label: 'Milestone posts to feed', detail: 'Auto-celebrations appear on the dashboard feed', on: true },
  { id: 'nf2', label: 'Instant email on award received', detail: 'Sent when points or vouchers hit an employee', on: true },
  { id: 'nf3', label: 'Manager weekly digest', detail: 'Monday morning summary per people manager', on: true },
  { id: 'nf4', label: 'Team channel nudges (Slack)', detail: 'Echoes recognitions to the org channel', on: false },
]

/* ------------------------------ Integrations ------------------------------ */

export interface IntegrationStatus {
  id: string
  name: string
  kind: string
  state: 'connected' | 'degraded'
  lastSync: string
  note: string
}

export const INTEGRATIONS: IntegrationStatus[] = [
  { id: 'int1', name: 'Entra ID (SSO)', kind: 'Identity', state: 'connected', lastSync: '12 min ago', note: '6 records updated in last sync' },
  { id: 'int2', name: 'Workday HRIS', kind: 'People sync', state: 'degraded', lastSync: '26 hours ago', note: '2 records in the exception queue' },
  { id: 'int3', name: 'Slack', kind: 'Messaging', state: 'connected', lastSync: '5 min ago', note: 'Echoes kudos to #recognition' },
  { id: 'int4', name: 'Email relay', kind: 'Notifications', state: 'connected', lastSync: '2 hours ago', note: 'Instant + digest delivery' },
]

/* ------------------------------ Scheduled exports ------------------------------ */

export interface ScheduledExport {
  id: string
  report: string
  details: string
  format: 'CSV'
  nextRun: string
  recipients: string
}

export const SCHEDULED_EXPORTS: ScheduledExport[] = [
  { id: 'ex1', report: 'Points ledger', details: 'All issuances, redemptions and credits', format: 'CSV', nextRun: 'Mon 9:00 AM', recipients: 'finance@emids.com' },
  { id: 'ex2', report: 'Budget utilization', details: 'Per-region pools, burn and runway', format: 'CSV', nextRun: 'Fri 6:00 PM', recipients: 'kavita@emids.com' },
  { id: 'ex3', report: 'Participation report', details: 'Givers %, receivers %, dormant teams', format: 'CSV', nextRun: '1st of month', recipients: 'hr@emids.com' },
]

/* ------------------------------ Finance admin ------------------------------ */

export interface VoucherType {
  id: string
  brand: string
  /** Denomination value, in ₹. */
  inr: number
  /** Points the recipient spends, 1 pt = ₹1. */
  points: number
}

export const VOUCHER_TYPES: VoucherType[] = [
  { id: 'amazon1k', brand: 'Amazon', inr: 1000, points: 1000 },
  { id: 'amazon2500', brand: 'Amazon', inr: 2500, points: 2500 },
  { id: 'swiggy500', brand: 'Swiggy', inr: 500, points: 500 },
  { id: 'cultfit1k', brand: 'Cult.fit', inr: 1000, points: 1000 },
  { id: 'zomato750', brand: 'Zomato', inr: 750, points: 750 },
  { id: 'uber1200', brand: 'Uber', inr: 1200, points: 1200 },
  { id: 'grubhub2500', brand: 'Grubhub', inr: 2500, points: 2500 },
]

export interface VoucherStockRow {
  typeId: string
  region: string
  stock: number
}

export const INITIAL_STOCK: VoucherStockRow[] = [
  { typeId: 'amazon1k', region: 'Bengaluru', stock: 24 },
  { typeId: 'amazon2500', region: 'Bengaluru', stock: 8 },
  { typeId: 'swiggy500', region: 'Bengaluru', stock: 40 },
  { typeId: 'amazon1k', region: 'Noida', stock: 16 },
  { typeId: 'cultfit1k', region: 'Noida', stock: 12 },
  { typeId: 'zomato750', region: 'Hyderabad', stock: 20 },
  { typeId: 'amazon2500', region: 'Hyderabad', stock: 10 },
  { typeId: 'uber1200', region: 'Tennessee', stock: 9 },
  { typeId: 'grubhub2500', region: 'Tennessee', stock: 6 },
]

/** Central wallet from which the finance team buys voucher stock. */
export interface ProcurementWallet {
  allocated: number
  spent: number
}

export const PROCUREMENT: ProcurementWallet = { allocated: 1200000, spent: 160800 }

export interface StockAllocation {
  id: string
  when: string
  typeId: string
  region: string
  qty: number
  cost: number
}

export const ALLOCATIONS: StockAllocation[] = [
  { id: 'al1', when: 'Mar 12', typeId: 'grubhub2500', region: 'Tennessee', qty: 6, cost: 15000 },
  { id: 'al2', when: 'Mar 12', typeId: 'uber1200', region: 'Tennessee', qty: 9, cost: 10800 },
  { id: 'al3', when: 'Mar 10', typeId: 'amazon2500', region: 'Hyderabad', qty: 10, cost: 20000 },
  { id: 'al4', when: 'Mar 10', typeId: 'zomato750', region: 'Hyderabad', qty: 20, cost: 15000 },
  { id: 'al5', when: 'Feb 26', typeId: 'swiggy500', region: 'Bengaluru', qty: 40, cost: 20000 },
  { id: 'al6', when: 'Feb 26', typeId: 'amazon2500', region: 'Bengaluru', qty: 8, cost: 20000 },
  { id: 'al7', when: 'Feb 26', typeId: 'amazon1k', region: 'Bengaluru', qty: 24, cost: 24000 },
  { id: 'al8', when: 'Feb 26', typeId: 'amazon1k', region: 'Noida', qty: 16, cost: 16000 },
  { id: 'al9', when: 'Feb 26', typeId: 'cultfit1k', region: 'Noida', qty: 12, cost: 12000 },
]

export interface RegionPool {
  region: string
  /** Voucher money allocated to the region for the quarter, in ₹. */
  allocated: number
  spent: number
  /** Average ₹ issued per week in this region */
  weeklyBurn: number
}

export const REGION_POOLS: RegionPool[] = [
  { region: 'Bengaluru', allocated: 250000, spent: 118400, weeklyBurn: 9200 },
  { region: 'Noida', allocated: 120000, spent: 42600, weeklyBurn: 3800 },
  { region: 'Hyderabad', allocated: 90000, spent: 27500, weeklyBurn: 2900 },
  { region: 'Tennessee', allocated: 180000, spent: 131200, weeklyBurn: 13600 },
]

export interface VoucherIssue {
  id: string
  when: string
  person: string
  region: string
  voucher: string
  points: number
}

export const ISSUE_LOG: VoucherIssue[] = [
  { id: 'i1', when: 'Mar 12', person: 'Daniel Cho', region: 'Tennessee', voucher: 'Amazon ₹2,500', points: 2500 },
  { id: 'i2', when: 'Mar 10', person: 'Emily Tran', region: 'Tennessee', voucher: 'Grubhub ₹2,500', points: 2500 },
  { id: 'i3', when: 'Mar 8', person: 'Aarav Sharma', region: 'Bengaluru', voucher: 'Amazon ₹1,000', points: 1000 },
]

/* ------------------------------ Claims & liability ------------------------------ */

export interface VoucherClaim {
  id: string
  when: string
  person: string
  region: string
  voucher: string
  points: number
  /** Employee-reported problem with the issued code. */
  issue: 'expired code' | 'already used' | 'delivery failed'
  status: 'open' | 'resolved'
}

export const CLAIMS: VoucherClaim[] = [
  { id: 'c1', when: 'Mar 11', person: 'Priya Menon', region: 'Noida', voucher: 'Cult.fit ₹1,000', points: 1000, issue: 'already used', status: 'open' },
  { id: 'c2', when: 'Mar 9', person: 'Rohan Patel', region: 'Hyderabad', voucher: 'Uber ₹1,200', points: 1200, issue: 'expired code', status: 'open' },
  { id: 'c3', when: 'Mar 4', person: 'Kenji Watanabe', region: 'Bengaluru', voucher: 'Swiggy ₹500', points: 500, issue: 'delivery failed', status: 'resolved' },
]

/** Points issued to employees but not yet redeemed — the balance-sheet liability. */
export const LIABILITY: { region: string; outstanding: number }[] = [
  { region: 'Bengaluru', outstanding: 14200 },
  { region: 'Noida', outstanding: 5100 },
  { region: 'Hyderabad', outstanding: 3800 },
  { region: 'Tennessee', outstanding: 12300 },
]

export const RECON_SUMMARY: { quarter: string; vouchersIssued: number; pointsRedeemed: number; outstanding: number } = {
  quarter: 'FY26 · Q4',
  vouchersIssued: 146100,
  pointsRedeemed: 319900,
  outstanding: 35400,
}

export interface PointAdjustment {
  id: string
  when: string
  person: string
  region: string
  kind: 'credit' | 'debit'
  points: number
  reason: string
}

export const ADJUSTMENTS: PointAdjustment[] = [
  { id: 'ad1', when: 'Mar 9', person: 'Sanjay Kumar', region: 'Hyderabad', kind: 'credit', points: 250, reason: 'EoQ winner payout correction' },
  { id: 'ad2', when: 'Mar 5', person: 'Nia Thomas', region: 'Noida', kind: 'debit', points: 150, reason: 'Duplicate praise payout reversal' },
]
