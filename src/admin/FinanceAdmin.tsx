import { useState } from 'react'
import type { ReactNode } from 'react'
import { Check, FileDown, Gift, History, Landmark, PackagePlus, RotateCcw, Wallet } from 'lucide-react'
import { PEOPLE_LIST, person } from '../data'
import { Btn, Card, Chip } from '../components/atoms'
import { ADJUSTMENTS, ALLOCATIONS, CLAIMS, ISSUE_LOG, LIABILITY, PROCUREMENT, RECON_SUMMARY, REGION_POOLS, VOUCHER_TYPES, INITIAL_STOCK, type PointAdjustment, type ProcurementWallet, type RegionPool, type StockAllocation, type VoucherClaim, type VoucherIssue, type VoucherStockRow } from './data'
import AdminShell from './AdminShell'

export interface FinanceAdminProps {
  onExit: () => void
}

type Tab = 'allocate' | 'vouchers' | 'budget' | 'claims' | 'adjust' | 'recon' | 'reports' | 'log'

const fmt = (n: number) => n.toLocaleString('en-IN')
const typeById = (id: string) => VOUCHER_TYPES.find((v) => v.id === id)
const REGIONS = ['Bengaluru', 'Noida', 'Hyderabad', 'Tennessee']

export default function FinanceAdmin({ onExit }: FinanceAdminProps) {
  const [tab, setTab] = useState<Tab>('allocate')
  const [wallet, setWallet] = useState<ProcurementWallet>(PROCUREMENT)
  const [stock, setStock] = useState<VoucherStockRow[]>(INITIAL_STOCK)
  const [allocations, setAllocations] = useState<StockAllocation[]>(ALLOCATIONS)
  const [pools, setPools] = useState<RegionPool[]>(REGION_POOLS)
  const [log, setLog] = useState<VoucherIssue[]>(ISSUE_LOG)
  const [claims, setClaims] = useState<VoucherClaim[]>(CLAIMS)
  const [adjustments, setAdjustments] = useState<PointAdjustment[]>(ADJUSTMENTS)

  /* Finance procures codes → allocates N units to a location's stock. */
  const allocate = (typeId: string, region: string, qty: number): string | null => {
    const t = typeById(typeId)
    if (!t) return 'Pick a voucher type.'
    if (qty <= 0) return 'Quantity must be at least 1.'
    const cost = qty * t.inr
    if (wallet.allocated - wallet.spent < cost) return `Central wallet can't cover ${fmt(cost)} — top up first.`
    setWallet((w) => ({ ...w, spent: w.spent + cost }))
    setStock((s) => {
      const row = s.find((r) => r.typeId === typeId && r.region === region)
      return row
        ? s.map((r) => (r.typeId === typeId && r.region === region ? { ...r, stock: r.stock + qty } : r))
        : [...s, { typeId, region, stock: qty }]
    })
    setAllocations((a) => [{ id: 'al' + Date.now(), when: 'Just now', typeId, region, qty, cost }, ...a])
    return null
  }

  const topUpWallet = (amount: number) => setWallet((w) => ({ ...w, allocated: w.allocated + amount }))

  /* Program flow: issue one voucher to one person against their region's stock + pool. */
  const issue = (personId: string, typeId: string): string | null => {
    const t = typeById(typeId)
    if (!t) return 'Pick an employee and a voucher.'
    const row = stock.find((r) => r.typeId === typeId && r.region === person(personId).office)
    if (!row || row.stock <= 0) return `No allocated ${t.brand} stock for ${person(personId).office}.`
    const pool = pools.find((x) => x.region === row.region)
    if (!pool) return 'No budget pool for this region.'
    if (pool.allocated - pool.spent < t.points) return `Budget for ${row.region} can't cover ${fmt(t.points)}.`
    setStock((s) => s.map((r) => (r.typeId === typeId && r.region === row.region ? { ...r, stock: r.stock - 1 } : r)))
    setPools((ps) => ps.map((x) => (x.region === row.region ? { ...x, spent: x.spent + t.points } : x)))
    setLog((l) => [{ id: 'i' + Date.now(), when: 'Just now', person: person(personId).name, region: row.region, voucher: `${t.brand} ₹${t.inr.toLocaleString('en-IN')}`, points: t.points }, ...l])
    return null
  }

  const topUpPool = (region: string, amount: number) =>
    setPools((ps) => ps.map((p) => (p.region === region ? { ...p, allocated: p.allocated + amount } : p)))

  return (
    <AdminShell
      role="Finance admin"
      tabs={[
        { key: 'allocate', label: 'Allocate stock' },
        { key: 'vouchers', label: 'Issue vouchers', badge: stock.reduce((s, r) => s + r.stock, 0) },
        { key: 'budget', label: 'Region budgets' },
        { key: 'claims', label: 'Claims', badge: claims.filter((c) => c.status === 'open').length },
        { key: 'adjust', label: 'Point adjustments' },
        { key: 'recon', label: 'Reconciliation' },
        { key: 'reports', label: 'Reports' },
        { key: 'log', label: 'Issue log', badge: log.length },
      ]}
      active={tab}
      onTab={(k) => setTab(k as Tab)}
      onExit={onExit}
    >
      {tab === 'allocate' && <AllocatePanel wallet={wallet} stock={stock} allocations={allocations} onAllocate={allocate} onTopUp={topUpWallet} />}
      {tab === 'vouchers' && <IssuePanel stock={stock} onIssue={issue} />}
      {tab === 'budget' && <BudgetPanel pools={pools} onTopUp={topUpPool} />}
      {tab === 'claims' && <ClaimsPanel claims={claims} setClaims={setClaims} stock={stock} pools={pools} setPools={setPools} />}
      {tab === 'adjust' && <AdjustPanel parts={{
        approvals: PEOPLE_LIST, pools, setPools, adjustments, setAdjustments,
      }} />}
      {tab === 'recon' && <ReconPanel pools={pools} />}
      {tab === 'reports' && <ReportsPanel pools={pools} stock={stock} log={log} allocations={allocations} />}
      {tab === 'log' && <LogPanel log={log} />}
    </AdminShell>
  )
}

function ClaimsPanel({ claims, setClaims, stock, pools, setPools }: { claims: VoucherClaim[]; setClaims: (c: VoucherClaim[]) => void; stock: VoucherStockRow[]; pools: RegionPool[]; setPools: (p: RegionPool[]) => void }) {
  const [msg, setMsg] = useState<string | null>(null)

  const resolve = (claim: VoucherClaim, how: 'reissue' | 'close') => {
    if (how === 'reissue') {
      const v = VOUCHER_TYPES.find((t) => `${t.brand} ₹${t.inr.toLocaleString('en-IN')}` === claim.voucher)
      const row = v && stock.find((s) => s.typeId === v.id && s.region === claim.region)
      if (!v || !row || row.stock <= 0) { setMsg(`No shelf stock of ${claim.voucher} for ${claim.region} — allocate first.`); return }
      if (pools.find((p) => p.region === claim.region && p.allocated - p.spent < claim.points)) { setMsg('Region pool can’t cover the reissue.'); return }
      setPools(pools.map((p) => (p.region === claim.region ? { ...p, spent: p.spent + claim.points } : p)))
      setMsg(`Replacement ${claim.voucher} reserved for ${claim.person}.`)
    } else {
      setMsg('Claim closed — noted in the audit trail.')
    }
    setClaims(claims.map((c) => (c.id === claim.id ? { ...c, status: 'resolved' } : c)))
    setTimeout(() => setMsg(null), 2600)
  }

  const open = claims.filter((c) => c.status === 'open')

  return (
    <div className="space-y-4">
      <PanelHead icon={<RotateCcw size={16} />} tint="bg-coral-soft text-coral" title="Claims" sub="Failed-code disputes" />
      {open.map((c) => (
        <Card key={c.id} className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-extrabold text-navy">{c.person} · <span className="font-bold">{c.points} pts</span></p>
              <p className="text-[11.5px] text-muted">{c.when} · {c.region} · {c.voucher}</p>
            </div>
            <Chip className="bg-gold-soft text-gold-ink">{c.issue}</Chip>
            <div className="ml-auto flex items-center gap-2">
              <Btn size="sm" variant="primary" onClick={() => resolve(c, 'reissue')}>Reissue code</Btn>
              <Btn size="sm" variant="outline" onClick={() => resolve(c, 'close')}>Close</Btn>
            </div>
          </div>
        </Card>
      ))}
      {!open.length && (
        <Card className="p-8 text-center text-[13px] text-muted">No open claims — every dispute has a resolution.</Card>
      )}
      {claims.some((c) => c.status === 'resolved') && (
        <Card className="overflow-hidden p-0">
          <TitleBar>Recently resolved</TitleBar>
          <div className="px-5 py-2">
            {claims.filter((c) => c.status === 'resolved').map((c, i, arr) => (
              <div key={c.id} className={`flex items-center justify-between gap-3 py-2.5 ${i < arr.length - 1 ? 'border-b border-line' : ''}`}>
                <p className="text-[12.5px]"><span className="font-extrabold text-navy">{c.person}</span> · <span className="text-muted">{c.voucher} · {c.when}</span></p>
                <Chip className="bg-mint-soft text-mint">Resolved</Chip>
              </div>
            ))}
          </div>
        </Card>
      )}
      {msg && <p className="rounded-xl bg-gold-soft px-3.5 py-2.5 text-[12.5px] font-bold text-gold-ink">{msg}</p>}
    </div>
  )
}

function AdjustPanel({ parts }: {
  parts: {
    approvals: typeof PEOPLE_LIST
    pools: RegionPool[]
    setPools: (p: RegionPool[]) => void
    adjustments: PointAdjustment[]
    setAdjustments: (a: PointAdjustment[]) => void
  }
}) {
  const { approvals, pools, setPools, adjustments, setAdjustments } = parts
  const [personId, setPersonId] = useState('')
  const [kind, setKind] = useState<'credit' | 'debit'>('credit')
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const selected = personId ? approvals.find((p) => p.id === personId) : null

  const submit = () => {
    const points = Number(amount) || 0
    if (!selected) { setError('Pick an employee.'); return }
    if (points <= 0) { setError('Amount must be positive.'); return }
    if (!reason.trim()) { setError('A reason is required for every manual adjustment.') }
    else {
      const pool = pools.find((p) => p.region === selected.office)
      if (kind === 'credit' && pool && pool.allocated - pool.spent < points) setError(`Region pool for ${selected.office} can't cover ${fmt(points)}.`)
      else {
        setPools(pools.map((p) => (p.region === selected.office ? { ...p, spent: kind === 'credit' ? p.spent + points : Math.max(0, p.spent - points) } : p)))
        setAdjustments([{ id: 'ad' + Date.now(), when: 'Just now', person: selected.name, region: selected.office, kind, points, reason: reason.trim() }, ...adjustments])
        setDone(true); setError(null)
        setAmount(''); setReason('')
        setTimeout(() => setDone(false), 2400)
      }
    }
  }

  return (
    <div className="space-y-4">
      <PanelHead icon={<Wallet size={16} />} tint="bg-gold-soft text-gold-ink" title="Point adjustments" sub="Manual credits and debits" />
      <Card className="p-5">
        <div className="grid gap-4 md:grid-cols-4">
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLS}>Employee</span>
            <select value={personId} onChange={(e) => { setPersonId(e.target.value); setError(null) }} className={SELECT_CLS}>
              <option value="">Select employee…</option>
              {approvals.map((p) => <option key={p.id} value={p.id}>{p.name} · {p.office}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLS}>Kind</span>
            <select value={kind} onChange={(e) => setKind(e.target.value as 'credit' | 'debit')} className={SELECT_CLS}>
              <option value="credit">Credit points</option>
              <option value="debit">Debit points</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLS}>Points</span>
            <input type="number" min={0} value={amount} onChange={(e) => setAmount(e.target.value)} className={`${INPUT_CLS} tnum`} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLS}>Reason</span>
            <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Why…" className={INPUT_CLS} />
          </label>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {selected && <p className="text-[12.5px] text-muted">Debits their <b className="text-navy">{selected.office}</b> pool / credits from it.</p>}
          <Btn className="ml-auto" variant="primary" onClick={submit}>Apply adjustment</Btn>
        </div>
        {error && <p className="mt-3 rounded-xl bg-coral-soft px-3.5 py-2.5 text-[12.5px] font-bold text-coral">{error}</p>}
        {done && <p className="mt-3 flex items-center gap-2 rounded-xl bg-mint-soft px-3.5 py-2.5 text-[12.5px] font-bold text-mint"><Check size={14} /> {kind === 'credit' ? 'Credited' : 'Debited'} — logged above.</p>}
      </Card>

      <Card className="overflow-hidden p-0">
        <TitleBar>Adjustment history</TitleBar>
        <div className="px-5 py-2">
          {adjustments.map((a, i, arr) => (
            <div key={a.id} className={`grid grid-cols-[0.6fr_1.2fr_0.6fr_1.6fr_0.6fr] items-center gap-3 py-2.5 ${i < arr.length - 1 ? 'border-b border-line' : ''}`}>
              <span className="text-[12.5px] text-muted">{a.when}</span>
              <span className="text-[13px] font-extrabold text-navy">{a.person}</span>
              <Chip className={a.kind === 'credit' ? 'bg-mint-soft text-mint' : 'bg-coral-soft text-coral'}>{a.kind}</Chip>
              <span className="text-[12.5px] text-muted">{a.reason}</span>
              <span className="tnum text-[13px] font-extrabold text-navy">{a.kind === 'credit' ? '+' : '−'}{fmt(a.points)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function ReconPanel({ pools }: { pools: RegionPool[] }) {
  const totalLiability = LIABILITY.reduce((s, l) => s + l.outstanding, 0)
  const tiles = [
    { label: 'Vouchers issued', value: `₹${fmt(RECON_SUMMARY.vouchersIssued)}`, hint: 'This quarter' },
    { label: 'Redemptions in', value: `₹${fmt(RECON_SUMMARY.pointsRedeemed)}`, hint: 'Points exchanged for vouchers' },
    { label: 'Outstanding liability', value: `${fmt(totalLiability)} pts`, hint: 'Issued to people, unredeemed' },
  ]
  return (
    <div className="space-y-4">
      <PanelHead icon={<History size={16} />} tint="bg-brand-soft text-brand" title="Reconciliation" sub="Quarter statement" />
      <div className="grid gap-4 md:grid-cols-3">
        {tiles.map((t) => (
          <Card key={t.label} className="p-5">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted">{t.label}</p>
            <p className="tnum mt-2.5 text-[28px] font-extrabold leading-none text-navy">{t.value}</p>
            <p className="mt-1.5 text-[11px] text-muted">{t.hint}</p>
          </Card>
        ))}
      </div>
      <Card className="overflow-hidden p-0">
        <TitleBar>Liability per region · {RECON_SUMMARY.quarter}</TitleBar>
        <div className="px-5 py-2">
          {LIABILITY.map((l, i) => (
            <div key={l.region} className={`flex items-center justify-between gap-3 py-2.5 ${i < LIABILITY.length - 1 ? 'border-b border-line' : ''}`}>
              <span className="text-[13px] font-extrabold text-navy">{l.region}</span>
              <span className="tnum text-[13px] font-extrabold text-navy">{fmt(l.outstanding)} pts</span>
            </div>
          ))}
          <div className="flex items-center justify-between gap-3 border-t border-line py-2.5">
            <span className="text-[13px] font-extrabold text-navy">Total</span>
            <span className="tnum text-[13px] font-extrabold text-navy">{fmt(totalLiability)} pts</span>
          </div>
        </div>
      </Card>
    </div>
  )
}

/* ------------------------------ Allocate stock ------------------------------ */

function AllocatePanel({ wallet, stock, allocations, onAllocate, onTopUp }: {
  wallet: ProcurementWallet
  stock: VoucherStockRow[]
  allocations: StockAllocation[]
  onAllocate: (typeId: string, region: string, qty: number) => string | null
  onTopUp: (amount: number) => void
}) {
  const [typeId, setTypeId] = useState('')
  const [region, setRegion] = useState('')
  const [qty, setQty] = useState(10)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const t = typeId ? VOUCHER_TYPES.find((v) => v.id === typeId) : null
  const cost = t ? qty * t.inr : 0
  const remaining = wallet.allocated - wallet.spent

  const submit = () => {
    const err = onAllocate(typeId, region, qty)
    if (err) { setError(err); setDone(false); return }
    setError(null)
    setDone(true)
    setTimeout(() => setDone(false), 2400)
  }

  return (
    <div className="space-y-4">
      <PanelHead icon={<PackagePlus size={16} />} tint="bg-mint-soft text-mint" title="Allocate stock" />

      <WalletCard wallet={wallet} onTopUp={onTopUp} />

      <Card className="p-5">
        <div className="grid gap-4 md:grid-cols-3">
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLS}>Location</span>
            <select value={region} onChange={(e) => { setRegion(e.target.value); setError(null); setDone(false) }} className={SELECT_CLS}>
              <option value="">Select location…</option>
              {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLS}>{region ? `Voucher · ${region}'s shelf` : 'Voucher'}</span>
            <select value={typeId} disabled={!region} onChange={(e) => { setTypeId(e.target.value); setError(null); setDone(false) }} className={SELECT_CLS}>
              <option value="" disabled hidden>Select voucher…</option>
              {region && VOUCHER_TYPES.map((v) => {
                const inShelf = stock.find((s) => s.typeId === v.id && s.region === region)?.stock ?? 0
                return <option key={v.id} value={v.id}>{v.brand} ₹{v.inr.toLocaleString('en-IN')} · {v.points} pts · {inShelf} in stock</option>
              })}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLS}>Quantity</span>
            <input
              type="number"
              value={qty}
              min={1}
              onChange={(e) => { setQty(Number(e.target.value) || 0); setDone(false) }}
              className={`${INPUT_CLS} tnum`}
            />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {t && region && (
            <p className="text-[12.5px] text-muted">
              Adds <b className="tnum text-navy">{fmt(qty)}</b> × {t.brand} ₹{t.inr.toLocaleString('en-IN')} to <b className="text-navy">{region}</b>'s shelf — costs <b className="tnum text-navy">{fmt(cost)}</b> from the central wallet ({fmt(remaining - cost)} left after).
            </p>
          )}
          <Btn className="ml-auto" variant="primary" disabled={!typeId || !region || qty <= 0} onClick={submit}>
            <Check size={15} /> Allocate
          </Btn>
        </div>

        {error && <p className="mt-3 rounded-xl bg-coral-soft px-3.5 py-2.5 text-[12.5px] font-bold text-coral">{error}</p>}
        {done && <p className="mt-3 flex items-center gap-2 rounded-xl bg-mint-soft px-3.5 py-2.5 text-[12.5px] font-bold text-mint"><Check size={14} /> Allocated — stock is live for that location's issuers.</p>}
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <StockSummary stock={stock} />
        <AllocationHistory allocations={allocations} />
      </div>
    </div>
  )
}

function WalletCard({ wallet, onTopUp }: { wallet: ProcurementWallet; onTopUp: (amount: number) => void }) {
  const [amount, setAmount] = useState('')
  const remaining = wallet.allocated - wallet.spent
  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 basis-64">
          <p className="flex items-center gap-2 text-[15px] font-extrabold text-navy"><Wallet size={16} className="text-brand" /> Central procurement wallet</p>
          <div className="mt-3 grid grid-cols-3 divide-x divide-line rounded-xl border border-line bg-slate-50 py-3 text-center">
            <div><p className="tnum text-[15px] font-extrabold text-navy">{fmt(wallet.allocated)}</p><p className="text-[9.5px] font-bold uppercase tracking-wide text-muted">Allocated ₹</p></div>
            <div><p className="tnum text-[15px] font-extrabold text-navy">{fmt(wallet.spent)}</p><p className="text-[9.5px] font-bold uppercase tracking-wide text-muted">Spent ₹</p></div>
            <div><p className="tnum text-[15px] font-extrabold text-mint">{fmt(remaining)}</p><p className="text-[9.5px] font-bold uppercase tracking-wide text-muted">Remaining ₹</p></div>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end">
          <input
            type="number"
            min={0}
            step={10000}
            value={amount}
            placeholder="Add funds ₹"
            onChange={(e) => setAmount(e.target.value)}
            className={`${INPUT_CLS} tnum w-40`}
          />
          <Btn size="sm" variant="primary" onClick={() => { const n = Number(amount) || 0; if (n <= 0) return; onTopUp(n); setAmount('') }}>Add funds</Btn>
        </div>
      </div>
    </Card>
  )
}

function StockSummary({ stock }: { stock: VoucherStockRow[] }) {
  return (
    <Card className="overflow-hidden p-0">
      <TitleBar>Stock on shelves</TitleBar>
      <div className="px-5 py-2">
        {[...new Set(stock.map((s) => s.region))].map((r) => {
          const rows = stock.filter((s) => s.region === r)
          if (!rows.length) return null
          return (
            <div key={r} className="border-b border-line py-2.5 last:border-b-0">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-muted">{r}</p>
              {rows.map((s) => {
                const t = VOUCHER_TYPES.find((v) => v.id === s.typeId)
                return <p key={s.typeId} className="mt-1 flex items-center justify-between text-[12.5px]"><span className="font-bold text-navy">{t?.brand} ₹{t?.inr.toLocaleString('en-IN')}</span><span className="tnum font-extrabold text-muted">{s.stock} units</span></p>
              })}
            </div>
          )
        })}
      </div>
    </Card>
  )
}

function AllocationHistory({ allocations }: { allocations: StockAllocation[] }) {
  return (
    <Card className="overflow-hidden p-0">
      <TitleBar>Allocation history</TitleBar>
      <div className="px-5 py-2">
        {allocations.slice(0, 8).map((a, i) => {
          const t = VOUCHER_TYPES.find((v) => v.id === a.typeId)
          return (
            <div key={a.id} className={`flex items-center justify-between gap-2 py-2.5 ${i < allocations.length - 1 ? 'border-b border-line' : ''}`}>
              <div className="min-w-0">
                <p className="truncate text-[12.5px] font-bold text-navy">{t ? `${t.brand} ₹${t.inr.toLocaleString('en-IN')}` : '—'} × {a.qty}</p>
                <p className="text-[10.5px] text-muted">{a.when} · {a.region}</p>
              </div>
              <span className="tnum shrink-0 text-[12.5px] font-extrabold text-navy">{fmt(a.cost)}</span>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

/* ------------------------------ Issue vouchers ------------------------------ */

function IssuePanel({ stock, onIssue }: { stock: VoucherStockRow[]; onIssue: (personId: string, typeId: string) => string | null }) {
  const [personId, setPersonId] = useState('')
  const [typeId, setTypeId] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const selectedPerson = personId ? person(personId) : null
  const selected = typeId ? VOUCHER_TYPES.find((v) => v.id === typeId) : null

  const submit = () => {
    const err = onIssue(personId, typeId)
    if (err) { setError(err); setDone(false); return }
    setError(null)
    setDone(true)
    setTimeout(() => setDone(false), 2400)
  }

  return (
    <div className="space-y-4">
      <PanelHead icon={<Gift size={16} />} tint="bg-mint-soft text-mint" title="Issue a voucher" />

      <Card className="p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLS}>Employee</span>
            <select value={personId} onChange={(e) => { setPersonId(e.target.value); setError(null); setDone(false) }} className={SELECT_CLS}>
              <option value="">Select employee…</option>
              {PEOPLE_LIST.map((p) => <option key={p.id} value={p.id}>{p.name} · {p.office}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLS}>Voucher (their location's shelf)</span>
            <select value={typeId} onChange={(e) => { setTypeId(e.target.value); setError(null); setDone(false) }} className={SELECT_CLS}>
              <option value="">Select voucher…</option>
              {selectedPerson && stock.filter((s) => s.region === selectedPerson.office && s.stock > 0).map((s) => {
                const t = VOUCHER_TYPES.find((v) => v.id === s.typeId)
                return <option key={s.typeId} value={s.typeId}>{t?.brand} ₹{t?.inr.toLocaleString('en-IN')} · {t?.points} pts · {s.stock} left</option>
              })}
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {selected && selectedPerson && (
            <p className="text-[12.5px] text-muted">
              Issues from the <b className="text-navy">{selectedPerson.office}</b> shelf — <b className="tnum text-navy">{fmt(selected.points)}</b> pts debited against the recipient.
            </p>
          )}
          <Btn className="ml-auto" variant="primary" disabled={!personId || !typeId} onClick={submit}>
            <Check size={15} /> Issue voucher
          </Btn>
        </div>

        {error && <p className="mt-3 rounded-xl bg-coral-soft px-3.5 py-2.5 text-[12.5px] font-bold text-coral">{error}</p>}
        {done && <p className="mt-3 flex items-center gap-2 rounded-xl bg-mint-soft px-3.5 py-2.5 text-[12.5px] font-bold text-mint"><Check size={14} /> Voucher issued — stock and region pool updated.</p>}
      </Card>

      <Card className="overflow-hidden p-0">
        <TitleBar>Stock on shelves</TitleBar>
        <div className="px-5 py-2">
          {[...new Set(stock.map((s) => s.region))].map((r) => {
            const rows = stock.filter((s) => s.region === r)
            if (!rows.length) return null
            return (
              <div key={r} className="border-b border-line py-2.5 last:border-b-0">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-muted">{r}</p>
                {rows.map((s) => {
                  const t = VOUCHER_TYPES.find((v) => v.id === s.typeId)
                  return <p key={s.typeId} className="mt-1 flex items-center justify-between text-[12.5px]"><span className="font-bold text-navy">{t?.brand} ₹{t?.inr.toLocaleString('en-IN')}</span><span className="tnum font-extrabold text-muted">{s.stock} units</span></p>
                })}
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

/* ------------------------------ Region budgets ------------------------------ */

function BudgetPanel({ pools, onTopUp }: { pools: RegionPool[]; onTopUp: (region: string, amount: number) => void }) {
  const [topUp, setTopUp] = useState<Record<string, number>>({})

  return (
    <div className="space-y-4">
      <PanelHead icon={<Landmark size={16} />} tint="bg-gold-soft text-gold-ink" title="Region budgets" sub="Pools per location" />
      <div className="grid gap-4 md:grid-cols-2">
        {pools.map((p) => {
          const remaining = p.allocated - p.spent
          const pct = Math.min(100, Math.round((p.spent / p.allocated) * 100))
          return (
            <Card key={p.region} className="p-5">
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-2 text-[15px] font-extrabold text-navy"><Landmark size={16} className="text-brand" /> {p.region}</p>
                <Chip className={remaining >= p.allocated * 0.2 ? 'bg-mint-soft text-mint' : 'bg-coral-soft text-coral'}>{pct}% used</Chip>
              </div>
              <div className="mt-3 grid grid-cols-3 divide-x divide-line rounded-xl border border-line bg-slate-50 py-3 text-center">
                <div><p className="tnum text-[15px] font-extrabold text-navy">{fmt(p.allocated)}</p><p className="text-[9.5px] font-bold uppercase tracking-wide text-muted">Allocated ₹</p></div>
                <div><p className="tnum text-[15px] font-extrabold text-navy">{fmt(p.spent)}</p><p className="text-[9.5px] font-bold uppercase tracking-wide text-muted">Spent ₹</p></div>
                <div><p className="tnum text-[15px] font-extrabold text-mint">{fmt(remaining)}</p><p className="text-[9.5px] font-bold uppercase tracking-wide text-muted">Remaining ₹</p></div>
              </div>
              <p className="mt-2.5 text-[11.5px] text-muted">
                Avg spend <b className="tnum text-navy">{fmt(p.weeklyBurn * 4.33)}</b>/mo · at this pace the pool lasts <b className="tnum text-navy">{p.weeklyBurn > 0 ? (remaining / (p.weeklyBurn * 4.33)).toFixed(1) : '∞'}</b> more months
              </p>
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="number"
                  value={topUp[p.region] || ''}
                  min={0}
                  step={10000}
                  placeholder="Top-up amount ₹"
                  onChange={(e) => setTopUp((t) => ({ ...t, [p.region]: Number(e.target.value) || 0 }))}
                  className={`${INPUT_CLS} tnum min-w-0 flex-1`}
                />
                <Btn size="sm" variant="primary" disabled={!topUp[p.region]} onClick={() => { onTopUp(p.region, topUp[p.region] || 0); setTopUp((t) => ({ ...t, [p.region]: 0 })) }}>Add to pool</Btn>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

/* ------------------------------ Issue log ------------------------------ */

function LogPanel({ log }: { log: VoucherIssue[] }) {
  const downloadCsv = () => {
    const rows = [['when', 'employee', 'region', 'voucher', 'points'], ...log.map((x) => [x.when, x.person, x.region, x.voucher, String(x.points)])]
    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'voucher-issue-log.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <PanelHead icon={<History size={16} />} tint="bg-violet-soft text-violet" title="Issue log" sub="Audit trail" />
      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
          <p className="text-[10.5px] font-extrabold uppercase tracking-[0.12em] text-muted">Audit trail</p>
          <Btn size="sm" variant="outline" onClick={downloadCsv}><FileDown size={13} /> Download CSV</Btn>
        </div>
        <div className="px-5 py-2">
          {log.map((x, i) => (
            <div key={x.id} className={`grid grid-cols-[0.6fr_1.2fr_1fr_1.4fr_0.7fr] items-center gap-3 py-2.5 ${i < log.length - 1 ? 'border-b border-line' : ''}`}>
              <span className="text-[12.5px] text-muted">{x.when}</span>
              <span className="text-[13px] font-extrabold text-navy">{x.person}</span>
              <span className="text-[12.5px] text-muted">{x.region}</span>
              <span className="text-[13px] font-bold text-navy">{x.voucher}</span>
              <span className="tnum text-[13px] font-extrabold text-navy">{fmt(x.points)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

/* ------------------------------ Reports (real CSV downloads) ------------------------------ */

function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function ReportsPanel({ pools, stock, log, allocations }: {
  pools: RegionPool[]
  stock: VoucherStockRow[]
  log: VoucherIssue[]
  allocations: StockAllocation[]
}) {
  const [flash, setFlash] = useState<string | null>(null)

  const report = (name: string, rows: string[][]) => {
    downloadCsv(`${name.toLowerCase().replace(/ /g, '-')}-fy26-q4.csv`, rows)
    setFlash(name)
    setTimeout(() => setFlash(null), 2000)
  }

  const reports = [
    {
      id: 'budgets',
      label: 'Region budget statement',
      details: 'Allocated, spent, remaining and weekly runway per location',
      rows: [
        ['region', 'allocated_inr', 'spent_inr', 'remaining_inr', 'weekly_burn_inr', 'runway_weeks'],
        ...pools.map((p) => [p.region, String(p.allocated), String(p.spent), String(p.allocated - p.spent), String(p.weeklyBurn), String(Math.floor((p.allocated - p.spent) / p.weeklyBurn))]),
      ],
    },
    {
      id: 'issues',
      label: 'Voucher issue log',
      details: 'Every voucher issued to an employee this quarter',
      rows: [
        ['when', 'employee', 'region', 'voucher', 'points'],
        ...log.map((x) => [x.when, x.person, x.region, x.voucher, String(x.points)]),
      ],
    },
    {
      id: 'allocations',
      label: 'Stock allocation history',
      details: 'Bulk allocations pushed to each location\'s shelf',
      rows: [
        ['when', 'voucher', 'region', 'qty', 'cost_inr'],
        ...allocations.map((a) => {
          const t = VOUCHER_TYPES.find((v) => v.id === a.typeId)
          return [a.when, t ? `${t.brand} ₹${t.inr.toLocaleString('en-IN')}` : a.typeId, a.region, String(a.qty), String(a.cost)]
        }),
      ],
    },
    {
      id: 'liability',
      label: 'Outstanding liability',
      details: 'Points parked with people, unredeemed',
      rows: [
        ['region', 'outstanding_pts'],
        ...LIABILITY.map((l) => [l.region, String(l.outstanding)]),
        ['Total', String(LIABILITY.reduce((s, l) => s + l.outstanding, 0))],
      ],
    },
  ]

  return (
    <div className="space-y-4">
      <PanelHead icon={<FileDown size={16} />} tint="bg-mint-soft text-mint" title="Reports" sub="CSV from live data" />
      {reports.map((r) => (
        <Card key={r.id} className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-extrabold text-navy">{r.label}</p>
              <p className="text-[11.5px] text-muted">{r.details} · {r.rows.length - 1} rows</p>
            </div>
            {flash === r.label && <Chip className="bg-mint-soft text-mint"><Check size={12} /> Downloaded</Chip>}
            <Btn size="sm" variant="primary" onClick={() => report(r.label, r.rows)}>
              <FileDown size={13} /> Download CSV
            </Btn>
          </div>
        </Card>
      ))}
    </div>
  )
}

/* ------------------------------ shared bits ------------------------------ */

const LABEL_CLS = 'text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted'
const SELECT_CLS = 'rounded-xl border border-line bg-white px-3 py-2.5 text-[13.5px] font-bold text-navy outline-none focus:border-brand/50'
const INPUT_CLS = 'rounded-xl border border-line bg-white px-3 py-2 text-[13px] font-bold text-navy outline-none focus:border-brand/50'

function PanelHead({ icon, tint, title, sub }: { icon: ReactNode; tint: string; title: string; sub?: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tint}`}>{icon}</span>
      <div className="min-w-0 pt-1">
        <p className="text-[16px] font-extrabold text-navy">{title}</p>
        {sub && <p className="text-[12.5px] text-muted">{sub}</p>}
      </div>
    </div>
  )
}

function TitleBar({ children }: { children: ReactNode }) {
  return <p className="border-b border-line px-5 py-3 text-[10.5px] font-extrabold uppercase tracking-[0.12em] text-muted">{children}</p>
}
